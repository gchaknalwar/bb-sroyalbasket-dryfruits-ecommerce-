import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Leaf, Package, Truck, ShieldCheck } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const categories = [
  {
    id: "dry-fruits",
    title: "Dry Fruits",
    badge: "Bestseller",
    itemCount: "24+ Items",
    description:
      "Handpicked premium almonds, cashews, pistachios, walnuts & organic dates.",
    link: "/shop?category=dry-fruits",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "seeds",
    title: "Nutritious Seeds",
    badge: "Trending",
    itemCount: "16+ Items",
    description:
      "Superfood chia, pumpkin, flax, sunflower & chia seed blends for daily immunity.",
    link: "/shop?category=seeds",
    image:
      "https://images.unsplash.com/photo-1508061252966-17332205fd78?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "dried-berries",
    title: "Dried Berries",
    badge: "100% Organic",
    itemCount: "12+ Items",
    description:
      "Naturally dried cranberries, blueberries, raisins & goji berries full of antioxidants.",
    link: "/shop?category=dried-berries",
    image:
      "https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?auto=format&fit=crop&w=1000&q=80",
  },
];

const trust = [
  { icon: Leaf, title: "100% Organic", note: "Directly from farms" },
  { icon: Package, title: "Vacuum Packed", note: "Sealed freshness" },
  { icon: Truck, title: "Fast Dispatch", note: "Within 24 hours" },
  { icon: ShieldCheck, title: "Quality Tested", note: "100% Guaranteed" },
];

/* ------------------------------------------------------------------ */
/* One category panel                                                  */
/* ------------------------------------------------------------------ */

function CategoryPanel({ category, active, onActivate, variants }) {
  return (
    <motion.div
      variants={variants}
      onMouseEnter={onActivate}
      className={`relative h-[430px] overflow-hidden rounded-3xl bg-brand-dark transition-[flex] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[480px] lg:h-[580px] ${
        active ? "lg:flex-[3.2]" : "lg:flex-1"
      }`}
    >
      <Link
        to={category.link}
        onFocus={onActivate}
        aria-label={`Explore ${category.title} collection`}
        className="group absolute inset-0 block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-brand-secondary"
      >
        {/* Image */}
        <img
          src={category.image}
          alt=""
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            active ? "lg:scale-100" : "lg:scale-125"
          } group-hover:scale-105`}
        />

        {/* Shading */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/25 to-brand-dark/5" />
        <div
          className={`absolute inset-0 bg-brand-dark/40 transition-opacity duration-700 ${
            active ? "lg:opacity-0" : "lg:opacity-100"
          }`}
        />

        {/* Top row */}
        <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3 sm:left-6 sm:right-6 sm:top-6">
          <span className="rounded-full bg-brand-cream/90 px-3.5 py-1.5 text-xs font-semibold text-brand-dark backdrop-blur-md">
            {category.badge}
          </span>
          <span
            className={`rounded-full border border-brand-cream/30 px-3 py-1.5 text-xs font-medium text-brand-cream backdrop-blur-md transition-opacity duration-500 ${
              active ? "lg:opacity-100" : "lg:opacity-0"
            }`}
          >
            {category.itemCount}
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6 lg:p-8">
          <div className="min-w-0">
            <h3 className="font-display text-3xl font-medium leading-tight tracking-tight text-brand-cream sm:text-4xl">
              {category.title}
            </h3>

            {/* Description: always visible on mobile, expands on the active desktop panel */}
            <div
              className={`grid grid-rows-[1fr] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                active
                  ? "lg:grid-rows-[1fr] lg:opacity-100"
                  : "lg:grid-rows-[0fr] lg:opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="mt-3 max-w-md text-sm leading-6 text-brand-cream/80 sm:text-base sm:leading-7">
                  {category.description}
                </p>
              </div>
            </div>
          </div>

          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-dark transition-all duration-500 group-hover:-rotate-45 group-hover:bg-brand-secondary sm:h-14 sm:w-14">
            <ArrowRight size={20} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function CategorySection() {
  const [activeId, setActiveId] = useState(categories[0].id);
  const reduce = useReducedMotion();

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
  };
  const itemVariants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 48 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 1, ease: EASE },
    },
  };

  return (
    <section
      aria-labelledby="categories-heading"
      className="relative overflow-hidden bg-brand-cream px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
          <div>
            <p className="mb-6 flex items-center gap-3 text-sm font-medium text-brand-primary">
              <span className="h-px w-10 bg-brand-primary/60" />
              Pure & unprocessed
            </p>
            <h2
              id="categories-heading"
              className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-brand-dark sm:text-5xl lg:text-6xl"
            >
              Naturally Rich.
              <span className="block italic text-brand-primary">
                Truly Premium.
              </span>
            </h2>
          </div>

          <p className="max-w-lg text-base leading-8 text-brand-muted sm:text-lg lg:justify-self-end">
            Sourced directly from certified organic farms. Every pack is
            vacuum-sealed for maximum crunch, freshness, and unbeatable
            nutritional value.
          </p>
        </div>

        {/* Panels */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          onMouseLeave={() => setActiveId(categories[0].id)}
          className="mt-14 flex flex-col gap-4 lg:flex-row"
        >
          {categories.map((category) => (
            <CategoryPanel
              key={category.id}
              category={category}
              active={activeId === category.id}
              onActivate={() => setActiveId(category.id)}
              variants={itemVariants}
            />
          ))}
        </motion.div>

        {/* Trust row */}
        <ul className="mt-16 grid grid-cols-1 gap-y-8 border-t border-brand-primary/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map(({ icon: Icon, title, note }) => (
            <li key={title} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-primary/20 text-brand-primary">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-dark">{title}</p>
                <p className="mt-0.5 text-xs text-brand-muted">{note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
