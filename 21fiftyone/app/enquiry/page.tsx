"use client";

/**
 * Zoho Bigin "2151 Get Quote" form — React / TSX port.
 *
 * Notes before you ship:
 * 1. ZOHO_ACTION_URL below is the standard Bigin web-to-record endpoint. The
 *    original HTML snippet had no action attribute, so copy the exact URL from
 *    the <form action="..."> of your embed code if it differs (e.g. the .in or
 *    .eu data centre).
 * 2. The two hidden tokens (xnQsjsdp / xmIwtLD) are form-specific. They are
 *    already filled in from your snippet.
 * 3. Zoho does not allow cross-origin fetch(), so this submits natively into a
 *    hidden iframe. That keeps the user on the page and lets us show a success
 *    state instead of redirecting.
 */

import { useEffect, useRef, useState, type FormEvent } from "react";

const ZOHO_ACTION_URL = "https://bigin.zoho.com/crm/WebToRecordForm";

const ZOHO_TOKENS = {
  xnQsjsdp: "af6f81c584c217062046341398aea84b365dccb84adfcccc5dcfe47a173e8207",
  xmIwtLD:
    "9412ef8e6da1fc62f60a74f8ffb30e9ff1e680d890ab8ab987e86f2154267ab6dd1dcbd5138ff5ebc90cc8c7587b461b",
  actionType: "UG90ZW50aWFscw==", // base64 "Potentials"
};

const SERVICES = [
  "Digital Marketing",
  "SEO",
  "Website Development",
  "Video Production",
  "Influencer Marketing",
  "AI Videos",
] as const;

const BUDGETS = [
  "Below ₹25K",
  "₹25K–₹50K",
  "₹50K–₹1L",
  "₹1L–₹3L",
  "₹3L+",
] as const;

const TIMELINES = [
  "Immediately",
  "Within 30 days",
  "1–3 months",
  "Just Exploring",
] as const;

type Country = { iso: string; name: string; dial: string; flag: string };

const COUNTRIES: Country[] = [
  { iso: "in", name: "India", dial: "+91", flag: "🇮🇳" },
  { iso: "us", name: "United States", dial: "+1", flag: "🇺🇸" },
  { iso: "gb", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { iso: "ae", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪" },
  { iso: "sa", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { iso: "qa", name: "Qatar", dial: "+974", flag: "🇶🇦" },
  { iso: "kw", name: "Kuwait", dial: "+965", flag: "🇰🇼" },
  { iso: "om", name: "Oman", dial: "+968", flag: "🇴🇲" },
  { iso: "bh", name: "Bahrain", dial: "+973", flag: "🇧🇭" },
  { iso: "sg", name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { iso: "my", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { iso: "au", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { iso: "ca", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { iso: "de", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { iso: "fr", name: "France", dial: "+33", flag: "🇫🇷" },
  { iso: "nl", name: "Netherlands", dial: "+31", flag: "🇳🇱" },
  { iso: "ie", name: "Ireland", dial: "+353", flag: "🇮🇪" },
  { iso: "za", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { iso: "nz", name: "New Zealand", dial: "+64", flag: "🇳🇿" },
  { iso: "lk", name: "Sri Lanka", dial: "+94", flag: "🇱🇰" },
  { iso: "np", name: "Nepal", dial: "+977", flag: "🇳🇵" },
  { iso: "bd", name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
  { iso: "ph", name: "Philippines", dial: "+63", flag: "🇵🇭" },
  { iso: "id", name: "Indonesia", dial: "+62", flag: "🇮🇩" },
  { iso: "jp", name: "Japan", dial: "+81", flag: "🇯🇵" },
];

type Values = {
  name: string;
  company: string;
  dialIso: string;
  mobile: string;
  email: string;
  service: string;
  budget: string;
  timeline: string;
  description: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const INITIAL: Values = {
  name: "",
  company: "",
  dialIso: "in",
  mobile: "",
  email: "",
  service: "",
  budget: "",
  timeline: "",
  description: "",
};

const EMAIL_RE = /^([A-Za-z0-9\-._%'+/]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,22})$/;
const PHONE_RE = /^[0-9a-zA-Z+.()\-;\s]+$/;

export default function GetQuoteForm() {
  const [values, setValues] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const submittedOnce = useRef(false);

  // Hidden tracking fields, filled from the current URL.
  const [tracking, setTracking] = useState({
    pageUrl: "",
    utmCampaign: "",
    utmSource: "",
    utmContent: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTracking({
      pageUrl: window.location.href.slice(0, 255),
      utmCampaign: params.get("utm_campaign") ?? "",
      utmSource: params.get("utm_source") ?? "",
      utmContent: params.get("utm_content") ?? "",
    });
  }, []);

  const dial =
    COUNTRIES.find((c) => c.iso === values.dialIso)?.dial ?? "+91";

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function validate(): Errors {
    const e: Errors = {};

    if (!values.name.trim()) e.name = "Name cannot be empty";
    if (!values.company.trim()) e.company = "Company cannot be empty";

    if (!values.mobile.trim()) e.mobile = "Mobile cannot be empty";
    else if (!PHONE_RE.test(values.mobile.trim()))
      e.mobile = "Enter valid numbers";

    if (!values.email.trim()) e.email = "Email cannot be empty";
    else if (!EMAIL_RE.test(values.email.trim()))
      e.email = "Enter valid Email";

    if (!values.service) e.service = "Service Interested In? cannot be none.";
    if (!values.budget) e.budget = "Monthly/Project Budget cannot be none.";
    if (!values.timeline)
      e.timeline = "When do you want to start? cannot be none.";
    if (!values.description.trim())
      e.description = "Tell Us About Your Requirement cannot be empty";

    return e;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      event.preventDefault();
      const firstKey = Object.keys(found)[0];
      formRef.current
        ?.querySelector<HTMLElement>(`[data-field="${firstKey}"]`)
        ?.focus();
      return;
    }

    // Valid — let the native POST through to the hidden iframe.
    submittedOnce.current = true;
    setSubmitting(true);
  }

  function handleIframeLoad() {
    if (!submittedOnce.current) return; // ignore the initial about:blank load
    setSubmitting(false);
    setSubmitted(true);
  }

  function reset() {
    submittedOnce.current = false;
    setValues(INITIAL);
    setErrors({});
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div className="wf-parent">
        <style>{styles}</style>
        <div className="wf-wrapper">
          <div className="wf-form-component wf-success">
            <div className="wf-success-mark" aria-hidden="true">
              ✓
            </div>
            <h2 className="wf-header wf-header-success">Request received</h2>
            <p className="wf-success-text">
              Thanks, {values.name.split(" ")[0] || "there"}. Our team will
              reach you on {dial} {values.mobile} within one business day.
            </p>
            <button type="button" className="wf-btn wf-btn-primary" onClick={reset}>
              Send another request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wf-parent">
      <style>{styles}</style>

      {/* Native POST target — keeps the visitor on this page */}
      <iframe
        name="zoho-bigin-target"
        title="Zoho Bigin submission target"
        style={{ display: "none" }}
        onLoad={handleIframeLoad}
      />

      <div className="wf-wrapper">
        <form
          ref={formRef}
          action={ZOHO_ACTION_URL}
          method="POST"
          target="zoho-bigin-target"
          acceptCharset="UTF-8"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="wf-form-component"
          noValidate
        >
          {/* ---- Zoho system fields. Do not remove. ---- */}
          <input type="hidden" name="xnQsjsdp" value={ZOHO_TOKENS.xnQsjsdp} readOnly />
          <input type="hidden" name="xmIwtLD" value={ZOHO_TOKENS.xmIwtLD} readOnly />
          <input type="hidden" name="actionType" value={ZOHO_TOKENS.actionType} readOnly />
          <input type="hidden" name="zc_gad" value="" readOnly />
          <input type="hidden" name="returnURL" value="null" readOnly />
          <input type="hidden" name="Pipeline" value="Sales Pipeline Standard 2" readOnly />
          <input type="hidden" name="Stage" value="Qualification" readOnly />
          <input type="hidden" name="Lead Source" value="Official Website" readOnly />
          <input type="hidden" name="POTENTIALCF4" value={tracking.pageUrl} readOnly />
          <input type="hidden" name="POTENTIALCF7" value={tracking.utmCampaign} readOnly />
          <input type="hidden" name="POTENTIALCF5" value={tracking.utmSource} readOnly />
          <input type="hidden" name="POTENTIALCF6" value={tracking.utmContent} readOnly />
          {/* Zoho reads the full number, dial code included, from this field */}
          <input
            type="hidden"
            name="Contacts.Mobile"
            value={values.mobile ? `${dial}${values.mobile}` : ""}
            readOnly
          />

          <h1 className="wf-header">2151 Get Quote</h1>

          <Field label="Name" error={errors.name} required>
            <input
              data-field="name"
              name="Potential Name"
              maxLength={120}
              type="text"
              className="wf-field-item wf-field-input"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>

          <Field label="Company" error={errors.company} required>
            <input
              data-field="company"
              name="Accounts.Account Name"
              maxLength={200}
              type="text"
              className="wf-field-item wf-field-input"
              value={values.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </Field>

          <Field label="Mobile" error={errors.mobile} required>
            <div className="wf-phone-group">
              <select
                aria-label="Country dial code"
                className="wf-field-item wf-field-dropdown wf-dial"
                value={values.dialIso}
                onChange={(e) => set("dialIso", e.target.value)}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.iso} value={c.iso}>
                    {c.flag} {c.dial}
                  </option>
                ))}
              </select>
              <input
                data-field="mobile"
                maxLength={30}
                type="tel"
                inputMode="tel"
                className="wf-field-item wf-field-input wf-phone-input"
                value={values.mobile}
                onChange={(e) => set("mobile", e.target.value)}
              />
            </div>
          </Field>

          <Field label="Email" error={errors.email} required>
            <input
              data-field="email"
              name="Contacts.Email"
              maxLength={100}
              type="email"
              className="wf-field-item wf-field-input"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>

          <Field label="Service Interested In?" error={errors.service} required>
            <Select
              field="service"
              name="POTENTIALCF1"
              value={values.service}
              options={SERVICES}
              onChange={(v) => set("service", v)}
            />
          </Field>

          <Field label="Monthly/Project Budget" error={errors.budget} required>
            <Select
              field="budget"
              name="POTENTIALCF3"
              value={values.budget}
              options={BUDGETS}
              onChange={(v) => set("budget", v)}
            />
          </Field>

          <Field
            label="When do you want to start?"
            error={errors.timeline}
            required
          >
            <Select
              field="timeline"
              name="POTENTIALCF2"
              value={values.timeline}
              options={TIMELINES}
              onChange={(v) => set("timeline", v)}
            />
          </Field>

          <Field
            label="Tell Us About Your Requirement"
            error={errors.description}
            required
          >
            <textarea
              data-field="description"
              name="Description"
              maxLength={32000}
              className="wf-field-item wf-field-input wf-text-area-input"
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>

          <div className="wform-btn-wrap">
            <button type="submit" className="wf-btn wf-btn-primary" disabled={submitting}>
              {submitting ? "Sending…" : "Submit"}
            </button>
          </div>

          <a
            className="wform-poweredby-container"
            target="_blank"
            rel="noopener noreferrer"
            href="https://zoho.com/bigin/?utm_source=biginwebforms&utm_medium=organic&utm_id=product"
          >
            <span className="wform-poweredby-label">Powered by</span>
            <img src="https://bigin.zoho.com/images/bigin-logo-xs.svg" alt="" />
            <span>Bigin</span>
          </a>
        </form>
      </div>
    </div>
  );
}

/* ---------- small building blocks ---------- */

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="wf-row">
      <label className="wf-label">{label}</label>
      <div
        className={[
          "wf-field",
          required ? "wf-field-mandatory" : "",
          error ? "wf-field-error-active" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="wf-field-inner">{children}</div>
        {error ? (
          <div className="wf-error-parent-ele">
            <span className="wf-field-error">{error}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Select({
  field,
  name,
  value,
  options,
  onChange,
}: {
  field: string;
  name: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      data-field={field}
      name={name}
      className="wf-field-item wf-field-dropdown"
      value={value || "-None-"}
      onChange={(e) => onChange(e.target.value === "-None-" ? "" : e.target.value)}
    >
      <option value="-None-">-None-</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

/* ---------- styles (ported from the Zoho embed) ---------- */

const styles = `
.wf-parent {
  padding: 30px 0;
  min-height: 100%;
  box-sizing: border-box;
  background-color: #EAEEF2;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  color: #222;
}
.wf-parent * { box-sizing: border-box; }
.wf-wrapper {
  width: 100%;
  max-width: 700px;
  margin: auto;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 2px 0 #00000033;
}
.wf-form-component { padding: 30px 40px 60px; position: relative; }
.wf-header {
  font-size: 22px;
  font-weight: bold;
  padding-bottom: 35px;
  margin: 0;
  word-break: break-word;
}
.wf-row { margin-bottom: 20px; }
.wf-label { display: block; padding: 7px 0; word-break: break-word; }
.wf-field { position: relative; text-align: left; border: 0; }
.wf-field-inner { position: relative; display: flex; flex: 1; }
.wf-field-mandatory .wf-field-inner::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #ff6a6a;
  border-start-start-radius: 4px;
  border-end-start-radius: 4px;
  z-index: 2;
}
.wf-field-input, .wf-field-dropdown {
  width: 100%;
  border: 1px solid #BDC8D3;
  border-radius: 4px;
  padding: 10px 15px;
  min-height: 38px;
  font-size: 15px;
  font-family: inherit;
  background-color: #fff;
  color: #222;
}
.wf-field-input:focus, .wf-field-dropdown:focus { border: 1px solid #1980d8; outline: none; }
.wf-field-dropdown {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='34' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 99%;
  background-position-y: center;
  cursor: pointer;
}
.wf-text-area-input { resize: vertical; height: 100px; min-height: 100px; max-height: 200px; }
.wf-phone-group { display: flex; flex: 1; }
.wf-dial {
  width: auto;
  min-width: 105px;
  flex: 0 0 auto;
  border-radius: 4px 0 0 4px;
  border-right: 0;
  padding-right: 26px;
}
.wf-phone-input { border-radius: 0 4px 4px 0; }
.wf-field-error-active .wf-field-input,
.wf-field-error-active .wf-field-dropdown {
  border: 1px solid #FD6B6D;
  box-shadow: 0 0 1px 1px #F4A2A2;
}
.wf-error-parent-ele { display: flex; justify-content: flex-end; }
.wf-field-error {
  color: #FF5050;
  font-size: 12px;
  margin-top: 4px;
  animation: wfShake 0.82s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes wfShake {
  10%,90% { transform: translate3d(-1px,0,0); }
  20%,80% { transform: translate3d(2px,0,0); }
  30%,50%,70% { transform: translate3d(-4px,0,0); }
  40%,60% { transform: translate3d(4px,0,0); }
}
@media (prefers-reduced-motion: reduce) {
  .wf-field-error { animation: none; }
}
.wform-btn-wrap { display: flex; margin-top: 40px; align-items: center; justify-content: flex-start; }
.wf-btn {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: bold;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid transparent;
}
.wf-btn-primary { background-color: #1980d8; color: #fff; border-color: #1980d8; }
.wf-btn-primary:hover:not(:disabled) { background-color: #1468b0; }
.wf-btn:disabled { opacity: .6; cursor: default; }
.wf-btn:focus-visible { outline: 2px solid #0b4f8a; outline-offset: 2px; }
.wform-poweredby-container {
  position: absolute;
  inset-inline-start: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  border-start-end-radius: 10px;
  border-end-start-radius: 10px;
  background-color: #23384F;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 8px;
  text-decoration: none;
}
.wform-poweredby-label { color: #C5D4E5; }
.wf-success { text-align: center; padding-bottom: 40px; }
.wf-success-mark {
  width: 52px;
  height: 52px;
  line-height: 52px;
  margin: 10px auto 20px;
  border-radius: 50%;
  background: #E6F4EC;
  color: #2e9e6b;
  font-size: 26px;
}
.wf-header-success { padding-bottom: 10px; }
.wf-success-text { margin: 0 0 28px; color: #515159; line-height: 1.5; }
@media screen and (max-width: 590px) {
  .wf-parent { padding: 20px 0; }
  .wf-wrapper { width: calc(100% - 40px); border-radius: 8px; }
  .wf-form-component { padding: 20px 20px 60px; }
  .wf-dial { min-width: 92px; }
}
`;