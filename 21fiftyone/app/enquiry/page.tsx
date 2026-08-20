"use client"

import React, { useState, useCallback } from "react";


const FORM_ACTION_URL = "PASTE_YOUR_BIGIN_FORM_ACTION_URL_HERE";

const SERVICE_OPTIONS = [
  "Digital Marketing",
  "SEO",
  "Website Development",
  "Video Production",
  "Influencer Marketing",
  "AI Videos",
] as const;

const BUDGET_OPTIONS = [
  "Below ₹25K",
  "₹25K–₹50K",
  "₹50K–₹1L",
  "₹1L–₹3L",
  "₹3L+",
] as const;

const START_OPTIONS = [
  "Immediately",
  "Within 30 days",
  "1–3 months",
  "Just Exploring",
] as const;

// Small subset of common dial codes. Extend as needed.
const DIAL_CODES = [
  { iso: "in", label: "India", dial: "+91" },
  { iso: "us", label: "United States", dial: "+1" },
  { iso: "gb", label: "United Kingdom", dial: "+44" },
  { iso: "ae", label: "UAE", dial: "+971" },
  { iso: "au", label: "Australia", dial: "+61" },
  { iso: "ca", label: "Canada", dial: "+1" },
  { iso: "sg", label: "Singapore", dial: "+65" },
] as const;

type ServiceOption = (typeof SERVICE_OPTIONS)[number];
type BudgetOption = (typeof BUDGET_OPTIONS)[number];
type StartOption = (typeof START_OPTIONS)[number];

interface FormState {
  name: string;
  company: string;
  dialCode: string;
  mobile: string;
  email: string;
  service: ServiceOption | "";
  budget: BudgetOption | "";
  startTime: StartOption | "";
  requirement: string;
  leadPageUrl: string;
  utmCampaign: string;
  utmSource: string;
  utmContent: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  company: "",
  dialCode: "+91",
  mobile: "",
  email: "",
  service: "",
  budget: "",
  startTime: "",
  requirement: "",
  leadPageUrl: "",
  utmCampaign: "",
  utmSource: "",
  utmContent: "",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_RE = /^([A-Za-z0-9-._%'+/]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,22})$/;
const PHONE_RE = /^[0-9a-zA-Z+.()\-;\s]+$/;

export default function BiginQuoteForm(): React.ReactElement {
  const [values, setValues] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  const validate = useCallback((state: FormState): FieldErrors => {
    const next: FieldErrors = {};

    if (!state.name.trim()) next.name = "Name cannot be empty";
    if (!state.company.trim()) next.company = "Company cannot be empty";

    if (!state.mobile.trim()) {
      next.mobile = "Mobile cannot be empty";
    } else if (!PHONE_RE.test(state.mobile)) {
      next.mobile = "Enter valid numbers";
    }

    if (!state.email.trim()) {
      next.email = "Email cannot be empty";
    } else if (!EMAIL_RE.test(state.email)) {
      next.email = "Enter valid Email";
    }

    if (!state.service) next.service = "Service Interested In? cannot be none.";
    if (!state.budget) next.budget = "Monthly/Project Budget cannot be none.";
    if (!state.startTime) next.startTime = "When do you want to start? cannot be none.";
    if (!state.requirement.trim())
      next.requirement = "Tell Us About Your Requirement cannot be empty";

    return next;
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      const foundErrors = validate(values);
      setErrors(foundErrors);

      if (Object.keys(foundErrors).length > 0) {
        e.preventDefault();
        return;
      }

      // Let the native form submission proceed (POST straight to Zoho's
      // endpoint) — this avoids CORS issues fetch() would hit against
      // forms.zohopublic.*. We just flag submitting/submitted state for UI.
      setSubmitting(true);
      // If you'd rather intercept and POST via fetch/no-cors, prevent
      // default here and build a FormData request instead.
    },
    [values, validate]
  );

  if (submitted) {
    return (
      <div style={styles.wrapper}>
        <div style={{ ...styles.card, textAlign: "center", padding: "48px 32px" }}>
          <h2 style={{ margin: 0, color: "#1980D8" }}>Thanks — we got it!</h2>
          <p style={{ color: "#515159", marginTop: 12 }}>
            We'll be in touch about your quote shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <form
          action={FORM_ACTION_URL}
          method="POST"
          encType="multipart/form-data"
          acceptCharset="UTF-8"
          onSubmit={handleSubmit}
        >
          {/* Zoho anti-spam / routing hidden fields — copy these values
              verbatim from your Bigin embed code. */}
          <input type="hidden" name="xnQsjsdp" value="af6f81c584c217062046341398aea84b365dccb84adfcccc5dcfe47a173e8207" />
          <input type="hidden" name="zc_gad" value="" />
          <input type="hidden" name="xmIwtLD" value="9412ef8e6da1fc62f60a74f8ffb30e9ff1e680d890ab8ab987e86f2154267ab6dd1dcbd5138ff5ebc90cc8c7587b461b" />
          <input type="hidden" name="actionType" value="UG90ZW50aWFscw==" />
          <input type="hidden" name="returnURL" value="null" />
          <input type="hidden" name="Pipeline" value="Sales Pipeline Standard 2" />
          <input type="hidden" name="Stage" value="Qualification" />
          <input type="hidden" name="Lead Source" value="Official Website" />

          <h1 style={styles.header}>2151 Get Quote</h1>

          <Field label="Name" required error={errors.name}>
            <input
              style={inputStyle(!!errors.name)}
              name="Potential Name"
              maxLength={120}
              type="text"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </Field>

          <Field label="Company" required error={errors.company}>
            <input
              style={inputStyle(!!errors.company)}
              name="Accounts.Account Name"
              maxLength={200}
              type="text"
              value={values.company}
              onChange={(e) => setField("company", e.target.value)}
            />
          </Field>

          <Field label="Mobile" required error={errors.mobile}>
            <div style={{ display: "flex", flex: 1 }}>
              <select
                style={{ ...selectStyle(false), width: "auto", minWidth: 90, borderRadius: "4px 0 0 4px", borderRight: 0 }}
                value={values.dialCode}
                onChange={(e) => setField("dialCode", e.target.value)}
              >
                {DIAL_CODES.map((c) => (
                  <option key={c.iso} value={c.dial}>
                    {c.dial} {c.label}
                  </option>
                ))}
              </select>
              <input
                style={{ ...inputStyle(!!errors.mobile), borderRadius: "0 4px 4px 0" }}
                name="Contacts.Mobile"
                maxLength={30}
                type="text"
                value={values.mobile}
                onChange={(e) => setField("mobile", e.target.value)}
              />
            </div>
          </Field>

          <Field label="Email" required error={errors.email}>
            <input
              style={inputStyle(!!errors.email)}
              name="Contacts.Email"
              maxLength={100}
              type="text"
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </Field>

          <Field label="Service Interested In?" required error={errors.service}>
            <select
              style={selectStyle(!!errors.service)}
              name="POTENTIALCF1"
              value={values.service}
              onChange={(e) => setField("service", e.target.value as ServiceOption)}
            >
              <option value="">-None-</option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Monthly/Project Budget" required error={errors.budget}>
            <select
              style={selectStyle(!!errors.budget)}
              name="POTENTIALCF3"
              value={values.budget}
              onChange={(e) => setField("budget", e.target.value as BudgetOption)}
            >
              <option value="">-None-</option>
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </Field>

          <Field label="When do you want to start?" required error={errors.startTime}>
            <select
              style={selectStyle(!!errors.startTime)}
              name="POTENTIALCF2"
              value={values.startTime}
              onChange={(e) => setField("startTime", e.target.value as StartOption)}
            >
              <option value="">-None-</option>
              {START_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tell Us About Your Requirement" required error={errors.requirement}>
            <textarea
              style={{ ...inputStyle(!!errors.requirement), resize: "vertical", height: 100, minHeight: 100, maxHeight: 200 }}
              name="Description"
              maxLength={32000}
              value={values.requirement}
              onChange={(e) => setField("requirement", e.target.value)}
            />
          </Field>

          <Field label="Lead Page URL">
            <input
              style={inputStyle(false)}
              name="POTENTIALCF4"
              maxLength={255}
              type="text"
              value={values.leadPageUrl}
              onChange={(e) => setField("leadPageUrl", e.target.value)}
            />
          </Field>

          <Field label="UTM Campaign">
            <input
              style={inputStyle(false)}
              name="POTENTIALCF7"
              maxLength={255}
              type="text"
              value={values.utmCampaign}
              onChange={(e) => setField("utmCampaign", e.target.value)}
            />
          </Field>

          <Field label="UTM Source">
            <input
              style={inputStyle(false)}
              name="POTENTIALCF5"
              maxLength={255}
              type="text"
              value={values.utmSource}
              onChange={(e) => setField("utmSource", e.target.value)}
            />
          </Field>

          <Field label="UTM Content">
            <input
              style={inputStyle(false)}
              name="POTENTIALCF6"
              maxLength={255}
              type="text"
              value={values.utmContent}
              onChange={(e) => setField("utmContent", e.target.value)}
            />
          </Field>

          <div style={{ display: "flex", marginTop: 40, justifyContent: "flex-start" }}>
            <button
              type="submit"
              disabled={submitting}
              style={styles.submitBtn}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        <a
          href="https://zoho.com/bigin/?utm_source=biginwebforms&utm_medium=organic&utm_id=product"
          target="_blank"
          rel="noreferrer"
          style={styles.poweredBy}
        >
          <span style={{ paddingInlineEnd: 5, color: "#C5D4E5" }}>Powered by</span>
          <img
            src="https://bigin.zoho.com/images/bigin-logo-xs.svg"
            style={{ marginInlineEnd: 5 }}
            alt="Bigin"
          />
          <span>Bigin</span>
        </a>
      </div>
    </div>
  );
}

/* ---------- small presentational helpers ---------- */

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, required, error, children }: FieldProps): React.ReactElement {
  return (
    <div style={{ display: "flex", marginBottom: 20 }}>
      <div style={{ width: "30%", padding: "12px 20px 0 0", wordBreak: "break-word" }}>
        {label}
      </div>
      <div style={{ width: "70%", position: "relative" }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            flex: 1,
            borderInlineStart: required ? "3px solid #ff6a6a" : "none",
            borderStartStartRadius: required ? 4 : 0,
            borderEndStartRadius: required ? 4 : 0,
          }}
        >
          {children}
        </div>
        {error && (
          <div style={{ color: "#FF5050", fontSize: 12, marginTop: 4, textAlign: "right" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    border: `1px solid ${hasError ? "#FD6B6D" : "#BDC8D3"}`,
    boxShadow: hasError ? "0 0 1px 1px #F4A2A2" : "none",
    borderRadius: 4,
    padding: "10px 15px",
    minHeight: 38,
    fontSize: 15,
    fontFamily: "inherit",
    backgroundColor: "#fff",
  };
}

function selectStyle(hasError: boolean): React.CSSProperties {
  return {
    ...inputStyle(hasError),
    appearance: "none",
    minWidth: 70,
  };
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100%",
    width: "100%",
    padding: "30px 0",
    background: "#EAEEF2",
    display: "flex",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    fontSize: 15,
    color: "#222",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: 700,
    borderRadius: 10,
    background: "#fff",
    boxShadow: "0px 0px 2px 0 #00000033",
    padding: "30px 40px 60px",
    position: "relative",
    boxSizing: "border-box",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    paddingBottom: 35,
    margin: 0,
    wordBreak: "break-word",
  },
  submitBtn: {
    padding: "10px 20px",
    borderRadius: 4,
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "inherit",
    cursor: "pointer",
    background: "#1980d8",
    color: "#fff",
    border: "1px solid #1980d8",
  },
  poweredBy: {
    position: "absolute",
    insetInlineStart: 0,
    bottom: 0,
    borderStartEndRadius: 10,
    borderEndStartRadius: 10,
    background: "#23384F",
    fontSize: 13,
    padding: "6px 8px",
    fontFamily: "sans-serif",
    display: "flex",
    alignItems: "center",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 500,
  },
};