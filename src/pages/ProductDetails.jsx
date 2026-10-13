import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import ProductCard from "../components/product/ProductCard";
import ProductImage from "../components/product/ProductImage";
import QuantityStepper from "../components/product/QuantityStepper";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import {
  CATEGORIES,
  FREE_SHIPPING_THRESHOLD,
  MAX_QUANTITY_PER_ITEM,
  SHIPPING_FEE,
} from "../constants/store";
import { discountPercent, formatINR } from "../utils/format";

function ProductView({ product, related }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const soldOut = product.stock <= 0;
  const maxQuantity = Math.max(1, Math.min(product.stock, MAX_QUANTITY_PER_ITEM));
  const discount = discountPercent(product.price, product.compareAtPrice);
  const category = CATEGORIES.find((item) => item.label === product.category);

  const handleAdd = () => {
    const result = addToCart(product, quantity);

    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-brand-muted">
        <Link to="/shop" className="hover:text-brand-primary">
          Shop
        </Link>

        {category && (
          <>
            <ChevronRight size={14} />
            <Link
              to={`/shop?category=${category.slug}`}
              className="hover:text-brand-primary"
            >
              {category.label}
            </Link>
          </>
        )}

        <ChevronRight size={14} />
        <span className="text-brand-dark">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-16">
        <ProductImage
          product={product}
          variant="large"
          className="aspect-square w-full rounded-lg lg:sticky lg:top-28 lg:self-start"
        />

        <div>
          <h1 className="font-display text-3xl leading-tight text-brand-dark sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 tabular-nums">
            <span className="text-3xl font-semibold text-brand-dark">
              {formatINR(product.price)}
            </span>

            {discount > 0 && (
              <>
                <span className="ml-3 text-lg text-brand-muted line-through">
                  {formatINR(product.compareAtPrice)}
                </span>
                <span className="ml-3 text-sm font-semibold text-brand-brass">
                  Save {discount}%
                </span>
              </>
            )}
          </p>

          <p className="mt-1 text-sm text-brand-muted">for {product.packSize}</p>

          <p
            className={`mt-4 text-sm font-medium ${
              soldOut
                ? "text-red-700"
                : product.stock <= 5
                  ? "text-amber-800"
                  : "text-brand-primary"
            }`}
          >
            {soldOut
              ? "Sold out"
              : product.stock <= 5
                ? `Only ${product.stock} left`
                : "In stock"}
          </p>

          {product.description && (
            <p className="mt-6 max-w-prose leading-7 text-brand-muted">
              {product.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {!soldOut && (
              <QuantityStepper
                value={quantity}
                onChange={(next) =>
                  setQuantity(Math.min(maxQuantity, Math.max(1, next)))
                }
                max={maxQuantity}
              />
            )}

            <button
              type="button"
              onClick={handleAdd}
              disabled={soldOut}
              className="h-11 flex-1 rounded-md bg-brand-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:bg-brand-dark/15 disabled:text-brand-muted sm:flex-none sm:px-10"
            >
              {soldOut
                ? "Sold out"
                : `Add to basket, ${formatINR(product.price * quantity)}`}
            </button>
          </div>

          <dl className="mt-10 border-t border-brand-dark/15 text-sm">
            <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-brand-dark/15 py-4">
              <dt className="font-medium text-brand-dark">Delivery</dt>
              <dd className="text-brand-muted">
                Free on orders above {formatINR(FREE_SHIPPING_THRESHOLD)},
                otherwise {formatINR(SHIPPING_FEE)}.
              </dd>
            </div>

            <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-brand-dark/15 py-4">
              <dt className="font-medium text-brand-dark">Payment</dt>
              <dd className="text-brand-muted">Cash on delivery.</dd>
            </div>

            <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-brand-dark/15 py-4">
              <dt className="font-medium text-brand-dark">Pack size</dt>
              <dd className="text-brand-muted">{product.packSize}</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-brand-dark/15 pt-10 lg:mt-24">
          <h2 className="font-display text-2xl text-brand-dark">
            More {product.category.toLowerCase()}
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default function ProductDetails() {
  const { slug } = useParams();
  const { products, loading, error, refreshProducts } = useProducts();

  const product = products.find((item) => item.slug === slug);

  if (!product && loading) {
    return (
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="aspect-square animate-pulse rounded-lg bg-brand-sand" />

        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded bg-brand-sand" />
          <div className="h-8 w-1/4 animate-pulse rounded bg-brand-sand" />
          <div className="h-24 animate-pulse rounded bg-brand-sand" />
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-3xl text-brand-dark">
          {error ? "We couldn't load this product" : "Product not found"}
        </h1>

        <p className="mt-3 text-brand-muted">
          {error || "It may have been removed, or the link may be wrong."}
        </p>

        {error ? (
          <button
            type="button"
            onClick={refreshProducts}
            className="mt-7 rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Try again
          </button>
        ) : (
          <Link
            to="/shop"
            className="mt-7 rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Back to the shop
          </Link>
        )}
      </section>
    );
  }

  const related = products
    .filter((item) => item.category === product.category && item._id !== product._id)
    .slice(0, 4);

  // key resets the quantity when moving from one product to another
  return <ProductView key={product._id} product={product} related={related} />;
}
