"use client";

import { ArtIllustration, type ArtId } from "@/components/art";
import { useId, useState, type CSSProperties } from "react";

type Side = { art: ArtId; alt: string };

type Props = {
  before: Side;
  after: Side;
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
}: Props) {
  const [value, setValue] = useState(50);
  const hintId = useId();

  return (
    <div className="compare" data-testid="compare">
      <div className="compare__stage" style={{ "--v": value / 100 } as CSSProperties}>
        <figure className="compare__pane compare__pane--before">
          <ArtIllustration id={before.art} alt={before.alt} className="compare__art" preserveAspectRatio="xMidYMid slice" />
          <figcaption>
            <span className="compare__tag">{beforeLabel}</span>
          </figcaption>
        </figure>
        <figure className="compare__pane compare__pane--after">
          <ArtIllustration id={after.art} alt={after.alt} className="compare__art" preserveAspectRatio="xMidYMid slice" />
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
        Drag the handle, tap anywhere on the image, or focus it and use the Left and Right keys. Home and End jump to each side.
      </p>
    </div>
  );
}
