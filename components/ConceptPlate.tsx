import { SITE } from "@/lib/content";

/**
 * Ironbark plate: the fictional-business disclosure, the way back to the
 * OFF/SHIFT concept page, and the studio enquiry link. Same wording on every page.
 */
export default function ConceptPlate({ id }: { id?: string }) {
  return (
    <aside className="concept-plate" id={id} aria-label="About this concept site" data-testid="concept-plate">
      <p className="concept-plate__label">
        <a href={SITE.conceptUrl}>{SITE.conceptLabel}</a>
      </p>
      <p className="concept-plate__note">{SITE.disclosure}</p>
      <a className="concept-plate__cta" href={SITE.studioContactUrl}>
        {SITE.studioCta}
      </a>
    </aside>
  );
}
