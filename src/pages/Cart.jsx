import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import ProductImage from "../components/product/ProductImage";
import QuantityStepper from "../components/product/QuantityStepper";
import { useCart } from "../context/CartContext";

import {
  FREE_SHIPPING_THRESHOLD,
  MAX_QUANTITY_PER_ITEM,
  shippingFor,
} from "../constants/store";

import { formatINR } from "../utils/format";

export default function Cart() {
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    hasIssues,
    updateQuantity,
    removeFromCart,
  } = useCart();

  /* ---------------- EMPTY CART ---------------- */

  if (cartItems.length === 0) {
    return (
      <section className="min-h-[75vh] bg-brand-cream px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-brand-dark/5">
            <ShoppingBag
              size={38}
              strokeWidth={1.5}
              className="text-brand-primary"
            />
          </div>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-brand-secondary">
            BB's Royal Basket
          </p>

          <h1 className="mt-3 font-display text-3xl font-bold text-brand-dark sm:text-4xl">
            Your basket is empty
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-brand-muted">
            Your favourite premium dry fruits, seeds and dried berries are
            waiting for you.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-primary px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md"
          >
            Explore our collection
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  /* ---------------- CART CALCULATIONS ---------------- */

  const shipping = shippingFor(cartSubtotal);
  const total = cartSubtotal + shipping;

  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const progress = Math.min(
    100,
    (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  const freeShippingReached = remainingForFree === 0;

  /* ---------------- MAIN CART ---------------- */

  return (
    <section className="min-h-screen bg-brand-cream px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition hover:text-brand-primary"
          >
            <ArrowLeft size={15} />
            Continue shopping
          </Link>

          <div className="mt-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-secondary">
                Your basket
              </p>

              <h1 className="mt-2 font-display text-3xl font-bold text-brand-dark sm:text-4xl">
                Shopping Cart
              </h1>
            </div>

            <p className="text-sm text-brand-muted">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {/* FREE SHIPPING MESSAGE */}

        <div className="mb-8 overflow-hidden rounded-2xl border border-brand-dark/10 bg-white px-5 py-4 shadow-sm">
          {freeShippingReached ? (
            <div className="flex items-center gap-3 text-sm font-medium text-brand-dark">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                <Check size={15} />
              </span>
              🎉 You unlocked free delivery!
            </div>
          ) : (
            <div>
              <div className="flex flex-col justify-between gap-2 text-sm sm:flex-row">
                <p className="text-brand-muted">
                  Add{" "}
                  <span className="font-semibold text-brand-dark">
                    {formatINR(remainingForFree)}
                  </span>{" "}
                  more to unlock free delivery.
                </p>

                <span className="font-semibold text-brand-primary">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-sand">
                <div
                  className="h-full rounded-full bg-brand-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* CONTENT */}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
          {/* CART ITEMS */}

          <div>
            <div className="overflow-hidden rounded-3xl border border-brand-dark/10 bg-white shadow-sm">
              <div className="hidden border-b border-brand-dark/10 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brand-muted sm:grid sm:grid-cols-[1fr_auto]">
                <span>Products</span>
                <span>Amount</span>
              </div>

              <ul className="divide-y divide-brand-dark/10">
                {cartItems.map((item) => {
                  const href = `/product/${item.slug}`;

                  const max = item.stock
                    ? Math.min(item.stock, MAX_QUANTITY_PER_ITEM)
                    : MAX_QUANTITY_PER_ITEM;

                  return (
                    <li
                      key={item.id}
                      className="p-5 transition-colors hover:bg-brand-cream/30 sm:p-6"
                    >
                      <div className="flex gap-4 sm:gap-5">
                        {/* PRODUCT IMAGE */}

                        <Link
                          to={href}
                          className="group shrink-0"
                          aria-label={`View ${item.name}`}
                        >
                          <ProductImage
                            product={item}
                            variant="thumb"
                            className="h-24 w-24 rounded-2xl bg-brand-cream object-cover transition-transform duration-300 group-hover:scale-[1.03] sm:h-28 sm:w-28"
                          />
                        </Link>

                        {/* PRODUCT DETAILS */}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-secondary">
                                {item.categoryName || item.category}
                              </p>

                              <Link
                                to={href}
                                className="mt-1 block truncate font-display text-lg font-bold text-brand-dark transition-colors hover:text-brand-primary"
                              >
                                {item.name}
                              </Link>

                              <p className="mt-1 text-sm text-brand-muted">
                                {item.packSize} · {formatINR(item.price)} each
                              </p>
                            </div>

                            <p className="hidden shrink-0 font-bold tabular-nums text-brand-dark sm:block">
                              {formatINR(item.price * item.quantity)}
                            </p>
                          </div>

                          {/* STOCK ISSUE */}

                          {item.issue && (
                            <p
                              role="alert"
                              className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
                            >
                              {item.issue}{" "}
                              {item.stock > 0
                                ? "Please reduce the quantity."
                                : "Please remove this item."}
                            </p>
                          )}

                          {/* CONTROLS */}

                          <div className="mt-4 flex items-center justify-between gap-4">
                            <QuantityStepper
                              compact
                              value={item.quantity}
                              max={max}
                              label={`Quantity of ${item.name}`}
                              onChange={(next) => updateQuantity(item.id, next)}
                            />

                            <div className="flex items-center gap-4">
                              <p className="font-bold tabular-nums text-brand-dark sm:hidden">
                                {formatINR(item.price * item.quantity)}
                              </p>

                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-muted transition hover:text-red-600"
                              >
                                <Trash2 size={14} />
                                <span className="hidden sm:inline">Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* CONTINUE SHOPPING */}

            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition hover:text-brand-dark"
            >
              <ArrowLeft size={15} />
              Continue shopping
            </Link>
          </div>

          {/* ORDER SUMMARY */}

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="rounded-3xl border border-brand-dark/10 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary">
                Checkout
              </p>

              <h2 className="mt-2 font-display text-2xl font-bold text-brand-dark">
                Order Summary
              </h2>

              <dl className="mt-7 space-y-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-brand-muted">Subtotal</dt>

                  <dd className="font-medium tabular-nums text-brand-dark">
                    {formatINR(cartSubtotal)}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-brand-muted">Delivery</dt>

                  <dd className="font-medium tabular-nums text-brand-dark">
                    {shipping === 0 ? "Free" : formatINR(shipping)}
                  </dd>
                </div>

                <div className="border-t border-brand-dark/10 pt-5">
                  <div className="flex items-end justify-between">
                    <dt className="font-semibold text-brand-dark">Total</dt>

                    <dd className="font-display text-2xl font-bold tabular-nums text-brand-dark">
                      {formatINR(total)}
                    </dd>
                  </div>

                  <p className="mt-1 text-right text-xs text-brand-muted">
                    Inclusive of applicable charges
                  </p>
                </div>
              </dl>

              {/* CHECKOUT */}

              {hasIssues ? (
                <>
                  <button
                    type="button"
                    disabled
                    className="mt-7 w-full cursor-not-allowed rounded-2xl bg-brand-dark/10 px-6 py-4 text-sm font-semibold text-brand-muted"
                  >
                    Continue to checkout
                  </button>

                  <p className="mt-3 text-center text-xs leading-5 text-red-600">
                    Please fix the highlighted items before continuing.
                  </p>
                </>
              ) : (
                <Link
                  to="/checkout"
                  className="group mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md"
                >
                  Continue to checkout
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              )}

              {/* TRUST */}

              <div className="mt-6 border-t border-brand-dark/10 pt-5">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs font-semibold text-brand-dark">
                      Premium
                    </p>
                    <p className="mt-1 text-[10px] text-brand-muted">
                      Quality products
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-brand-dark">
                      Fresh
                    </p>
                    <p className="mt-1 text-[10px] text-brand-muted">
                      Carefully packed
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-brand-dark">
                      Secure
                    </p>
                    <p className="mt-1 text-[10px] text-brand-muted">
                      Safe checkout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
