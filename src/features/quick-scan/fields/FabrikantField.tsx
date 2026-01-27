import { SelectField } from "uniforms-mui";
import { useField } from "uniforms";
import { manufacturersByType } from "../../../data/productCatalog";

export function FabrikantField() {
  // Get the entire row object instead of a specific field
  const [{ value: selectedProductType }] = useField<string>("productType", {
    initialValue: "",
  });

  const manufacturers = selectedProductType
    ? manufacturersByType[selectedProductType] ?? []
    : [];

  console.log(manufacturers);

  const mfrOptions = manufacturers.map((v) => ({ label: v, value: v }));

  return (
    <SelectField
      name="fabrikant"
      label="Fabrikant"
      fullWidth
      options={mfrOptions}           // same pattern as your working ProductCategoryField
      disabled={!selectedProductType}
      placeholder={
        selectedProductType ? "Kies fabrikant" : "Eerst product type kiezen"
      }
    />
  );
}
