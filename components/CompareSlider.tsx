"use client";

import { useId, useState, type CSSProperties } from "react";

type Side = { src: string; alt: string };

type Props = {
  before: Side;
  after: Side;
  beforeLabel?: string;
  afterLabel?: string;
  title: string;
  priority?: boolean;
};

export default function CompareSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  title,
  priority = false,
}: Props) {
  const [value, setValue] = useState(50);
  const hintId = useId();

  return (
    <div className="compare" data-testid="compare">
      <div className="compare__stage" style={{ "--v": value / 100 } as CSSProperties}>
        <figure className="compare__pane compare__pane--before">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={before.src}
            alt={before.alt}
            width={1200}
            height={800}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
          <figcaption>
            <span className="compare__tag">{beforeLabel}</span>
          </figcaption>
        </figure>
        <figure className="compare__pane compare__pane--after">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={after.src}
            alt={after.alt}
            width={1200}
            height={800}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
          <figcaption>
            <span className="compare__tag">{afterLabel}</span>
          </figcaption>
        </figure>
        <input
          className="compare__range"
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label={`${title}: drag to compare before and after`}
          aria-describedby={hintId}
          aria-valuetext={`${value}% before, ${100 - value}% after`}
        />
        <div className="compare__divider" aria-hidden="true">
          <span className="compare__knob">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
      <p className="compare__hint" id={hintId}>
        Drag the handle, tap anywhere on the image, or focus it and use the arrow keys. Home and End jump to each side.
      </p>
    </div>
  );
}
