import { SelectField } from "uniforms-mui";
import { useField } from "uniforms";
import { productsByManufacturer } from "../../../data/productCatalog";

export function ProductCategoryField() {
  const [{ value: selectedMfr }] = useField<string>("fabrikant", { initialValue: false });
  const products = selectedMfr ? (productsByManufacturer[selectedMfr] ?? []) : [];
  const prodOptions = products.map((v) => ({ label: v, value: v }));

  return (
    <SelectField
      name="productCategory"
      label="Product"
      fullWidth
      options={prodOptions}
      disabled={!selectedMfr}
      placeholder={selectedMfr ? "Kies product" : "Eerst fabrikant kiezen"}
    />
  );
}
