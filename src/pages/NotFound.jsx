import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-3xl text-brand-dark sm:text-4xl">
        We can't find that page
      </h1>

      <p className="mt-3 text-brand-muted">
        The link may be broken, or the page may have moved.
      </p>

      <Link
        to="/shop"
        className="mt-7 rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Go to the shop
      </Link>
    </section>
  );
}
