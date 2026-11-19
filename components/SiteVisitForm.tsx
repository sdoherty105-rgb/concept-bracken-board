"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { projectTypes, windows } from "@/lib/content";

type Values = {
  window: string;
  name: string;
  contact: string;
  suburb: string;
  projectType: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const empty: Values = { window: "", name: "", contact: "", suburb: "", projectType: "" };

const order: (keyof Values)[] = ["window", "name", "contact", "suburb", "projectType"];

/** Where each error summary link should land. A radio group lands on its first option. */
const target = (k: keyof Values) => (k === "window" ? "v-window-0" : `v-${k}`);

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const isPhone = (s: string) => /^[0-9+()\s-]+$/.test(s) && s.replace(/\D/g, "").length >= 8;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.window) e.window = "Choose a visit window.";
  if (!v.name.trim()) e.name = "Enter your name.";
  const c = v.contact.trim();
  if (!c) e.contact = "Enter a phone number or an email address.";
  else if (!isEmail(c) && !isPhone(c)) e.contact = "Enter a phone number with at least 8 digits, or an email like name@example.com.";
  if (!v.suburb.trim()) e.suburb = "Enter the suburb, so the crew knows where the ground is.";
  return e;
}

type Props = {
  /** Read the starting project type from ?type= in the address. */
  fromQuery?: boolean;
};

/**
 * Site-visit request. Demonstration only: it validates in the browser, never
 * sends anything, and only the visit-window radios carry a name, so a no-JavaScript
 * submit carries no personal data.
 */
export default function SiteVisitForm({ fromQuery = false }: Props) {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState<Values | null>(null);
  const [enhanced, setEnhanced] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setEnhanced(true);
    if (fromQuery) {
      const type = new URLSearchParams(window.location.search).get("type");
      if (type && projectTypes.includes(type)) setValues((prev) => ({ ...prev, projectType: type }));
    }
    return () => window.clearTimeout(timer.current);
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
    if (pending) return;
    const next = validate(values);
    setErrors(next);
    if (order.some((k) => next[k])) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    // A short, local pause so the pending state is visible. Nothing leaves the page.
    setPending(true);
    timer.current = window.setTimeout(() => {
      setPending(false);
      setSubmitted(values);
    }, 600);
  };

  const reset = () => {
    setValues(empty);
    setErrors({});
    setSubmitted(null);
  };

  const errorList = order.filter((k) => errors[k]);

  if (submitted) {
    return (
      <div className="form-success" ref={successRef} tabIndex={-1} role="status" data-testid="visit-success">
        <p className="form-success__kicker">Demo only</p>
        <h3>Thanks, {submitted.name.trim().split(" ")[0]}. Nothing was sent.</h3>
        <p>
          Bracken &amp; Board is fictional, so no visit was booked and your details were not sent, stored or shared. On a real site, the crew
          would confirm the window within a working day.
        </p>
        <dl className="form-success__recap">
          <div><dt>Window</dt><dd>{submitted.window}</dd></div>
          <div><dt>Suburb</dt><dd>{submitted.suburb}</dd></div>
          {submitted.projectType && <div><dt>Job</dt><dd>{submitted.projectType}</dd></div>}
        </dl>
        <button type="button" className="text-button" onClick={reset}>
          Clear and start again
        </button>
      </div>
    );
  }

  const field = (k: keyof Values) => ({
    id: `v-${k}`,
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `v-${k}-error` : undefined,
  });

  const err = (k: keyof Values) =>
    errors[k] ? (
      <p className="field__error" id={`v-${k}-error`}>
        <span className="visually-hidden">Error: </span>
        {errors[k]}
      </p>
    ) : null;

  return (
    <form
      className="form"
      onSubmit={onSubmit}
      noValidate={enhanced}
      action="#visit-demo-sent"
      aria-busy={pending || undefined}
      aria-describedby="visit-demo-note"
      data-testid="visit-form"
    >
      <p className="form__demo-note" id="visit-demo-note">
        <strong>Demo form.</strong> Demonstration visit windows: nothing is held or booked, and nothing you type is sent anywhere.
      </p>
      <div id="visit-demo-sent" className="form__nojs-sent" role="status">
        <strong>Demo only.</strong> Nothing was sent, stored or shared.
      </div>

      {errorList.length > 0 && (
        <div className="form__errors" role="alert" tabIndex={-1} ref={summaryRef}>
          <p>Please fix {errorList.length === 1 ? "this field" : `these ${errorList.length} fields`} to continue:</p>
          <ul>
            {errorList.map((k) => (
              <li key={k}>
                <a href={`#${target(k)}`}>{errors[k]}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset
        className="windows"
        aria-invalid={errors.window ? true : undefined}
        aria-describedby={errors.window ? "v-window-error" : undefined}
      >
        <legend className="label">
          Pick a window <span className="field__req" aria-hidden="true">*</span>
        </legend>
        {windows.map((w, i) => (
          <label key={w} className="window-opt" htmlFor={`v-window-${i}`}>
            <input
              type="radio"
              id={`v-window-${i}`}
              value={w}
              checked={values.window === w}
              onChange={set("window")}
              required
              // The one named control: it groups the radios for arrow keys. A visit window is not personal data.
              name="visit-window"
            />
            <span>{w}</span>
          </label>
        ))}
        {err("window")}
      </fieldset>

      <p className="label form__step">Where and who</p>
      <div className="field">
        <label htmlFor="v-name">Your name <span className="field__req" aria-hidden="true">*</span></label>
        <input type="text" autoComplete="name" required value={values.name} onChange={set("name")} {...field("name")} />
        {err("name")}
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="v-contact">Phone or email <span className="field__req" aria-hidden="true">*</span></label>
          <input type="text" inputMode="email" autoComplete="email" required value={values.contact} onChange={set("contact")} {...field("contact")} />
          {err("contact")}
        </div>
        <div className="field">
          <label htmlFor="v-suburb">Suburb <span className="field__req" aria-hidden="true">*</span></label>
          <input type="text" autoComplete="address-level2" required value={values.suburb} onChange={set("suburb")} {...field("suburb")} />
          {err("suburb")}
        </div>
      </div>

      <div className="field">
        <label htmlFor="v-projectType">The job <span className="field__opt">(optional)</span></label>
        <select value={values.projectType} onChange={set("projectType")} {...field("projectType")}>
          <option value="">Not sure yet</option>
          {projectTypes.filter((t) => t !== "Not sure yet").map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="form__submit" disabled={pending}>
        {pending ? "Holding the window…" : "Request a site visit (demo)"}
      </button>
      <p className="form__fine" aria-live="polite">
        {pending ? "Checking your request in the browser. Nothing is sent." : "Fields marked * are required. This demo never sends your details."}
      </p>
    </form>
  );
}
