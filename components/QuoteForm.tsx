"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { budgets, projectTypes } from "@/lib/content";

type Values = {
  name: string;
  email: string;
  phone: string;
  suburb: string;
  projectType: string;
  budget: string;
  details: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const empty: Values = { name: "", email: "", phone: "", suburb: "", projectType: "", budget: "", details: "" };

const order: (keyof Values)[] = ["name", "email", "phone", "suburb", "projectType", "budget", "details"];

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Enter your name.";
  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter an email address like name@example.com.";
  if (v.phone.trim() && !/^[0-9+()\s-]{8,}$/.test(v.phone.trim())) e.phone = "Enter a phone number with at least 8 digits, or leave it blank.";
  if (!v.projectType) e.projectType = "Choose the closest project type.";
  if (!v.budget) e.budget = "Choose a budget range. A rough idea is fine.";
  return e;
}

type Props = {
  /** The project type to start on. */
  initialType?: string;
  /** Read the starting project type from ?type= in the address (the /start page). */
  fromQuery?: boolean;
};

export default function QuoteForm({ initialType, fromQuery = false }: Props) {
  const [values, setValues] = useState<Values>(() => ({ ...empty, projectType: projectTypes.includes(initialType ?? "") ? initialType! : "" }));
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<Values | null>(null);
  const [enhanced, setEnhanced] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEnhanced(true);
    if (!fromQuery) return;
    const type = new URLSearchParams(window.location.search).get("type");
    if (type && projectTypes.includes(type)) setValues((prev) => ({ ...prev, projectType: type }));
  }, [fromQuery]);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    setValues((prev) => ({ ...prev, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    const first = order.find((k) => next[k]);
    if (first) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setSubmitted(values);
  };

  const reset = () => {
    setValues(empty);
    setErrors({});
    setSubmitted(null);
  };

  const errorList = order.filter((k) => errors[k]);

  if (submitted) {
    return (
      <div className="form-success" ref={successRef} tabIndex={-1} role="status" data-testid="quote-success">
        <p className="form-success__kicker">Demo only</p>
        <h3>Thanks, {submitted.name.trim().split(" ")[0]}. Nothing was sent.</h3>
        <p>
          This is a fictional concept website, so your quote request was not sent, stored or shared anywhere. On a real site, this is where the
          team would reply within a working day.
        </p>
        <dl className="form-success__recap">
          <div><dt>Project</dt><dd>{submitted.projectType}</dd></div>
          <div><dt>Budget</dt><dd>{submitted.budget}</dd></div>
          {submitted.suburb.trim() && <div><dt>Suburb</dt><dd>{submitted.suburb}</dd></div>}
        </dl>
        <button type="button" className="text-button" onClick={reset}>
          Clear and start again
        </button>
      </div>
    );
  }

  const field = (k: keyof Values) => ({
    id: `q-${k}`,
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `q-${k}-error` : undefined,
  });

  const err = (k: keyof Values) =>
    errors[k] ? (
      <p className="field__error" id={`q-${k}-error`}>
        <span className="visually-hidden">Error: </span>
        {errors[k]}
      </p>
    ) : null;

  return (
    <form className="form" onSubmit={onSubmit} noValidate={enhanced} action="#quote-demo-sent" data-testid="quote-form">
      <div className="form__demo-note" role="note">
        <strong>Demo form.</strong> Nothing you type here is sent anywhere.
      </div>
      <div id="quote-demo-sent" className="form__nojs-sent" role="status">
        <strong>Demo only.</strong> Your details were checked in the browser and nothing was sent, stored or shared.
      </div>

      {errorList.length > 0 && (
        <div className="form__errors" role="alert" tabIndex={-1} ref={summaryRef}>
          <p>Please fix {errorList.length === 1 ? "this field" : `these ${errorList.length} fields`} to continue:</p>
          <ul>
            {errorList.map((k) => (
              <li key={k}>
                <a href={`#q-${k}`}>{errors[k]}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="field">
        <label htmlFor="q-name">Full name <span className="field__req" aria-hidden="true">*</span></label>
        <input type="text" autoComplete="name" required value={values.name} onChange={set("name")} {...field("name")} />
        {err("name")}
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="q-email">Email <span className="field__req" aria-hidden="true">*</span></label>
          <input type="email" autoComplete="email" required value={values.email} onChange={set("email")} {...field("email")} />
          {err("email")}
        </div>
        <div className="field">
          <label htmlFor="q-phone">Phone <span className="field__opt">(optional)</span></label>
          <input type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} {...field("phone")} />
          {err("phone")}
        </div>
      </div>

      <div className="field">
        <label htmlFor="q-suburb">Suburb <span className="field__opt">(optional)</span></label>
        <input type="text" autoComplete="address-level2" value={values.suburb} onChange={set("suburb")} {...field("suburb")} />
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="q-projectType">Project type <span className="field__req" aria-hidden="true">*</span></label>
          <select required value={values.projectType} onChange={set("projectType")} {...field("projectType")}>
            <option value="">Choose a project type</option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {err("projectType")}
        </div>
        <div className="field">
          <label htmlFor="q-budget">Budget range <span className="field__req" aria-hidden="true">*</span></label>
          <select required value={values.budget} onChange={set("budget")} {...field("budget")}>
            <option value="">Choose a budget range</option>
            {budgets.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          {err("budget")}
        </div>
      </div>

      <div className="field">
        <label htmlFor="q-details">About the space <span className="field__opt">(optional)</span></label>
        <textarea rows={4} value={values.details} onChange={set("details")} {...field("details")} />
      </div>

      <button type="submit" className="form__submit">
        Send demo quote request
      </button>
      <p className="form__fine">Fields marked * are required. This form is a demonstration and never sends your details.</p>
    </form>
  );
}
