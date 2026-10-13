import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const marqueeItems = [
  "Almonds",
  "Cashews",
  "Pistachios",
  "Walnuts",
  "Raisins",
  "Dried Berries",
  "Pumpkin Seeds",
  "Chia Seeds",
];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

/** Headline line that slides up from behind a mask */
function RevealLine({ children, delay = 0, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.14em] pr-2 -mb-[0.14em]">
      <motion.span
        className={`block ${className}`}
        initial={reduce ? false : { y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Wrapper that gently pulls its child toward the cursor */
function Magnetic({ children, strength = 0.28 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.2 });

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/** Circular rotating text badge */
function RotatingBadge() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
      className="absolute -right-2 top-10 z-20 h-28 w-28 sm:-right-8 sm:h-32 sm:w-32"
      aria-hidden="true"
    >
      <motion.svg
        viewBox="0 0 120 120"
        className="h-full w-full rounded-full bg-brand-dark text-brand-cream shadow-2xl"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        <defs>
          <path
            id="hero-badge-circle"
            d="M60,60 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0"
          />
        </defs>
        <text
          fill="currentColor"
          fontSize="11"
          fontWeight="600"
          letterSpacing="2"
        >
          <textPath
            href="#hero-badge-circle"
            textLength="252"
            lengthAdjust="spacing"
          >
            Handpicked • Premium • Fresh •
          </textPath>
        </text>
      </motion.svg>
      <span className="absolute inset-0 flex items-center justify-center text-brand-secondary">
        <Leaf size={26} />
      </span>
    </motion.div>
  );
}

/** Infinite horizontal ticker */
function Marquee() {
  const reduce = useReducedMotion();
  const row = (hidden) => (
    <ul
      className="flex shrink-0 items-center gap-10 pr-10"
      aria-hidden={hidden || undefined}
    >
      {marqueeItems.map((item) => (
        <li key={item + hidden} className="flex items-center gap-10">
          <span className="whitespace-nowrap font-display text-2xl italic text-brand-dark/80 sm:text-3xl">
            {item}
          </span>
          <Leaf size={15} className="text-brand-secondary" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative overflow-hidden border-t border-brand-primary/10 py-5">
      <motion.div
        className="flex w-max"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 38, ease: "linear", repeat: Infinity }}
      >
        {row(false)}
        {row(true)}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-brand-cream to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-brand-cream to-transparent sm:w-32" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export default function HeroSection() {
  const reduce = useReducedMotion();
  const imageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);

  return (
    <section className="relative overflow-hidden bg-brand-cream">
      {/* soft glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-brand-secondary/15 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-12 sm:px-6 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-24 lg:pt-16">
        {/* ---------------- Left ---------------- */}
        <div className="relative z-10 lg:col-span-7">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-7 flex items-center gap-3 text-sm font-medium text-brand-primary"
          >
            <span className="h-px w-10 bg-brand-primary/60" />
            Nature's finest selection
          </motion.p>

          <h1 className="font-display text-[clamp(3rem,7.4vw,6.75rem)] font-medium leading-[0.98] tracking-tight text-brand-dark">
            <RevealLine delay={0.15}>A Little Luxury,</RevealLine>
            <RevealLine delay={0.3} className="italic text-brand-primary">
              A Lot of Goodness.
            </RevealLine>
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
            className="mt-8 max-w-lg text-base leading-8 text-brand-muted sm:text-lg"
          >
            Discover a handpicked collection of premium dry fruits, wholesome
            seeds, and delicious dried berries. Carefully selected for quality,
            freshness, and everyday indulgence.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5"
          >
            <Magnetic>
              <Link
                to="/shop"
                className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-brand-primary py-2 pl-8 pr-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-brand-dark transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
                />
                <span className="relative">Explore Collection</span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-cream text-brand-primary transition-transform duration-500 group-hover:rotate-[-45deg]">
                  <ArrowRight size={18} />
                </span>
              </Link>
            </Magnetic>

            <Link
              to="/wholesale"
              className="group relative py-2 text-sm font-semibold text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              Bulk Enquiries
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-brand-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-0 group-hover:origin-right" />
            </Link>
          </motion.div>

          <motion.dl
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mt-14 grid max-w-md grid-cols-3 divide-x divide-brand-primary/15 border-t border-brand-primary/15 pt-7"
          >
            {[
              ["100%", "Quality Focused"],
              ["Fresh", "Carefully Packed"],
              ["Retail +", "Wholesale"],
            ].map(([value, label], i) => (
              <div key={value} className={i === 0 ? "pr-4" : "px-4"}>
                <dt className="font-display text-2xl font-semibold text-brand-primary">
                  {value}
                </dt>
                <dd className="mt-1 text-xs text-brand-muted">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ---------------- Right ---------------- */}
        <div
          ref={imageRef}
          className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none"
        >
          <motion.div
            initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{
              duration: 1.3,
              delay: 0.25,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-brand-secondary/20">
              <motion.img
                src="https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=1200&q=85"
                alt="Premium selection of nuts and dry fruits"
                style={reduce ? { scale: 1.18 } : { y: imageY, scale: 1.18 }}
                className="absolute inset-0 h-full w-full object-cover"
                fetchpriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/35 via-transparent to-transparent" />
            </div>
          </motion.div>

          <RotatingBadge />

          {/* Quality card */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.3, ease: EASE }}
            className="absolute -bottom-6 -left-2 z-20 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-xl backdrop-blur-md sm:-left-10 sm:p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-cream text-brand-primary">
                <Leaf size={22} />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-brand-dark">
                  Naturally Good
                </p>
                <p className="text-xs text-brand-muted">
                  Quality in Every Bite
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Marquee />
    </section>
  );
}
