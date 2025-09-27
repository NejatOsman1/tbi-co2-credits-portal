import { SelectField } from "uniforms-mui";
import { manufacturers } from "../../../data/productCatalog";

export function FabrikantField() {
  const mfrOptions = (manufacturers ?? []).map((v) => ({ label: v, value: v }));
  return (
    <SelectField
      name="fabrikant"
      label="Fabrikant"
      fullWidth
      options={mfrOptions}
    />
  );
}
