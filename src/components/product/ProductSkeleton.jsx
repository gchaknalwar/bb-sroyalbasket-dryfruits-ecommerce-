// Placeholder grid shown while products load.
// Mirrors the ProductCard layout so the page doesn't jump when real cards arrive.
export function ProductGridSkeleton({ count = 8, className = "" }) {
  const safeCount = Math.max(0, Math.floor(Number(count) || 0));

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={`grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6 ${className}`}
    >
      <span className="sr-only">Loading products…</span>

      {Array.from({ length: safeCount }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex flex-col motion-safe:animate-pulse"
          // staggered start so the grid shimmers in a wave, not all at once
          style={{ animationDelay: `${(index % 4) * 120}ms` }}
        >
          {/* image */}
          <div className="aspect-[4/5] rounded-2xl bg-brand-sand" />

          {/* name + pack size */}
          <div className="mt-4 h-4 w-4/5 rounded-full bg-brand-sand" />
          <div className="mt-2.5 h-3 w-1/3 rounded-full bg-brand-sand/70" />

          {/* price + add button */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="h-5 w-16 rounded-full bg-brand-sand" />
            <div className="h-10 w-20 rounded-full bg-brand-sand/70" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGridSkeleton;
