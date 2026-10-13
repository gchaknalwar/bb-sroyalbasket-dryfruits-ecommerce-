import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  Award,
  Sparkles,
  PackageCheck,
  Store,
  ArrowUpRight,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const features = [
  {
    id: "quality",
    icon: Award,
    badge: "Grade A+",
    title: "Premium Quality",
    description:
      "Handpicked dry fruits, superfood seeds, and berries sourced directly from top organic farms.",
  },
  {
    id: "freshness",
    icon: Sparkles,
    badge: "100% Fresh",
    title: "Fresh & Hygienic",
    description:
      "Nitrogen-flushed and vacuum-sealed packaging to preserve natural crunch, taste, and nutrition.",
  },
  {
    id: "packaging",
    icon: PackageCheck,
    badge: "Tamper Proof",
    title: "Secure Packaging",
    description:
      "Multi-layer eco-friendly zip-locks engineered to prevent moisture and protect during delivery.",
  },
  {
    id: "wholesale",
    icon: Store,
    badge: "Best Rates",
    title: "Retail & Wholesale",
    description:
      "Flexible ordering for personal snacking or bulk commercial orders with custom business pricing.",
  },
];

const stats = [
  { value: 100, suffix: "%", label: "Organic origin" },
  { text: "Same-day", label: "Quality seal" },
  { value: 10000, suffix: "+", label: "Happy customers" },
];

/* ------------------------------------------------------------------ */
/* Count-up number (starts when scrolled into view)                    */
/* ------------------------------------------------------------------ */

function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current || reduce) return;
    const controls = animate(0, to, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent =
            Math.round(v).toLocaleString("en-IN") + suffix;
        }
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, reduce]);

  return <span ref={ref}>{to.toLocaleString("en-IN") + suffix}</span>;
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function WhyChooseUs() {
  const reduce = useReducedMotion();

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
  };
  const rowVariants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 36 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.9, ease: EASE },
    },
  };

  return (
    <section
      aria-labelledby="why-heading"
      className="relative overflow-hidden bg-brand-dark px-4 py-20 text-brand-cream sm:px-6 sm:py-28 lg:px-8"
    >
      {/* soft glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-48 h-[40rem] w-[40rem] rounded-full bg-brand-primary/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* ---------------- Left: sticky intro ---------------- */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <p className="mb-6 flex items-center gap-3 text-sm font-medium text-brand-secondary">
              <span className="h-px w-10 bg-brand-secondary/60" />
              Why BB's Royal Basket
            </p>

            <h2
              id="why-heading"
              className="font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Uncompromised Quality.
              <span className="block italic text-brand-secondary">
                Delivered To Your Door.
              </span>
            </h2>

            <p className="mt-7 max-w-md text-base leading-8 text-brand-cream/70 sm:text-lg">
              Every product passes through strict multi-stage quality checks so
              you receive only pure, healthy, and crunch-rich goodness every
              single time.
            </p>

            <Link
              to="/about"
              className="group mt-9 inline-flex h-12 items-center gap-2 rounded-full border border-brand-cream/25 px-6 text-sm font-semibold text-brand-cream transition-colors duration-300 hover:border-brand-secondary hover:bg-brand-secondary hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              Read our story
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* ---------------- Right: feature rows ---------------- */}
          <motion.ul
            variants={listVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="border-t border-brand-cream/15 lg:col-span-7"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.li
                  key={feature.id}
                  variants={rowVariants}
                  className="group relative border-b border-brand-cream/15"
                >
                  <div className="grid gap-x-6 gap-y-4 py-9 sm:grid-cols-[3rem_1fr_auto] sm:py-10">
                    <span className="hidden pt-3 font-display text-sm text-brand-cream/40 sm:block">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-cream/20 text-brand-secondary transition-colors duration-500 group-hover:border-brand-secondary group-hover:bg-brand-secondary group-hover:text-brand-dark">
                          <Icon size={21} />
                        </span>
                        <h3 className="font-display text-2xl font-medium tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 sm:text-3xl">
                          {feature.title}
                        </h3>
                      </div>

                      <p className="mt-4 max-w-md text-sm leading-7 text-brand-cream/65 sm:pl-16 sm:text-base">
                        {feature.description}
                      </p>
                    </div>

                    <span className="h-fit w-fit self-start rounded-full border border-brand-cream/20 px-3.5 py-1.5 text-xs font-medium text-brand-cream/80 transition-colors duration-300 group-hover:border-brand-secondary group-hover:text-brand-secondary sm:mt-2.5">
                      {feature.badge}
                    </span>
                  </div>

                  {/* hover line */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-brand-secondary transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                  />
                </motion.li>
              );
            })}
          </motion.ul>
        </div>

        {/* ---------------- Stats ---------------- */}
        <dl className="mt-20 grid divide-y divide-brand-cream/15 border-t border-brand-cream/15 sm:mt-28 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="py-8 sm:px-8 sm:py-10 sm:first:pl-0 sm:last:pr-0"
            >
              <dt className="order-2 text-sm text-brand-cream/60">
                {stat.label}
              </dt>
              <dd className="mt-3 font-display text-5xl font-medium tracking-tight text-brand-secondary sm:text-6xl">
                {stat.text ? (
                  stat.text
                ) : (
                  <CountUp to={stat.value} suffix={stat.suffix} />
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
