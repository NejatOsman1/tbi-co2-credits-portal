import { useMemo } from "react";
import { TextField as MuiTextField } from "@mui/material";
import { HiddenField } from "uniforms-mui";
import { useField } from "uniforms";
import { unitByPair } from "../../../data/productCatalog";

export function AutoEenheidField() {
  const [{ value: fabrikant }] = useField<string>("fabrikant", { initialValue: false });
  const [{ value: productCategory }] = useField<string>("productCategory", { initialValue: false });

  const nextUnit = useMemo(
    () => (fabrikant && productCategory ? unitByPair[fabrikant]?.[productCategory] : ""),
    [fabrikant, productCategory]
  );

  return (
    <>
      <HiddenField name="eenheid" value={nextUnit || ""} />
      <MuiTextField
        label="Eenheid"
        fullWidth
        value={nextUnit || "—"}
        InputProps={{ readOnly: true }}
      />
    </>
  );
}