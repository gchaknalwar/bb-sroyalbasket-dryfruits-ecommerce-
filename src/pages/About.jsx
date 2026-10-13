import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  animate,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Hand,
  PackageCheck,
  Plus,
  Quote,
  ShieldCheck,
  Sprout,
  Store,
  Truck,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

/* =====================================================================
   CONTENT
   Everything you may want to change lives in this block.

   CLIENT-CONFIRM: all wording below is written to match claims already on
   your website (organic farms, handpicked, vacuum-sealed, quality checks,
   24-hour dispatch, retail + wholesale). Please confirm each one with the
   client, and replace the founder note with the real one.
   ===================================================================== */

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=1800&q=80",
  dryFruits:
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80",
  seeds:
    "https://images.unsplash.com/photo-1508061252966-17332205fd78?auto=format&fit=crop&w=900&q=80",
  berries:
    "https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?auto=format&fit=crop&w=900&q=80",
};

const STORY = {
  lead: "Good dry fruits, seeds and berries should taste the way nature intended: fresh, crunchy and full of flavour.",
  paragraphs: [
    "That simple belief is why BB's Royal Basket exists. We handpick every variety for quality, source it from farms we trust, and check each batch before it is packed.",
    "Every pack is sealed to protect its freshness and sent to your door, whether you are stocking up for your family or buying in bulk for your business.",
    "Our promise is small and clear: a little luxury for your everyday table, and a lot of goodness in every bite.",
  ],
};

// CLIENT-CONFIRM: replace with the founder's real words (and name, if they want it shown)
const FOUNDER_NOTE = {
  quote:
    "We never wanted to build just another dry fruit shop. We wanted to build the one we would trust for our own family: honest about where the food comes from, careful in how it is packed, and generous in every bite.",
  signature: "The BB's Royal Basket family",
};

// CLIENT-CONFIRM: these numbers already appear on the site (WhyChooseUs, Footer, categories)
const STATS = [
  { value: 100, suffix: "%", label: "Organic origin" },
  { value: 10000, suffix: "+", label: "Happy customers" },
  { value: 50, suffix: "+", label: "Products in the basket" },
  { value: 24, suffix: " hrs", label: "Dispatch time" },
];

const VALUES = [
  {
    icon: Hand,
    title: "Handpicked quality",
    text: "Every variety is chosen by hand for size, colour and taste, so what you open is what you hoped for.",
  },
  {
    icon: Sprout,
    title: "Sourced with care",
    text: "We buy directly from organic farms, so we know exactly where your food begins.",
  },
  {
    icon: PackageCheck,
    title: "Sealed fresh",
    text: "Vacuum-sealed packs lock in the crunch, the taste and the nutrition until you open them.",
  },
  {
    icon: Store,
    title: "Made for everyone",
    text: "One pack for your table or bulk orders for your business, with the same care in both.",
  },
];

const JOURNEY = [
  {
    icon: Sprout,
    title: "Sourced from the farm",
    text: "We work directly with organic farms and choose only produce that meets our standard.",
  },
  {
    icon: ShieldCheck,
    title: "Checked, batch by batch",
    text: "Each batch goes through multiple quality checks before it is allowed anywhere near a pack.",
  },
  {
    icon: PackageCheck,
    title: "Sealed for freshness",
    text: "Packs are vacuum-sealed in secure, moisture-resistant packaging to keep every bite crisp.",
  },
  {
    icon: Truck,
    title: "On its way to you",
    text: "Orders are dispatched within 24 hours and packed to arrive in the same condition they left us.",
  },
];

const BASKET = [
  {
    title: "Dry Fruits",
    text: "Almonds, cashews, pistachios, walnuts and dates, handpicked for size and flavour.",
    image: IMAGES.dryFruits,
    to: "/category/dry-fruits",
    offset: "",
  },
  {
    title: "Nutritious Seeds",
    text: "Chia, pumpkin, flax and sunflower seeds for everyday wellness.",
    image: IMAGES.seeds,
    to: "/category/seeds",
    offset: "lg:mt-14",
  },
  {
    title: "Dried Berries",
    text: "Cranberries, blueberries, raisins and goji berries, naturally dried and full of antioxidants.",
    image: IMAGES.berries,
    to: "/category/dried-berries",
    offset: "lg:mt-6",
  },
];

const FAQS = [
  {
    q: "Where does your produce come from?",
    a: "We source directly from organic farms and choose only produce that meets our quality standard.",
  },
  {
    q: "How is everything packed?",
    a: "Packs are vacuum-sealed in multi-layer, eco-friendly zip-lock packaging that keeps moisture out and protects your order in transit.",
  },
  {
    q: "Do you sell in bulk?",
    a: "Yes. We serve both everyday shoppers and businesses, with custom pricing for bulk orders.",
    link: { to: "/wholesale", label: "See wholesale options" },
  },
  {
    q: "How quickly will my order ship?",
    a: "Orders are dispatched within 24 hours, so your basket reaches you fresh.",
    link: { to: "/shipping-policy", label: "Read our shipping policy" },
  },
  {
    q: "What if something isn't right?",
    a: "Tell us and we will make it right. Our returns and refunds policy explains exactly how it works.",
    link: { to: "/refund-policy", label: "Returns & refunds" },
  },
];

/* =====================================================================
   Small helpers
   ===================================================================== */

function Eyebrow({ children, tone = "primary" }) {
  const color =
    tone === "light" ? "text-brand-secondary" : "text-brand-primary";
  const line =
    tone === "light" ? "bg-brand-secondary/60" : "bg-brand-primary/60";
  return (
    <p className={`mb-6 flex items-center gap-3 text-sm font-medium ${color}`}>
      <span className={`h-px w-10 ${line}`} />
      {children}
    </p>
  );
}

/** Headline line that slides up from behind a mask on page load */
function RevealLine({ children, delay = 0, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em] pr-2">
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

/** Fades and rises into place the first time it scrolls into view */
function FadeUp({ children, delay = 0, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Number that counts up the first time it scrolls into view */
function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current || reduce) return;
    const controls = animate(0, to, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (value) => {
        if (ref.current) {
          ref.current.textContent =
            Math.round(value).toLocaleString("en-IN") + suffix;
        }
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, reduce]);

  return <span ref={ref}>{to.toLocaleString("en-IN") + suffix}</span>;
}

/** Image that drifts slowly inside its frame while you scroll */
function ParallaxImage({ src, alt, className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={reduce ? { scale: 1.2 } : { y, scale: 1.2 }}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

/* =====================================================================
   Sections
   ===================================================================== */

function Hero() {
  const reduce = useReducedMotion();
  const imageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      aria-labelledby="story-heading"
      className="relative overflow-hidden bg-brand-cream px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-brand-secondary/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <Eyebrow>Our story</Eyebrow>

        <h1
          id="story-heading"
          className="font-display text-[clamp(3rem,8.6vw,8rem)] font-medium leading-[0.96] tracking-tight text-brand-dark"
        >
          <RevealLine delay={0.1}>Born from a love for</RevealLine>
          <RevealLine delay={0.25} className="italic text-brand-primary">
            honest, natural food.
          </RevealLine>
        </h1>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
          className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end"
        >
          <p className="max-w-xl text-base leading-8 text-brand-muted sm:text-lg lg:col-span-6">
            BB's Royal Basket began with a simple idea: everyday snacking can be
            both indulgent and good for you. This is how we do it, from the farm
            to your table.
          </p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-6 lg:justify-end">
            <Link
              to="/shop"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-brand-primary px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream"
            >
              Explore the collection
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>

        {/* Wide parallax image */}
        <motion.div
          ref={imageRef}
          initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="relative mt-14 aspect-[4/3] overflow-hidden rounded-[2rem] bg-brand-secondary/20 sm:aspect-[16/9] lg:aspect-[21/9]"
        >
          <motion.img
            src={IMAGES.hero}
            alt="A premium selection of nuts and dry fruits"
            style={reduce ? { scale: 1.2 } : { y: imageY, scale: 1.2 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/35 via-transparent to-transparent" />

          <p className="absolute bottom-5 left-5 right-5 text-sm font-medium text-white sm:bottom-7 sm:left-8 sm:text-base">
            Handpicked <span aria-hidden="true">·</span> Sealed fresh{" "}
            <span aria-hidden="true">·</span> Delivered with care
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section
      aria-labelledby="beginning-heading"
      className="bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>The beginning</Eyebrow>
          <h2
            id="beginning-heading"
            className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-brand-dark sm:text-5xl lg:text-6xl"
          >
            A little luxury,
            <span className="block italic text-brand-primary">
              a lot of goodness.
            </span>
          </h2>
        </div>

        <div className="space-y-7 lg:col-span-7">
          <FadeUp>
            <p className="font-display text-2xl font-medium leading-snug text-brand-dark sm:text-3xl">
              {STORY.lead}
            </p>
          </FadeUp>

          {STORY.paragraphs.map((text, i) => (
            <FadeUp key={text} delay={0.05 * (i + 1)}>
              <p className="max-w-2xl text-base leading-8 text-brand-muted sm:text-lg">
                {text}
              </p>
            </FadeUp>
          ))}

          {/* Founder note */}
          <FadeUp delay={0.1} className="pt-6">
            <figure className="relative rounded-3xl bg-brand-cream p-8 sm:p-10">
              <Quote
                size={36}
                aria-hidden="true"
                className="text-brand-primary/40"
              />
              <blockquote className="mt-4 font-display text-xl font-medium leading-snug text-brand-dark sm:text-2xl">
                {FOUNDER_NOTE.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 text-sm text-brand-muted">
                <span className="h-px w-8 bg-brand-primary/50" />
                {FOUNDER_NOTE.signature}
              </figcaption>
            </figure>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const reduce = useReducedMotion();

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1 } },
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
      aria-labelledby="values-heading"
      className="relative overflow-hidden bg-brand-dark px-4 py-20 text-brand-cream sm:px-6 sm:py-28 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-brand-primary/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Eyebrow tone="light">What we stand for</Eyebrow>
          <h2
            id="values-heading"
            className="font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Four promises behind
            <span className="block italic text-brand-secondary">
              every single pack.
            </span>
          </h2>
        </div>

        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALUES.map(({ icon: Icon, title, text }, i) => (
            <motion.li
              key={title}
              variants={itemVariants}
              className="group relative border-t border-brand-cream/15 pt-8"
            >
              <span
                aria-hidden="true"
                className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-brand-secondary transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />

              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-cream/20 text-brand-secondary transition-colors duration-500 group-hover:border-brand-secondary group-hover:bg-brand-secondary group-hover:text-brand-dark">
                  <Icon size={21} />
                </span>
                <span className="font-display text-sm text-brand-cream/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-8 font-display text-2xl font-medium tracking-tight">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-brand-cream/65">
                {text}
              </p>
            </motion.li>
          ))}
        </motion.ul>

        {/* Stats */}
        <dl className="mt-20 grid grid-cols-2 border-t border-brand-cream/15 sm:mt-28 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="border-b border-brand-cream/15 py-8 pr-4 sm:py-10 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0"
            >
              <dt className="order-2 text-sm text-brand-cream/60">
                {stat.label}
              </dt>
              <dd className="mt-3 font-display text-4xl font-medium tracking-tight text-brand-secondary sm:text-5xl lg:text-6xl">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function JourneySection() {
  const reduce = useReducedMotion();
  const trackRef = useRef(null);
  const [reached, setReached] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 65%", "end 55%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const count = Math.min(
      JOURNEY.length,
      Math.max(0, Math.ceil(value * JOURNEY.length)),
    );
    setReached((previous) => (previous === count ? previous : count));
  });

  const lit = reduce ? JOURNEY.length : reached;

  return (
    <section
      aria-labelledby="journey-heading"
      className="bg-brand-cream px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Farm to table</Eyebrow>
          <h2
            id="journey-heading"
            className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-brand-dark sm:text-5xl lg:text-6xl"
          >
            The journey of
            <span className="block italic text-brand-primary">
              every basket.
            </span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-brand-muted sm:text-lg">
            Four careful steps stand between the farm and your kitchen. None of
            them are skipped.
          </p>
        </div>

        <div className="lg:col-span-7">
          <ol ref={trackRef} className="relative">
            <span
              aria-hidden="true"
              className="absolute bottom-4 left-5 top-4 w-px bg-brand-dark/10"
            />
            <motion.span
              aria-hidden="true"
              style={{ scaleY: reduce ? 1 : scrollYProgress }}
              className="absolute bottom-4 left-5 top-4 w-px origin-top bg-brand-primary"
            />

            {JOURNEY.map(({ icon: Icon, title, text }, i) => {
              const isLit = i < lit;
              return (
                <li key={title} className="relative pb-14 pl-16 last:pb-0">
                  <span
                    className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 ${
                      isLit
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-brand-dark/15 bg-brand-cream text-brand-dark/50"
                    }`}
                  >
                    <Icon size={18} />
                  </span>

                  <p className="text-sm font-medium text-brand-primary">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-medium tracking-tight text-brand-dark sm:text-3xl">
                    {title}
                  </h3>
                  <p className="mt-3 max-w-lg text-base leading-8 text-brand-muted">
                    {text}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function BasketSection() {
  return (
    <section
      aria-labelledby="basket-heading"
      className="bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>What's inside</Eyebrow>
            <h2
              id="basket-heading"
              className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-brand-dark sm:text-5xl lg:text-6xl"
            >
              Meet the
              <span className="italic text-brand-primary"> basket.</span>
            </h2>
          </div>

          <Link
            to="/shop"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Shop everything
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {BASKET.map((item) => (
            <li key={item.title} className={item.offset}>
              <Link
                to={item.to}
                className="group block focus-visible:outline-none"
              >
                <ParallaxImage
                  src={item.image}
                  alt={item.title}
                  className="aspect-[4/5] rounded-3xl bg-brand-secondary/20 group-focus-visible:ring-2 group-focus-visible:ring-brand-primary group-focus-visible:ring-offset-2"
                />

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-medium tracking-tight text-brand-dark transition-colors duration-300 group-hover:text-brand-primary">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm leading-7 text-brand-muted">
                      {item.text}
                    </p>
                  </div>

                  <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-brand-primary group-hover:bg-brand-primary group-hover:text-white">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      aria-labelledby="faq-heading"
      className="bg-brand-cream px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Good to know</Eyebrow>
          <h2
            id="faq-heading"
            className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-brand-dark sm:text-5xl lg:text-6xl"
          >
            Questions about
            <span className="block italic text-brand-primary">us.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-brand-muted">
            Can't find what you're looking for? We're happy to help.
          </p>
          <Link
            to="/contact"
            className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Get in touch
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <ul className="border-t border-brand-dark/10 lg:col-span-7">
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            const id = `faq-${i}`;
            return (
              <li key={item.q} className="border-b border-brand-dark/10">
                <h3>
                  <button
                    type="button"
                    id={`${id}-button`}
                    aria-expanded={open}
                    aria-controls={`${id}-panel`}
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    <span className="font-display text-xl font-medium tracking-tight text-brand-dark sm:text-2xl">
                      {item.q}
                    </span>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                        open
                          ? "rotate-45 border-brand-primary bg-brand-primary text-white"
                          : "border-brand-dark/20 text-brand-dark"
                      }`}
                    >
                      <Plus size={18} />
                    </span>
                  </button>
                </h3>

                <div
                  id={`${id}-panel`}
                  role="region"
                  aria-labelledby={`${id}-button`}
                  aria-hidden={!open}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pr-12 text-base leading-8 text-brand-muted">
                      {item.a}
                    </p>
                    {item.link && (
                      <Link
                        to={item.link.to}
                        tabIndex={open ? 0 : -1}
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                      >
                        {item.link.label}
                        <ArrowUpRight size={15} />
                      </Link>
                    )}
                    <div className="h-6" />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section
      aria-labelledby="closing-heading"
      className="bg-white px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
    >
      <FadeUp className="mx-auto max-w-4xl text-center">
        <h2
          id="closing-heading"
          className="font-display text-[clamp(2.5rem,6.5vw,5.5rem)] font-medium leading-[1.02] tracking-tight text-brand-dark"
        >
          Naturally rich.
          <span className="block italic text-brand-primary">
            Truly premium.
          </span>
        </h2>

        <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-brand-muted sm:text-lg">
          Thank you for letting us be a small part of your table. We hope every
          pack tastes as good as we meant it to.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
          <Link
            to="/shop"
            className="group inline-flex h-14 items-center gap-3 rounded-full bg-brand-primary px-8 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            Shop the collection
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/wholesale"
            className="group relative py-2 text-sm font-semibold text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Bulk enquiries
            <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-brand-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-right group-hover:scale-x-0" />
          </Link>
        </div>
      </FadeUp>
    </section>
  );
}

/* =====================================================================
   Page
   ===================================================================== */

export default function About() {
  // Set the browser tab title for this page, and put the old one back after
  useEffect(() => {
    const previous = document.title;
    document.title = "Our Story | BB's Royal Basket";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <>
      <Hero />
      <StorySection />
      <ValuesSection />
      <JourneySection />
      <BasketSection />
      <FaqSection />
      <ClosingSection />
    </>
  );
}
