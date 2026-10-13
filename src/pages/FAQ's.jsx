import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ChevronDown,
  CircleHelp,
  Clock,
  Mail,
  MessageCircle,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

/* =====================================================================
   FAQ CONTENT
   Confirm delivery, payment, and return policies with the client.
   ===================================================================== */

const CATEGORIES = [
  { label: "All questions", value: "All", icon: CircleHelp },
  { label: "Our products", value: "Products", icon: ShoppingBag },
  { label: "Orders & delivery", value: "Orders", icon: Truck },
  { label: "Payments", value: "Payments", icon: ShieldCheck },
  { label: "Wholesale & gifting", value: "Wholesale", icon: Package },
];

const FAQS = [
  {
    category: "Products",
    question: "What products does BB's Royal Basket offer?",
    answer:
      "We offer a selection of premium dry fruits, seeds and dried berries. Explore our product collection to discover the available varieties.",
  },
  {
    category: "Products",
    question: "How do I choose the right product?",
    answer:
      "Browse our product collection to compare available varieties and pack sizes. If you need help selecting products for everyday snacking, recipes or gifting, contact our team for assistance.",
  },
  {
    category: "Products",
    question: "How should I store dry fruits and seeds?",
    answer:
      "Store them in a clean, dry, airtight container away from direct sunlight, heat and moisture. Follow the storage guidance on the product packaging to help maintain freshness.",
  },
  {
    category: "Products",
    question: "How can I check product availability?",
    answer:
      "Availability may vary by product and pack size. Visit our product collection or contact us to confirm whether a particular item is available before placing your order.",
  },
  {
    category: "Products",
    question: "Are product images and descriptions accurate?",
    answer:
      "We aim to represent our products as accurately as possible. Appearance may vary slightly between batches. Please refer to the product description and packaging for specific product details.",
  },

  {
    category: "Orders",
    question: "How can I place an order?",
    answer:
      "Browse our products, select the items you need and follow the available ordering instructions on our website. If you need assistance, reach out to our team.",
  },
  {
    category: "Orders",
    question: "How long does delivery take?",
    answer:
      "Delivery timelines depend on your location, product availability and order processing. Contact us with your delivery location for the latest estimated timeframe.",
  },
  {
    category: "Orders",
    question: "Can I track my order?",
    answer:
      "If tracking details are available for your shipment, they will be shared through the applicable order communication channel. Contact our team if you need help checking your order status.",
  },
  {
    category: "Orders",
    question: "Can I change or cancel an order?",
    answer:
      "Please contact us as soon as possible with your order details. Changes or cancellations depend on the order's processing and dispatch status and cannot be guaranteed.",
  },
  {
    category: "Orders",
    question: "What if my order arrives damaged or incorrect?",
    answer:
      "Please contact us promptly with your order details and clear photographs of the product and packaging. Our team will review the issue and explain the available resolution options.",
  },

  {
    category: "Payments",
    question: "What payment methods do you accept?",
    answer:
      "Available payment methods are shown during the ordering process or confirmed by our team. Please check the available options before completing your purchase.",
  },
  {
    category: "Payments",
    question: "How can I confirm that my payment was successful?",
    answer:
      "Check your payment confirmation and any order confirmation provided after checkout. If the payment was deducted but your order is not confirmed, contact us with your transaction reference.",
  },
  {
    category: "Payments",
    question: "Are product prices inclusive of delivery charges?",
    answer:
      "Delivery charges, where applicable, depend on the ordering arrangement and destination. Please review the final order total or confirm the charges with our team before payment.",
  },
  {
    category: "Payments",
    question: "Can I request a refund?",
    answer:
      "Refund eligibility depends on the circumstances and the applicable order policy. Contact us with your order details so we can review your request and explain the next steps.",
  },

  {
    category: "Wholesale",
    question: "Do you accept wholesale and bulk orders?",
    answer:
      "We welcome enquiries from retailers, cafés, restaurants, gifting businesses and event organisers. Share your product requirements and estimated quantities through our Wholesale page to request a quote.",
  },
  {
    category: "Wholesale",
    question: "Can I get customised pricing for bulk orders?",
    answer:
      "Bulk pricing may depend on product selection, order quantities and other requirements. Submit a wholesale enquiry with your details so our team can discuss the available options.",
  },
  {
    category: "Wholesale",
    question: "Do you offer corporate and festive gifting?",
    answer:
      "You can contact us to discuss dry fruit gifting requirements for corporate occasions, festivals, celebrations and events. Available products, quantities and customisation options can be confirmed with our team.",
  },
  {
    category: "Wholesale",
    question: "How can I become a wholesale customer?",
    answer:
      "Visit our Wholesale page and complete the enquiry form with your business details, interests and approximate monthly quantity. Our team can then review your requirements and discuss the next steps.",
  },
];

/* =====================================================================
   HELPERS
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

function RevealLine({ children, delay = 0, className = "" }) {
  const reduce = useReducedMotion();

  return (
    <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em] pr-2">
      <motion.span
        className={`block ${className}`}
        initial={reduce ? false : { y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* =====================================================================
   HERO
   ===================================================================== */

function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="faq-heading"
      className="relative overflow-hidden bg-brand-cream px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-20 h-[34rem] w-[34rem] rounded-full bg-brand-secondary/15 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-40 h-[30rem] w-[30rem] rounded-full bg-brand-primary/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <Eyebrow>Frequently asked questions</Eyebrow>

        <h1
          id="faq-heading"
          className="font-display text-[clamp(3rem,8vw,7.5rem)] font-medium leading-[0.97] tracking-tight text-brand-dark"
        >
          <RevealLine delay={0.1}>Good questions,</RevealLine>

          <RevealLine delay={0.25} className="italic text-brand-primary">
            thoughtful answers.
          </RevealLine>
        </h1>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-xl text-base leading-8 text-brand-muted sm:text-lg">
            Everything you need to know about BB's Royal Basket, from choosing
            your favourite dry fruits to ordering, delivery and business
            enquiries.
          </p>

          <a
            href="#faq-list"
            className="group inline-flex h-14 w-fit shrink-0 items-center gap-3 rounded-full bg-brand-primary px-8 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream"
          >
            Explore FAQs
            <ArrowDownRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-y-1"
            />
          </a>
        </motion.div>

        <div className="mt-16 grid gap-4 border-t border-brand-dark/10 pt-8 sm:grid-cols-3">
          {[
            {
              icon: ShoppingBag,
              title: "Our products",
              text: "Find your favourites",
            },
            {
              icon: Truck,
              title: "Orders & delivery",
              text: "Know what to expect",
            },
            {
              icon: MessageCircle,
              title: "Need more help?",
              text: "We're here to assist",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-primary/20 text-brand-primary">
                <Icon size={20} />
              </span>

              <div>
                <p className="font-display text-xl font-medium text-brand-dark">
                  {title}
                </p>
                <p className="mt-1 text-sm text-brand-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   FAQ ACCORDION
   ===================================================================== */

function FAQItem({ faq, index, isOpen, onToggle }) {
  const reduce = useReducedMotion();
  const answerId = `faq-answer-${index}`;
  const questionId = `faq-question-${index}`;

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.05, ease: EASE }}
      className={`border-b border-brand-dark/10 transition-colors duration-300 ${
        isOpen ? "bg-brand-cream/70" : "bg-white"
      }`}
    >
      <h3>
        <button
          id={questionId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-5 px-5 py-6 text-left sm:px-7 sm:py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary"
        >
          <span className="flex items-start gap-4">
            <span
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300 ${
                isOpen
                  ? "bg-brand-primary text-white"
                  : "bg-brand-cream text-brand-primary"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <span
              className={`font-display text-lg font-medium leading-7 tracking-tight transition-colors duration-300 sm:text-xl ${
                isOpen
                  ? "text-brand-primary"
                  : "text-brand-dark group-hover:text-brand-primary"
              }`}
            >
              {faq.question}
            </span>
          </span>

          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              isOpen
                ? "rotate-180 border-brand-primary bg-brand-primary text-white"
                : "border-brand-dark/10 text-brand-dark group-hover:border-brand-primary group-hover:text-brand-primary"
            }`}
          >
            <ChevronDown size={19} />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={answerId}
            role="region"
            aria-labelledby={questionId}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-7 pl-[4.5rem] pr-5 sm:pl-[5.5rem] sm:pr-10">
              <p className="max-w-2xl text-sm leading-8 text-brand-muted sm:text-base">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function FAQSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFAQs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return FAQS.map((faq, originalIndex) => ({
      ...faq,
      originalIndex,
    })).filter((faq) => {
      const matchesCategory =
        activeCategory === "All" || faq.category === activeCategory;

      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setOpenIndex(null);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setOpenIndex(null);
  };

  return (
    <section
      id="faq-list"
      aria-labelledby="faq-list-heading"
      className="scroll-mt-20 bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left: introduction and category navigation */}

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>Find your answer</Eyebrow>

              <h2
                id="faq-list-heading"
                className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-brand-dark sm:text-5xl"
              >
                What would
                <span className="block italic text-brand-primary">
                  you like to know?
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-8 text-brand-muted">
                Browse the topics or search for a specific question. We've
                organised everything to help you find answers without the
                guesswork.
              </p>

              <div className="relative mt-8">
                <label htmlFor="faq-search" className="sr-only">
                  Search frequently asked questions
                </label>

                <Search
                  size={19}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted"
                />

                <input
                  id="faq-search"
                  type="search"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search your question..."
                  className="h-14 w-full rounded-2xl border border-brand-dark/10 bg-brand-cream pl-12 pr-4 text-sm text-brand-dark outline-none transition placeholder:text-brand-muted/70 hover:border-brand-dark/25 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                />
              </div>

              <nav
                aria-label="FAQ categories"
                className="mt-8 flex flex-col gap-2"
              >
                {CATEGORIES.map(({ label, value, icon: Icon }) => {
                  const active = activeCategory === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => handleCategoryChange(value)}
                      className={`group flex min-h-12 items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                        active
                          ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/10"
                          : "text-brand-muted hover:bg-brand-cream hover:text-brand-dark"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={18} />
                        {label}
                      </span>

                      <ArrowRight
                        size={16}
                        className={`transition-transform duration-300 ${
                          active
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Right: accordion */}

          <div className="lg:col-span-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm text-brand-muted" aria-live="polite">
                Showing{" "}
                <span className="font-semibold text-brand-dark">
                  {filteredFAQs.length}
                </span>{" "}
                {filteredFAQs.length === 1 ? "question" : "questions"}
              </p>

              {(search || activeCategory !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All");
                    setOpenIndex(null);
                  }}
                  className="text-sm font-semibold text-brand-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-brand-dark/10">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <FAQItem
                    key={faq.question}
                    faq={faq}
                    index={index}
                    isOpen={openIndex === faq.originalIndex}
                    onToggle={() =>
                      setOpenIndex((current) =>
                        current === faq.originalIndex
                          ? null
                          : faq.originalIndex,
                      )
                    }
                  />
                ))
              ) : (
                <div className="bg-brand-cream px-6 py-16 text-center sm:px-10">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                    <Search size={23} />
                  </span>

                  <h3 className="mt-5 font-display text-2xl font-medium text-brand-dark">
                    No matching questions
                  </h3>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-brand-muted">
                    We couldn't find an answer matching your search. Try
                    different keywords or explore another category.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setActiveCategory("All");
                      setOpenIndex(null);
                    }}
                    className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-brand-primary px-6 text-sm font-semibold text-white transition hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                  >
                    View all questions
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>

            <p className="mt-5 flex items-start gap-2 text-xs leading-6 text-brand-muted">
              <Clock size={15} className="mt-0.5 shrink-0 text-brand-primary" />
              Need information about a specific order? Contact our team with
              your order details so we can assist you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   CONTACT CTA
   ===================================================================== */

function ContactSection() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="faq-contact-heading"
      className="bg-brand-cream px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-brand-dark px-6 py-14 text-brand-cream sm:px-12 sm:py-16 lg:px-16 lg:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-brand-primary/25 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 left-1/3 h-[25rem] w-[25rem] rounded-full bg-brand-secondary/10 blur-3xl"
        />

        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow tone="light">We're here to help</Eyebrow>

            <h2
              id="faq-contact-heading"
              className="font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Still have
              <span className="block italic text-brand-secondary">
                a question?
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-brand-cream/65 sm:text-lg">
              Every question matters. Get in touch with BB's Royal Basket for
              help with products, orders, or business enquiries.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col">
            <a
              href="/contact"
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-brand-primary px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              Contact our team
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>

            <a
              href="/wholesale"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-brand-cream/20 px-7 text-sm font-semibold text-brand-cream transition-colors duration-300 hover:border-brand-secondary hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
            >
              Wholesale enquiries
              <Package size={17} />
            </a>
          </div>
        </div>

        <div className="relative mt-12 border-t border-brand-cream/15 pt-6">
          <p className="text-sm leading-7 text-brand-cream/50">
            BB's Royal Basket · Naturally Rich · Truly Premium
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/* =====================================================================
   PAGE
   ===================================================================== */

export default function FAQs() {
  useEffect(() => {
    const previousTitle = document.title;

    document.title = "FAQs | BB's Royal Basket";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main>
      <Hero />
      <FAQSection />
      <ContactSection />
    </main>
  );
}
