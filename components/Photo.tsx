import type { ImgHTMLAttributes } from "react";

const SCENE = [640, 1280, 2000];
const DETAIL = [480, 960];

type Props = {
  photo: string;
  alt: string;
  /** Detail crops are 4:5 portrait and come in smaller sizes than full scenes. */
  detail?: boolean;
  sizes: string;
  priority?: boolean;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "alt" | "sizes">;

/** A developed plate from /public/photos, served at the size the layout needs. */
export default function Photo({ photo, alt, detail = false, sizes, priority = false, ...rest }: Props) {
  const widths = detail ? DETAIL : SCENE;
  const [w, h] = detail ? [960, 1200] : [2000, 1333];
  return (
    // Plain img: the plates are pre-sized WebP, so there is nothing for an image optimiser to do.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/photos/${photo}-${widths[1]}.webp`}
      srcSet={widths.map((x) => `/photos/${photo}-${x}.webp ${x}w`).join(", ")}
      sizes={sizes}
      alt={alt}
      width={w}
      height={h}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      {...rest}
    />
  );
}
