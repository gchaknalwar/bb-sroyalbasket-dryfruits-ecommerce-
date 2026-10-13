import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import ProductCard from "../product/ProductCard";
import { useProducts } from "../../context/ProductContext";

const REFRESH_MIN_MS = 60_000;
const GAP_PX = 20;
const EASE = [0.22, 1, 0.36, 1];

const ITEM_CLASS = "w-[78%] shrink-0 snap-start sm:w-[48%] lg:w-[23.5%]";

/* ------------------------------------------------------------------ */
/* Skeleton                                                            */
/* ------------------------------------------------------------------ */

function ProductSkeleton() {
  return (
    <li className={ITEM_CLASS} aria-hidden="true">
      <div className="overflow-hidden rounded-2xl border border-brand-dark/10 bg-white p-3">
        <div className="aspect-square w-full animate-pulse rounded-xl bg-brand-dark/10 motion-reduce:animate-none" />
        <div className="mt-4 space-y-2.5">
          <div className="h-4 w-3/4 animate-pulse rounded bg-brand-dark/10 motion-reduce:animate-none" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-brand-dark/10 motion-reduce:animate-none" />
        </div>
        <div className="mt-4 h-11 w-full animate-pulse rounded-xl bg-brand-dark/5 motion-reduce:animate-none" />
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Round arrow button                                                  */
/* ------------------------------------------------------------------ */

function ArrowButton({ direction, disabled, onClick }) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous products" : "Next products"}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-dark/15 bg-white text-brand-dark transition-all duration-300 hover:border-brand-dark hover:bg-brand-dark hover:text-brand-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-brand-dark/15 disabled:hover:bg-white disabled:hover:text-brand-dark"
    >
      <Icon size={18} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function BestSellers({ limit = 8, autoRefresh = true }) {
  const { products, loading, error, refreshProducts: refetch } = useProducts();
  const reduce = useReducedMotion();

  const scrollRef = useRef(null);
  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [thumb, setThumb] = useState({ width: 100, left: 0 });
  const [dragging, setDragging] = useState(false);

  const bestsellers = useMemo(
    () =>
      Array.isArray(products)
        ? products.filter((product) => product?.featured).slice(0, limit)
        : [],
    [products, limit],
  );

  const hasItems = bestsellers.length > 0;
  const showSkeleton = loading && !hasItems;
  const showError = Boolean(error) && !loading && !hasItems;

  /* ---------- Refetch when the tab becomes visible (throttled) ---------- */
  const refetchRef = useRef(refetch);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  useEffect(() => {
    if (!autoRefresh) return;
    let last = Date.now();
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - last < REFRESH_MIN_MS) return;
      if (typeof refetchRef.current !== "function") return;
      last = Date.now();
      refetchRef.current();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [autoRefresh]);

  /* ---------- Carousel state (arrows + progress bar) ---------- */
  const updateIndicators = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, clientWidth, scrollWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    if (scrollWidth <= clientWidth) {
      setThumb({ width: 100, left: 0 });
    } else {
      setThumb({
        width: (clientWidth / scrollWidth) * 100,
        left: (scrollLeft / scrollWidth) * 100,
      });
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateIndicators();
    el.addEventListener("scroll", updateIndicators, { passive: true });

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateIndicators)
        : null;
    ro?.observe(el);
    window.addEventListener("resize", updateIndicators);

    return () => {
      el.removeEventListener("scroll", updateIndicators);
      ro?.disconnect();
      window.removeEventListener("resize", updateIndicators);
    };
  }, [updateIndicators, bestsellers.length, showSkeleton, showError]);

  const scrollByCard = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const first = el.firstElementChild;
    const step = first
      ? first.getBoundingClientRect().width + GAP_PX
      : el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCard("right");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCard("left");
    }
  };

  /* ---------- Mouse drag-to-scroll (touch uses native swipe) ---------- */
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    const el = scrollRef.current;
    if (!d.active || !el) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
    }
    if (d.moved) el.scrollLeft = d.startScroll - dx;
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
  };

  // Stop a drag from being treated as a click on a product link
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  /* ---------- Render guards ---------- */
  if (!loading && !error && !hasItems) return null;

  const retry =
    typeof refetch === "function" ? refetch : () => window.location.reload();

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09 } },
  };
  const itemVariants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 36 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.9, ease: EASE },
    },
  };

  return (
    <section
      aria-labelledby="bestsellers-heading"
      aria-busy={showSkeleton}
      className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* ---------------- Header ---------------- */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-6 flex items-center gap-3 text-sm font-medium text-brand-primary">
              <span className="h-px w-10 bg-brand-primary/60" />
              Customer favourites
            </p>
            <h2
              id="bestsellers-heading"
              className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-brand-dark sm:text-5xl lg:text-6xl"
            >
              Our Best Sellers
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-brand-muted sm:text-lg">
              The picks our customers come back for, chosen for freshness and
              quality in every pack.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <ArrowButton
                direction="left"
                disabled={!canScrollLeft}
                onClick={() => scrollByCard("left")}
              />
              <ArrowButton
                direction="right"
                disabled={!canScrollRight}
                onClick={() => scrollByCard("right")}
              />
            </div>

            <Link
              to="/shop"
              className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-brand-primary pl-6 pr-5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-brand-dark transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
              />
              <span className="relative">Shop All</span>
              <ArrowUpRight
                size={17}
                className="relative transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* ---------------- Error ---------------- */}
        {showError ? (
          <div
            role="alert"
            className="mt-12 flex flex-col items-center rounded-3xl border border-brand-dark/10 bg-brand-cream px-6 py-14 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={24} />
            </span>
            <p className="mt-5 font-display text-2xl font-medium text-brand-dark">
              We couldn't load the best sellers
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-brand-muted">
              Check your internet connection, then try again.
            </p>
            <button
              type="button"
              onClick={retry}
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-brand-primary px-7 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : (
          <>
            {showSkeleton && (
              <p role="status" className="sr-only">
                Loading best sellers
              </p>
            )}

            {/* ---------------- Product rail ---------------- */}
            <div className="relative mt-12">
              <motion.ul
                ref={scrollRef}
                tabIndex={0}
                role="list"
                aria-label="Best selling products. Use the left and right arrow keys to scroll."
                onKeyDown={onKeyDown}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerLeave={endDrag}
                onPointerCancel={endDrag}
                onClickCapture={onClickCapture}
                onDragStart={(e) => e.preventDefault()}
                variants={listVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
                className={`-mx-4 flex gap-5 overflow-x-auto px-4 pb-6 pt-2 [scrollbar-width:none] focus-visible:outline-none sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden ${
                  dragging
                    ? "cursor-grabbing select-none snap-none"
                    : "snap-x snap-mandatory sm:cursor-grab"
                }`}
              >
                {showSkeleton
                  ? Array.from({ length: Math.min(limit, 4) }, (_, i) => (
                      <ProductSkeleton key={i} />
                    ))
                  : bestsellers.map((product) => (
                      <motion.li
                        key={product._id || product.id}
                        variants={itemVariants}
                        className={ITEM_CLASS}
                      >
                        <ProductCard product={product} />
                      </motion.li>
                    ))}
              </motion.ul>

              {/* soft fade hinting at more products */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-white to-transparent transition-opacity duration-500 sm:block ${
                  canScrollRight ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>

            {/* ---------------- Progress bar ---------------- */}
            {!showSkeleton && (canScrollLeft || canScrollRight) && (
              <div
                aria-hidden="true"
                className="relative mt-4 h-0.5 w-full overflow-hidden rounded-full bg-brand-dark/10"
              >
                <div
                  className="absolute top-0 h-full rounded-full bg-brand-primary transition-[left,width] duration-150 ease-out"
                  style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
