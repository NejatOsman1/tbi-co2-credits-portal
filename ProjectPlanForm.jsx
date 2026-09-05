import { useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

/*
  Approach A — fill the Oncra "projectplan" Word template with docxtemplater.

  Setup:
    npm install docxtemplater pizzip file-saver
    Put projectplan_template.docx in your /public folder.

  The template keeps ALL of its own fonts, styles, tables, header/footer and
  logo. This component only supplies values for the {tags} inside it.
  Nothing is re-rendered, so the output is your template, byte-for-byte,
  with the placeholders replaced.
*/

// ---- initial state -------------------------------------------------------

const EMPTY_OPERATOR = {
  legalName: "",
  registration: "",
  address: "",
  contact: "",
  role: "",
};

const EMPTY_PRODUCT = {
  name: "",
  supplier: "",
  epd: "",
  quantity: "",
  unit: "",
  csc: "",
};

const EMPTY_RISK = {
  risk: "",
  likelihood: "",
  impact: "",
  mitigation: "",
};

const INITIAL = {
  // Title & header info table
  projectTitle: "",
  projectOperator: "",
  documentPreparedBy: "",
  preparerContact: "",
  grossFloorArea: "",
  projectType: "",
  projectStage: "",
  submissionDate: "",
  version: "",
  buildingCategory: "",
  submitter: "",
  ownSpecifications: "",

  // Section 1 — project details
  projectDescription: "",
  organizationsIntro: "",
  projectLocation: "",
  scope: "",
  timeline: "",
  media: "",

  // Main project operator (Table 1)
  op1LegalName: "",
  op1Registration: "",
  op1Address: "",
  op1Contact: "",
  op1Role: "",

  // Section 2 — quality criteria
  baselineBuildingType: "",
  additionalitySubsidy: "",
  additionalityValuation: "",
  lifespanCompliance: "",
  lifespanSource: "",

  // Sustainability (2.4)
  sustAdaptationMin: "",
  sustAdaptationAbove: "",
  sustWaterMin: "",
  sustWaterAbove: "",
  sustCircularMin: "",
  sustCircularAbove: "",
  sustPollutionMin: "",
  sustPollutionAbove: "",
  sustBiodiversityMin: "",
  sustBiodiversityAbove: "",

  // Section 3
  reporting: "",
};

export default function ProjectPlanForm() {
  const [form, setForm] = useState(INITIAL);
  const [otherOperators, setOtherOperators] = useState([]); // Table 2 (repeatable)
  const [products, setProducts] = useState([{ ...EMPTY_PRODUCT }]); // 2.1.2 (repeatable rows)
  const [risks, setRisks] = useState([{ ...EMPTY_RISK }]); // Table 5 (repeatable rows)
  const [error, setError] = useState("");

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  // generic helpers for the repeatable lists
  const updateItem = (list, setList) => (i, key) => (e) => {
    const next = [...list];
    next[i] = { ...next[i], [key]: e.target.value };
    setList(next);
  };
  const addItem = (setList, empty) => () =>
    setList((l) => [...l, { ...empty }]);
  const removeItem = (list, setList) => (i) =>
    setList(list.filter((_, idx) => idx !== i));

  const generate = async () => {
    setError("");
    try {
      // 1. load the template that ships with your app
      const res = await fetch("/projectplan_template.docx");
      const buf = await res.arrayBuffer();

      // 2. unzip + init docxtemplater
      const zip = new PizZip(buf);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true, // turns "\n" in a value into real line breaks
      });

      // 3. inject every value. Keys must match the {tags} in the template.
      doc.render({
        ...form,
        otherOperators, // {#otherOperators} ... {/otherOperators}
        products,       // {#products} ... {/products}
        risks,          // {#risks} ... {/risks}
      });

      // 4. build the .docx and download it
      const blob = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      saveAs(blob, `${form.projectTitle || "projectplan"}.docx`);
    } catch (e) {
      // docxtemplater reports template problems (e.g. a broken tag) here
      const detail =
        e?.properties?.errors
          ?.map((x) => x?.properties?.explanation)
          .filter(Boolean)
          .join("; ") || e.message;
      setError(detail);
      console.error(e);
    }
  };

  // ---- tiny presentational helpers (style however you like) --------------
  const Field = ({ label, k, area }) => (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>
        {label}
      </span>
      {area ? (
        <textarea
          value={form[k]}
          onChange={set(k)}
          rows={3}
          style={{ width: "100%" }}
        />
      ) : (
        <input value={form[k]} onChange={set(k)} style={{ width: "100%" }} />
      )}
    </label>
  );

  const Section = ({ title, children }) => (
    <fieldset style={{ marginBottom: 24, padding: 16 }}>
      <legend style={{ fontWeight: 700 }}>{title}</legend>
      {children}
    </fieldset>
  );

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: 16 }}>
      <h1>Oncra project plan</h1>

      <Section title="Project header">
        <Field label="Project title" k="projectTitle" />
        <Field label="Building category (e.g. residential timber apartments)" k="buildingCategory" />
        <Field label="Project operator" k="projectOperator" />
        <Field label="Document prepared by" k="documentPreparedBy" />
        <Field label="Preparer contact details" k="preparerContact" area />
        <Field label="Gross floor area (e.g. 4.250 m²)" k="grossFloorArea" />
        <Field label="Project type" k="projectType" />
        <Field label="Project stage" k="projectStage" />
        <Field label="Submission date (DD/MMM/YYYY)" k="submissionDate" />
        <Field label="Version" k="version" />
        <Field label="Submitter (summary line)" k="submitter" />
        <Field label="Own specifications (optional)" k="ownSpecifications" area />
      </Section>

      <Section title="1. Project details">
        <Field label="1.1 Project description" k="projectDescription" area />
        <Field label="1.2 Involved organizations (intro)" k="organizationsIntro" area />
        <Field label="1.3 Project location & ownership" k="projectLocation" area />
        <Field label="1.4 Scope (GFA details)" k="scope" area />
        <Field label="1.5 Timeline" k="timeline" area />
        <Field label="1.6 Media" k="media" area />
      </Section>

      <Section title="Main project operator (Table 1)">
        <Field label="Legal name" k="op1LegalName" />
        <Field label="Registration number" k="op1Registration" />
        <Field label="Address" k="op1Address" />
        <Field label="Contact details" k="op1Contact" />
        <Field label="Role in the project" k="op1Role" area />
      </Section>

      <Section title="Other project operators (Table 2 — optional, repeatable)">
        {otherOperators.map((op, i) => (
          <div key={i} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}>
            <input placeholder="Legal name" value={op.legalName}
              onChange={updateItem(otherOperators, setOtherOperators)(i, "legalName")}
              style={{ width: "100%", marginBottom: 6 }} />
            <input placeholder="Registration number" value={op.registration}
              onChange={updateItem(otherOperators, setOtherOperators)(i, "registration")}
              style={{ width: "100%", marginBottom: 6 }} />
            <input placeholder="Address" value={op.address}
              onChange={updateItem(otherOperators, setOtherOperators)(i, "address")}
              style={{ width: "100%", marginBottom: 6 }} />
            <input placeholder="Contact details" value={op.contact}
              onChange={updateItem(otherOperators, setOtherOperators)(i, "contact")}
              style={{ width: "100%", marginBottom: 6 }} />
            <input placeholder="Role in the project" value={op.role}
              onChange={updateItem(otherOperators, setOtherOperators)(i, "role")}
              style={{ width: "100%", marginBottom: 6 }} />
            <button type="button" onClick={() => removeItem(otherOperators, setOtherOperators)(i)}>
              Remove operator
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem(setOtherOperators, EMPTY_OPERATOR)}>
          + Add other operator
        </button>
      </Section>

      <Section title="2.1.2 Biobased products (repeatable rows)">
        {products.map((p, i) => (
          <div key={i} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}>
            <input placeholder="Product name" value={p.name}
              onChange={updateItem(products, setProducts)(i, "name")}
              style={{ width: "100%", marginBottom: 6 }} />
            <input placeholder="Supplier / manufacturer" value={p.supplier}
              onChange={updateItem(products, setProducts)(i, "supplier")}
              style={{ width: "100%", marginBottom: 6 }} />
            <input placeholder="EPD nr." value={p.epd}
              onChange={updateItem(products, setProducts)(i, "epd")}
              style={{ width: "100%", marginBottom: 6 }} />
            <div style={{ display: "flex", gap: 6 }}>
              <input placeholder="Quantity" value={p.quantity}
                onChange={updateItem(products, setProducts)(i, "quantity")} style={{ flex: 1 }} />
              <input placeholder="Unit" value={p.unit}
                onChange={updateItem(products, setProducts)(i, "unit")} style={{ flex: 1 }} />
              <input placeholder="CSC (kg CO₂)" value={p.csc}
                onChange={updateItem(products, setProducts)(i, "csc")} style={{ flex: 1 }} />
            </div>
            <button type="button" style={{ marginTop: 6 }}
              onClick={() => removeItem(products, setProducts)(i)}>
              Remove product
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem(setProducts, EMPTY_PRODUCT)}>
          + Add product
        </button>
      </Section>

      <Section title="2. Quality criteria">
        <Field label="2.1.1 Baseline building type (selected)" k="baselineBuildingType" />
        <Field label="2.2 Additionality — subsidy/claim" k="additionalitySubsidy" area />
        <Field label="2.2 Additionality — valuation" k="additionalityValuation" area />
        <Field label="2.3 Lifespan — compliance" k="lifespanCompliance" area />
        <Field label="2.3 Lifespan — source" k="lifespanSource" area />
      </Section>

      <Section title="2.4 Sustainability (six goals)">
        <Field label="Adaptation — minimum" k="sustAdaptationMin" area />
        <Field label="Adaptation — above legal" k="sustAdaptationAbove" area />
        <Field label="Water & marine — minimum" k="sustWaterMin" area />
        <Field label="Water & marine — above legal" k="sustWaterAbove" area />
        <Field label="Circular economy — minimum" k="sustCircularMin" area />
        <Field label="Circular economy — above legal" k="sustCircularAbove" area />
        <Field label="Pollution — minimum" k="sustPollutionMin" area />
        <Field label="Pollution — above legal" k="sustPollutionAbove" area />
        <Field label="Biodiversity — minimum" k="sustBiodiversityMin" area />
        <Field label="Biodiversity — above legal" k="sustBiodiversityAbove" area />
      </Section>

      <Section title="Table 5 — Risks (repeatable rows)">
        {risks.map((r, i) => (
          <div key={i} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}>
            <input placeholder="Risk" value={r.risk}
              onChange={updateItem(risks, setRisks)(i, "risk")}
              style={{ width: "100%", marginBottom: 6 }} />
            <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <input placeholder="Likelihood" value={r.likelihood}
                onChange={updateItem(risks, setRisks)(i, "likelihood")} style={{ flex: 1 }} />
              <input placeholder="Impact" value={r.impact}
                onChange={updateItem(risks, setRisks)(i, "impact")} style={{ flex: 1 }} />
            </div>
            <input placeholder="Mitigation" value={r.mitigation}
              onChange={updateItem(risks, setRisks)(i, "mitigation")}
              style={{ width: "100%", marginBottom: 6 }} />
            <button type="button" onClick={() => removeItem(risks, setRisks)(i)}>
              Remove risk
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem(setRisks, EMPTY_RISK)}>
          + Add risk
        </button>
      </Section>

      <Section title="3. Monitoring, reporting, verification">
        <Field label="3.2 Reporting" k="reporting" area />
      </Section>

      {error && (
        <p style={{ color: "crimson" }}>Template error: {error}</p>
      )}

      <button onClick={generate} style={{ padding: "10px 20px", fontSize: 16 }}>
        Save — generate Word document
      </button>
    </div>
  );
}
