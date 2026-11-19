"use client";

import { takeoff } from "@/lib/takeoff";
import { useState, type FormEvent } from "react";

const tonnes = new Intl.NumberFormat("en-AU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const count = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 0 });

function Blocks({ pallets }: { pallets: number }) {
  const shown = Math.min(pallets, 12);
  const rows: { n: number; offset: boolean }[] = [];
  let left = shown;
  let i = 0;
  while (left > 0) {
    const n = Math.min(4, left);
    rows.push({ n, offset: i % 2 === 1 });
    left -= n;
    i += 1;
  }
  return (
    <div className="mini-bond" aria-hidden="true">
      {rows.map((row, r) => (
        <div key={r} className={row.offset ? "mini-row mini-row--offset" : "mini-row"}>
          {Array.from({ length: row.n }, (_, c) => (
            <span key={c} className="mini-cell" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function BondBoard({ initialArea, initialDepth }: { initialArea: number; initialDepth: number }) {
  const [area, setArea] = useState(initialArea);
  const [depth, setDepth] = useState(initialDepth);
  const result = takeoff(area, depth);
  const summary = `${tonnes.format(result.baseTonnes)} tonnes of base, ${tonnes.format(result.sandTonnes)} tonnes of sand, ${count.format(result.pavers)} pavers, ${count.format(result.pallets)} pallets. Demonstration takeoff.`;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form className="bond-form" method="get" action="/takeoff" onSubmit={onSubmit} id="bond-board">
      <p className="label">Bond board</p>
      <h3 id="bond-title">Materials takeoff</h3>
      <p className="demo-note">Demonstration takeoff. These densities and pallet counts are invented. This is not a quote.</p>
      <div className="bond-form__fields">
        <div className="field">
          <label htmlFor="takeoff-area">Area in square metres</label>
          <input
            id="takeoff-area"
            name="area"
            type="number"
            inputMode="decimal"
            min={1}
            max={500}
            step={1}
            defaultValue={initialArea}
            onInput={(e) => {
              const n = Number(e.currentTarget.value);
              if (Number.isFinite(n)) setArea(n);
            }}
          />
        </div>
        <div className="field">
          <label htmlFor="takeoff-depth">Base depth in millimetres</label>
          <input
            id="takeoff-depth"
            name="depth"
            type="number"
            inputMode="numeric"
            min={50}
            max={300}
            step={10}
            defaultValue={initialDepth}
            onInput={(e) => {
              const n = Number(e.currentTarget.value);
              if (Number.isFinite(n)) setDepth(n);
            }}
          />
        </div>
      </div>
      <button type="submit" className="bond-form__submit">
        Update takeoff
      </button>
      <p className="fine">Base at 2.0 tonnes per cubic metre. Sand bed 30 mm at 1.6 tonnes. Pavers at 50 per square metre, 400 per pallet.</p>
      <div className="bond-result" aria-live="polite">
        <dl className="bond-result__nums">
          <div>
            <dt>Base</dt>
            <dd>{tonnes.format(result.baseTonnes)} t</dd>
          </div>
          <div>
            <dt>Sand</dt>
            <dd>{tonnes.format(result.sandTonnes)} t</dd>
          </div>
          <div>
            <dt>Pavers</dt>
            <dd>{count.format(result.pavers)}</dd>
          </div>
          <div>
            <dt>Pallets</dt>
            <dd>{count.format(result.pallets)}</dd>
          </div>
        </dl>
        <Blocks pallets={result.pallets} />
        {result.pallets > 12 ? <p className="fine">Showing 12 of {count.format(result.pallets)} pallets.</p> : null}
        <p className="visually-hidden">{summary}</p>
      </div>
    </form>
  );
}
