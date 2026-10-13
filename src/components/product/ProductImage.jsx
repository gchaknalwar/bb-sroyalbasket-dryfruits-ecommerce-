import { useEffect, useRef, useState } from "react";
import { Leaf } from "lucide-react";

const TINTS = {
  "Dry Fruits": "bg-[#EBE0CB]",
  Seeds: "bg-[#DCE3D0]",
  "Dried Berries": "bg-[#E7D4CF]",
};

// Shows the product photo. While it loads you see a soft tinted skeleton, and
// once it arrives it fades in. If there is no photo (or it fails to load) a
// pack-label style placeholder is shown, so the catalogue always looks finished.
export default function ProductImage({
  product,
  variant = "card",
  className = "",
}) {
  const imgRef = useRef(null);
  const [failedSrc, setFailedSrc] = useState("");
  const [loadedSrc, setLoadedSrc] = useState("");

  const src = product?.image || "";
  const name = product?.name || "Product";
  const showPhoto = Boolean(src) && failedSrc !== src;
  const loaded = loadedSrc === src;
  const tint = TINTS[product?.category] ?? "bg-brand-sand";

  // Images that were already cached can finish before React attaches onLoad
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) setLoadedSrc(src);
  }, [src]);

  if (!product) return null;

  const isLarge = variant === "large";

  /* ---------------- Photo ---------------- */
  if (showPhoto) {
    return (
      <div className={`relative overflow-hidden ${tint} ${className}`}>
        {/* skeleton while the photo loads */}
        {!loaded && (
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-white/40 motion-reduce:animate-none"
          />
        )}

        <img
          ref={imgRef}
          src={src}
          alt={name}
          loading={isLarge ? "eager" : "lazy"}
          fetchPriority={isLarge ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoadedSrc(src)}
          onError={() => setFailedSrc(src)}
          className={`h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    );
  }

  /* ---------------- Thumbnail placeholder ---------------- */
  if (variant === "thumb") {
    return (
      <div
        role="img"
        aria-label={name}
        className={`relative flex items-center justify-center overflow-hidden ${tint} ${className}`}
      >
        <span className="font-display text-2xl text-brand-dark/60">
          {name.charAt(0).toUpperCase() || "•"}
        </span>
      </div>
    );
  }

  /* ---------------- Pack-label placeholder ---------------- */
  return (
    <div
      role="img"
      aria-label={name}
      className={`relative overflow-hidden ${tint} ${className}`}
    >
      {/* soft paper highlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.6),transparent_62%)]"
      />

      <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[88%] rounded-sm border border-brand-dark/25 p-1.5">
          <div className="flex flex-col items-center border border-brand-dark/15 px-3 py-7 text-center sm:py-10">
            <Leaf
              size={isLarge ? 24 : 18}
              className="text-brand-primary/70"
              aria-hidden="true"
            />

            <span className="mt-2 font-display text-[11px] text-brand-dark/60">
              BB's Royal Basket
            </span>

            <span
              className={`mt-4 break-words font-display leading-tight text-brand-dark ${
                isLarge ? "text-3xl sm:text-4xl" : "text-lg sm:text-xl"
              }`}
            >
              {name}
            </span>

            {/* ornamental divider */}
            <span aria-hidden="true" className="mt-4 flex items-center gap-2">
              <span className="h-px w-6 bg-brand-dark/30" />
              <span className="h-1 w-1 rotate-45 bg-brand-dark/40" />
              <span className="h-px w-6 bg-brand-dark/30" />
            </span>

            {product.packSize && (
              <span className="mt-4 text-xs text-brand-dark/70">
                {product.packSize}
              </span>
            )}

            {product.category && (
              <span className="mt-1.5 text-[11px] text-brand-dark/45">
                {product.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
