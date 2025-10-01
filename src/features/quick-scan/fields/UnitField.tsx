import { useEffect, useMemo } from "react";
import { TextField } from "@mui/material";
import { useField } from "uniforms";
import { unitByPair } from "../../../data/productCatalog";

export function AutoEenheidField() {
  const [{ value: fabrikant }]       = useField<string>("fabrikant", { initialValue: false });
  const [{ value: productCategory }] = useField<string>("productCategory", { initialValue: false });

  const nextUnit = useMemo(() => {
    return fabrikant && productCategory ? unitByPair[fabrikant]?.[productCategory] : "";
  }, [fabrikant, productCategory]);

  return (
    <TextField
      label="Eenheid"
      fullWidth
      value={nextUnit || "—"}
      InputProps={{ readOnly: true }}
    />
  );
}
