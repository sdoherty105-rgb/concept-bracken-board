import { SITE } from "@/lib/content";

/** Ironbark plate. On the home page it sits under the hero rule. */
export default function ConceptPlate({ id }: { id?: string }) {
  return (
    <p className="concept-plate" id={id}>
      <a href={SITE.conceptUrl} rel="noopener">
        {SITE.conceptLabel}
      </a>
    </p>
  );
}
