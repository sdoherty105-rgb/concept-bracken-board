"use client";

import { useEffect, useRef, useState } from "react";
import QuoteForm from "./QuoteForm";
import { START_EVENT } from "./StartLink";

/** The quote form in a side drawer, opened by any StartLink on the page. */
export default function StartDrawer() {
  const ref = useRef<HTMLDialogElement>(null);
  const [type, setType] = useState<string | undefined>();
  const [round, setRound] = useState(0);

  useEffect(() => {
    const open = (e: Event) => {
      setType((e as CustomEvent<{ type?: string }>).detail?.type);
      setRound((r) => r + 1);
      ref.current?.showModal();
    };
    window.addEventListener(START_EVENT, open);
    return () => window.removeEventListener(START_EVENT, open);
  }, []);

  return (
    <dialog
      ref={ref}
      className="drawer"
      aria-labelledby="drawer-title"
      onClick={(e) => {
        if (e.target === ref.current) ref.current.close();
      }}
    >
      <div className="drawer__inner">
        <div className="drawer__head">
          <h2 id="drawer-title">Start a project</h2>
          <button type="button" className="drawer__close" onClick={() => ref.current?.close()}>
            Close
          </button>
        </div>
        <p className="drawer__lede">Tell us about the space. A rough idea is enough to begin with.</p>
        <QuoteForm key={round} initialType={type} />
      </div>
    </dialog>
  );
}
