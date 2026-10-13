import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Check, Plus } from "lucide-react";

import { useCart } from "../../context/CartContext";
import { discountPercent, formatINR } from "../../utils/format";
import ProductImage from "./ProductImage";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const resetTimer = useRef(null);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const handleAdd = useCallback(async () => {
    if (!product || adding) return;

    const toastId = `cart-${product._id || product.id || product.slug}`;
    setAdding(true);

    try {
      const result = (await addToCart(product, 1)) ?? {
        ok: true,
        message: "Added to basket",
      };

      if (result.ok) {
        toast.success(result.message, { id: toastId });
        setAdded(true);
        clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(() => setAdded(false), 1800);
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch {
      toast.error("Couldn't add this item. Please try again.", { id: toastId });
    } finally {
      setAdding(false);
    }
  }, [addToCart, adding, product]);

  if (!product) return null;

  // Sold out only when stock is a real number at or below zero
  const stockNumber = Number(product.stock);
  const hasStockInfo = product.stock != null && Number.isFinite(stockNumber);
  const soldOut = hasStockInfo && stockNumber <= 0;
  const lowStock = hasStockInfo && stockNumber > 0 && stockNumber <= 5;

  const discount = discountPercent(product.price, product.compareAtPrice);
  const href = `/product/${product.slug}`;

  return (
    <article className="group relative flex h-full flex-col">
      {/* ---------------- Image ---------------- */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-dark/5">
        <Link
          to={href}
          tabIndex={-1}
          aria-hidden="true"
          className="block h-full w-full"
        >
          <ProductImage
            product={product}
            className={`h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              soldOut ? "opacity-60 grayscale-[0.4]" : "group-hover:scale-105"
            }`}
          />
        </Link>

        {(soldOut || discount > 0) && (
          <span
            className={`pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
              soldOut
                ? "bg-brand-cream text-brand-dark"
                : "bg-brand-secondary text-brand-dark"
            }`}
          >
            {soldOut ? "Sold out" : `${discount}% off`}
          </span>
        )}
      </div>

      {/* ---------------- Details ---------------- */}
      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="font-display text-lg leading-snug text-brand-dark">
          {/* Stretched link: the whole card is clickable */}
          <Link
            to={href}
            className="transition-colors duration-300 after:absolute after:inset-0 after:rounded-2xl hover:text-brand-primary focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand-primary focus-visible:after:ring-offset-2"
          >
            {product.name}
          </Link>
        </h3>

        {product.packSize && (
          <p className="mt-1 text-sm text-brand-muted">{product.packSize}</p>
        )}

        {lowStock && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-800">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-600 motion-reduce:animate-none"
            />
            Only {stockNumber} left
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="tabular-nums">
            <span className="text-lg font-semibold text-brand-dark">
              {formatINR(product.price)}
            </span>

            {discount > 0 && (
              <span className="ml-2 text-sm text-brand-muted line-through">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </p>

          <button
            type="button"
            onClick={handleAdd}
            disabled={soldOut || adding}
            aria-label={
              soldOut
                ? `${product.name} is sold out`
                : `Add ${product.name} to basket`
            }
            className={`relative z-10 inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed ${
              soldOut
                ? "border-brand-dark/20 text-brand-muted"
                : added
                  ? "border-brand-primary bg-brand-primary text-white"
                  : "border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white active:scale-95"
            }`}
          >
            {soldOut ? (
              "Sold out"
            ) : added ? (
              <>
                <Check size={15} /> Added
              </>
            ) : (
              <>
                <Plus size={15} /> Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Screen-reader confirmation */}
      <span className="sr-only" role="status" aria-live="polite">
        {added ? `${product.name} added to basket` : ""}
      </span>
    </article>
  );
}

export default memo(ProductCard);
