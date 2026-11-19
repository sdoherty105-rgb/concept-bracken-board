import type { Plate } from "@/lib/content";
import type { ImgHTMLAttributes } from "react";

type Props = {
  plate: Plate;
  sizes: string;
  priority?: boolean;
  alt?: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "alt" | "sizes" | "width" | "height">;

/** A composed plate from /public/photos. Pre-sized AVIF, no image optimiser. */
export default function Photo({ plate, sizes, priority = false, alt = plate.alt, ...rest }: Props) {
  const srcSet = plate.widths.map((w) => `/photos/${plate.photo}-${w}.avif ${w}w`).join(", ");
  const srcWidth = plate.widths[Math.min(1, plate.widths.length - 1)];
  const src = `/photos/${plate.photo}-${srcWidth}.avif`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={plate.width}
      height={plate.height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      {...rest}
    />
  );
}
