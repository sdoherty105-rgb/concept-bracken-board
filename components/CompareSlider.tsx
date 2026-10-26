"use client";

import Photo from "@/components/Photo";
import type { Plate } from "@/lib/content";
import { useId, useState, type CSSProperties } from "react";

type Props = {
  before: Plate;
  after: Plate;
  sizes: string;
  beforeLabel?: string;
  afterLabel?: string;
  title: string;
};

export default function CompareSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  title,
  sizes,
}: Props) {
  const [value, setValue] = useState(50);
  const hintId = useId();

  return (
    <div className="compare" data-testid="compare">
      <div className="compare__stage" style={{ "--v": value / 100 } as CSSProperties}>
        <figure className="compare__pane compare__pane--before">
          <Photo photo={before.photo} alt={before.alt} sizes={sizes} className="compare__img" />
          <figcaption>
            <span className="compare__tag">{beforeLabel}</span>
          </figcaption>
        </figure>
        <figure className="compare__pane compare__pane--after">
          <Photo photo={after.photo} alt={after.alt} sizes={sizes} className="compare__img" />
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
          <span className="compare__knob" />
        </div>
      </div>
      <p className="compare__hint" id={hintId}>
        Drag across the plate, or use the Left and Right keys. Home and End jump to each side.
      </p>
    </div>
  );
}
