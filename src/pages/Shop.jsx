import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import { ProductGridSkeleton } from "../components/product/ProductSkeleton";
import { useProducts } from "../context/ProductContext";
import { CATEGORIES } from "../constants/store";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

export default function Shop() {
  const { products, loading, error, refreshProducts } = useProducts();
  const [params, setParams] = useSearchParams();

  const categorySlug = params.get("category") ?? "";
  const query = params.get("q") ?? "";
  const sort = params.get("sort") ?? "featured";

  const activeCategory = CATEGORIES.find((item) => item.slug === categorySlug);

  // Keeps filters in the URL so a filtered page can be shared or reloaded
  const setParam = (key, value, defaultValue = "") => {
    const next = new URLSearchParams(params);

    if (!value || value === defaultValue) next.delete(key);
    else next.set(key, value);

    setParams(next, { replace: true });
  };

  const visibleProducts = useMemo(() => {
    const text = query.trim().toLowerCase();

    const list = products.filter(
      (product) =>
        (!activeCategory || product.category === activeCategory.label) &&
        (!text || product.name.toLowerCase().includes(text)),
    );

    if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list; // already ordered by the API: featured first, then newest
  }, [products, activeCategory, query, sort]);

  const tabs = [
    { slug: "", label: "All", count: products.length },
    ...CATEGORIES.map((item) => ({
      slug: item.slug,
      label: item.label,
      count: products.filter((product) => product.category === item.label).length,
    })),
  ];

  const clearFilters = () => setParams({}, { replace: true });

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-display text-3xl text-brand-dark sm:text-4xl">
        {activeCategory ? activeCategory.label : "All products"}
      </h1>

      <p className="mt-2 max-w-xl text-brand-muted">
        {activeCategory
          ? activeCategory.description
          : "Dry fruits, seeds and dried berries, packed with care."}
      </p>

      {/* Category tabs */}
      <div
        role="tablist"
        aria-label="Categories"
        className="mt-8 flex gap-7 overflow-x-auto border-b border-brand-dark/15"
      >
        {tabs.map((tab) => {
          const selected = tab.slug === categorySlug || (!tab.slug && !activeCategory);

          return (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setParam("category", tab.slug)}
              className={`-mb-px shrink-0 border-b-2 pb-3 text-sm font-medium transition-colors ${
                selected
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-brand-dark hover:text-brand-primary"
              }`}
            >
              {tab.label}
              {!loading && !error && (
                <span className="ml-1.5 text-brand-muted">{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search + sort */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-80">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
          />

          <input
            type="search"
            value={query}
            onChange={(event) => setParam("q", event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="w-full rounded-md border border-brand-dark/20 bg-white py-2.5 pl-10 pr-3 text-base outline-none placeholder:text-brand-muted focus:border-brand-primary sm:text-sm"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-brand-muted">
          Sort by
          <select
            value={sort}
            onChange={(event) => setParam("sort", event.target.value, "featured")}
            className="rounded-md border border-brand-dark/20 bg-white py-2.5 pl-3 pr-8 text-base text-brand-dark outline-none focus:border-brand-primary sm:text-sm"
          >
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8">
        {loading ? (
          <ProductGridSkeleton />
        ) : error ? (
          <div className="py-16 text-center">
            <p className="font-medium text-brand-dark">{error}</p>

            <button
              type="button"
              onClick={refreshProducts}
              className="mt-5 rounded-md bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Try again
            </button>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="font-display text-2xl text-brand-dark">
              No products match
            </h2>

            <p className="mt-2 text-brand-muted">
              Try a different search or category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 text-sm font-semibold text-brand-primary underline-offset-4 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-brand-muted" aria-live="polite">
              {visibleProducts.length}{" "}
              {visibleProducts.length === 1 ? "product" : "products"}
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
              {visibleProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
