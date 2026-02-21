import { useEffect, RefObject } from "react";
import type { FormModel } from "../../forms/types";

type SetModel = React.Dispatch<React.SetStateAction<FormModel>>;

export function useSyncQuickScanFromPreScanElements(
  structuralElements: FormModel["structuralElements"],
  setModel: SetModel,
  quickScanInitialized: RefObject<Boolean>
): void {
  useEffect(() => {
   setModel((prev) => {
      
        const src = prev.structuralElements ?? [];
        const prevQS = prev.quickScan ?? [];
  
        // If no structural elements, do nothing
        if (src.length === 0) return prev;
  
        // Check if we need to update
        const lengthChanged = prevQS.length !== src.length;
  
        // Check if any element/productType in structuralElements differs from quickScan
        const hasNewData = src.some((row, i) => {
          const existing = prevQS[i];
          return (
            row?.elements && !existing?.element ||
            row?.productTypes && !existing?.productType
          );
        });
  
     if (!quickScanInitialized.current || lengthChanged || hasNewData) {
          const nextQS = src.map((row, i) => {
            const existing = prevQS[i];
  
            return {
              // Prefill from structural elements only if empty
              element: existing?.element || row?.elements || "",
              productType: existing?.productType || row?.productTypes || "",
              fabrikant: existing?.fabrikant ?? "",
              productCategory: existing?.productCategory ?? "",
              aantal: existing?.aantal ?? 1,
              eenheid: existing?.eenheid ?? "",
            };
          });
  
       quickScanInitialized.current = true;
          return { ...prev, quickScan: nextQS };
        }
  
        return prev;
      });
  }, [structuralElements, setModel]);
}
