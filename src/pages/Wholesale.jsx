import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  Coffee,
  Gift,
  Mail,
  MessageCircle,
  PackageCheck,
  Store,
  Tag,
  Truck,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

/* =====================================================================
   SETTINGS: fill these in
   ===================================================================== */

// How enquiries are delivered:
//   "whatsapp" -> opens WhatsApp with the message already written (default)
//   "email"    -> opens the visitor's email app with the message written
//   "api"      -> sends the enquiry to your backend (see API_ENDPOINT below)
const SUBMIT_MODE = "whatsapp";

// WhatsApp number with country code, digits only. Example: "919876543210"
// If left empty, WhatsApp opens and the visitor picks the contact manually.
const WHATSAPP_NUMBER = "";

// Business email that receives enquiries (used in "email" mode and shown on the page)
const BUSINESS_EMAIL = "";

// Only used when SUBMIT_MODE is "api". Your backend should accept this JSON:
// { name, business, type, phone, email, city, interests[], quantity, message }
const API_ENDPOINT = "/api/wholesale-enquiries";

/* =====================================================================
   CONTENT
   CLIENT-CONFIRM: check every claim below with the client
   ===================================================================== */

const AUDIENCE = [
  {
    icon: Store,
    title: "Retail shops",
    text: "Stock premium dry fruits, seeds and berries your customers will come back for.",
  },
  {
    icon: Coffee,
    title: "Cafés & restaurants",
    text: "Fresh, dependable ingredients for desserts, bakes, bowls and menus.",
  },
  {
    icon: Gift,
    title: "Gifting & corporate",
    text: "Thoughtful hampers and festive gifts, with the quality your name deserves.",
  },
  {
    icon: CalendarDays,
    title: "Events & catering",
    text: "Large quantities for weddings, functions and celebrations.",
  },
];

const BENEFITS = [
  {
    icon: Tag,
    title: "Custom business pricing",
    text: "Pricing built around your volumes, not a one-size-fits-all rate card.",
  },
  {
    icon: BadgeCheck,
    title: "Consistent quality",
    text: "Every batch is checked, so the last order tastes as good as the first.",
  },
  {
    icon: PackageCheck,
    title: "Sealed for freshness",
    text: "Vacuum-sealed, moisture-resistant packaging that protects your stock.",
  },
  {
    icon: Truck,
    title: "Dependable dispatch",
    text: "Orders are dispatched quickly so you can plan your stock with confidence.",
  },
];

const STEPS = [
  {
    title: "Send your enquiry",
    text: "Tell us who you are and what you need.",
  },
  {
    title: "Get your quote",
    text: "We reply with pricing that fits your quantities.",
  },
  {
    title: "Confirm your order",
    text: "Agree the details and we get your order ready.",
  },
  {
    title: "We dispatch",
    text: "Your order is packed fresh and sent on its way.",
  },
];

const BUSINESS_TYPES = [
  "Retail shop",
  "Café / Restaurant",
  "Gifting / Corporate",
  "Events / Catering",
  "Other",
];

const INTERESTS = ["Dry Fruits", "Seeds", "Dried Berries"];

const QUANTITIES = [
  "Not sure yet",
  "Under 10 kg a month",
  "10 – 50 kg a month",
  "50 – 100 kg a month",
  "100 kg+ a month",
];

/* =====================================================================
   Helpers
   ===================================================================== */

const inputClass = (hasError, extra = "") =>
  `h-12 w-full rounded-xl border bg-white text-sm text-brand-dark outline-none transition placeholder:text-brand-dark/35 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
      : "border-brand-dark/15 hover:border-brand-dark/30 focus:border-brand-primary focus:ring-brand-primary/15"
  } ${extra}`;

const emailLooksValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

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
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Field({ id, label, optional, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-center justify-between text-sm font-medium text-brand-dark"
      >
        {label}
        {optional && (
          <span className="text-xs font-normal text-brand-muted">Optional</span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-message`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
        >
          <AlertCircle size={13} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function SelectBox({ children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`${inputClass(props["aria-invalid"], "appearance-none px-4 pr-11")}`}
      >
        {children}
      </select>
      <ChevronDown
        size={18}
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-dark/50"
      />
    </div>
  );
}

/* Builds the readable message used for WhatsApp / email */
const buildMessage = (data) => {
  const lines = [
    "Hello BB's Royal Basket, I'd like a wholesale quote.",
    "",
    `Name: ${data.name}`,
    `Business: ${data.business} (${data.type})`,
    `Phone: ${data.phone}`,
  ];

  if (data.email) lines.push(`Email: ${data.email}`);
  if (data.city) lines.push(`City: ${data.city}`);
  if (data.interests.length > 0)
    lines.push(`Interested in: ${data.interests.join(", ")}`);
  if (data.quantity) lines.push(`Monthly quantity: ${data.quantity}`);
  if (data.message) lines.push(`Message: ${data.message}`);

  return lines.join("\n");
};

const whatsappLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

const emailLink = (text) =>
  `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(
    "Wholesale enquiry",
  )}&body=${encodeURIComponent(text)}`;

/* =====================================================================
   Sections
   ===================================================================== */

function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="wholesale-heading"
      className="relative overflow-hidden bg-brand-cream px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-brand-secondary/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <Eyebrow>Wholesale</Eyebrow>

        <h1
          id="wholesale-heading"
          className="font-display text-[clamp(3rem,8vw,7.5rem)] font-medium leading-[0.97] tracking-tight text-brand-dark"
        >
          <RevealLine delay={0.1}>Premium quality,</RevealLine>
          <RevealLine delay={0.25} className="italic text-brand-primary">
            made for business.
          </RevealLine>
        </h1>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
          className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <p className="max-w-xl text-base leading-8 text-brand-muted sm:text-lg">
            Buying for a shop, café, event or gifting? Get the same handpicked
            dry fruits, seeds and berries our customers love, in the quantities
            your business needs.
          </p>

          <a
            href="#enquiry"
            className="group inline-flex h-14 w-fit items-center gap-3 rounded-full bg-brand-primary px-8 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream"
          >
            Request a quote
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function AudienceSection() {
  return (
    <section
      aria-labelledby="audience-heading"
      className="bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <Eyebrow>Who it's for</Eyebrow>
          <h2
            id="audience-heading"
            className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-brand-dark sm:text-5xl lg:text-6xl"
          >
            Built for the way
            <span className="block italic text-brand-primary">
              you do business.
            </span>
          </h2>
        </div>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-brand-dark/10 bg-brand-dark/10 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCE.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="group bg-white p-8 transition-colors duration-500 hover:bg-brand-cream"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-primary/20 text-brand-primary transition-colors duration-500 group-hover:border-brand-primary group-hover:bg-brand-primary group-hover:text-white">
                <Icon size={21} />
              </span>
              <h3 className="mt-8 font-display text-2xl font-medium tracking-tight text-brand-dark">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-brand-muted">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function BenefitsSection() {
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
      aria-labelledby="benefits-heading"
      className="relative overflow-hidden bg-brand-dark px-4 py-20 text-brand-cream sm:px-6 sm:py-28 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-brand-primary/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Eyebrow tone="light">Why partner with us</Eyebrow>
          <h2
            id="benefits-heading"
            className="font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Quality you can build
            <span className="block italic text-brand-secondary">
              a business on.
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
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <motion.li
              key={title}
              variants={itemVariants}
              className="group relative border-t border-brand-cream/15 pt-8"
            >
              <span
                aria-hidden="true"
                className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-brand-secondary transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-cream/20 text-brand-secondary transition-colors duration-500 group-hover:border-brand-secondary group-hover:bg-brand-secondary group-hover:text-brand-dark">
                <Icon size={21} />
              </span>
              <h3 className="mt-8 font-display text-2xl font-medium tracking-tight">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-brand-cream/65">
                {text}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

function StepsSection() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="steps-heading"
      className="bg-brand-cream px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <h2
            id="steps-heading"
            className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-brand-dark sm:text-5xl lg:text-6xl"
          >
            Simple from
            <span className="italic text-brand-primary"> first message.</span>
          </h2>
        </div>

        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
              className="border-t border-brand-dark/15 pt-6"
            >
              <span className="font-display text-5xl font-medium text-brand-primary/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-2xl font-medium tracking-tight text-brand-dark">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-brand-muted">
                {step.text}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------
   Enquiry form
   --------------------------------------------------------------------- */

const EMPTY_FORM = {
  name: "",
  business: "",
  type: BUSINESS_TYPES[0],
  phone: "",
  email: "",
  city: "",
  quantity: QUANTITIES[0],
  message: "",
  website: "", // honeypot: real people never fill this
};

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = "Enter your name.";
  if (!form.business.trim()) errors.business = "Enter your business name.";
  if (!/^[6-9]\d{9}$/.test(form.phone))
    errors.phone = "Enter a valid 10-digit mobile number.";
  if (form.email.trim() && !emailLooksValid(form.email.trim()))
    errors.email = "Enter a valid email address.";
  return errors;
};

function EnquirySection() {
  const reduce = useReducedMotion();

  const [form, setForm] = useState(EMPTY_FORM);
  const [interests, setInterests] = useState([]);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [serverError, setServerError] = useState("");
  const [fallbackLink, setFallbackLink] = useState("");

  const errors = useMemo(() => validate(form), [form]);
  const errorFor = (name) =>
    touched[name] || submitted ? errors[name] : undefined;
  const sending = status === "sending";

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (serverError) setServerError("");
    setForm((current) => ({
      ...current,
      [name]: name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value,
    }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  };

  const toggleInterest = (item) =>
    setInterests((current) =>
      current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current, item],
    );

  const reset = () => {
    setForm(EMPTY_FORM);
    setInterests([]);
    setTouched({});
    setSubmitted(false);
    setStatus("idle");
    setServerError("");
    setFallbackLink("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (sending) return;

    setSubmitted(true);

    const firstInvalid = ["name", "business", "phone", "email"].find(
      (key) => errors[key],
    );
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    // Bots fill hidden fields. Pretend it worked and do nothing.
    if (form.website) {
      setStatus("sent");
      return;
    }

    const data = {
      name: form.name.trim(),
      business: form.business.trim(),
      type: form.type,
      phone: form.phone,
      email: form.email.trim(),
      city: form.city.trim(),
      interests,
      quantity: form.quantity === QUANTITIES[0] ? "" : form.quantity,
      message: form.message.trim(),
    };

    setServerError("");
    setStatus("sending");

    try {
      if (SUBMIT_MODE === "api") {
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Request failed");
        setFallbackLink("");
      } else if (SUBMIT_MODE === "email") {
        const link = emailLink(buildMessage(data));
        setFallbackLink(link);
        window.location.href = link;
      } else {
        const link = whatsappLink(buildMessage(data));
        setFallbackLink(link);
        window.open(link, "_blank");
      }

      setStatus("sent");
    } catch {
      setStatus("idle");
      setServerError(
        "We couldn't send your enquiry just now. Please try again in a moment.",
      );
    }
  };

  const fieldProps = (name) => ({
    id: name,
    name,
    value: form[name],
    onChange: handleChange,
    onBlur: handleBlur,
    disabled: sending,
    "aria-invalid": Boolean(errorFor(name)),
    "aria-describedby": errorFor(name) ? `${name}-message` : undefined,
  });

  const sentCopy =
    SUBMIT_MODE === "api"
      ? {
          title: "Thank you, we've got your enquiry.",
          text: "Our team will reach out with your quote soon.",
        }
      : SUBMIT_MODE === "email"
        ? {
            title: "Your email is ready to send.",
            text: "We've opened your email app with the enquiry written out. Press send there and we'll reply with your quote.",
          }
        : {
            title: "Your WhatsApp message is ready.",
            text: "We've opened WhatsApp with your enquiry written out. Press send there and we'll reply with your quote.",
          };

  return (
    <section
      id="enquiry"
      aria-labelledby="enquiry-heading"
      className="scroll-mt-24 bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left: intro + direct contact */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Get a quote</Eyebrow>
          <h2
            id="enquiry-heading"
            className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-brand-dark sm:text-5xl lg:text-6xl"
          >
            Tell us what
            <span className="block italic text-brand-primary">you need.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-brand-muted sm:text-lg">
            Share a few details and we'll come back with pricing that fits your
            business. No pressure, no obligation.
          </p>

          {(WHATSAPP_NUMBER || BUSINESS_EMAIL) && (
            <div className="mt-8 space-y-3">
              {WHATSAPP_NUMBER && (
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-brand-dark/10 p-4 transition-colors hover:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                    <MessageCircle size={20} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-brand-dark">
                      Chat on WhatsApp
                    </span>
                    <span className="block text-xs text-brand-muted">
                      Quick answers for quick questions
                    </span>
                  </span>
                </a>
              )}

              {BUSINESS_EMAIL && (
                <a
                  href={`mailto:${BUSINESS_EMAIL}`}
                  className="group flex items-center gap-4 rounded-2xl border border-brand-dark/10 p-4 transition-colors hover:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                    <Mail size={20} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-brand-dark">
                      Email us
                    </span>
                    <span className="block text-xs text-brand-muted">
                      {BUSINESS_EMAIL}
                    </span>
                  </span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right: form card */}
        <div className="lg:col-span-7">
          <div className="rounded-[2rem] border border-brand-dark/10 bg-brand-cream p-6 sm:p-10">
            {status === "sent" ? (
              <motion.div
                role="status"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="py-6 text-center sm:py-12"
              >
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-white">
                  <Check size={28} />
                </span>
                <h3 className="mt-6 font-display text-3xl font-medium tracking-tight text-brand-dark">
                  {sentCopy.title}
                </h3>
                <p className="mx-auto mt-3 max-w-md text-base leading-7 text-brand-muted">
                  {sentCopy.text}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
                  {fallbackLink && (
                    <a
                      href={fallbackLink}
                      target={SUBMIT_MODE === "whatsapp" ? "_blank" : undefined}
                      rel={
                        SUBMIT_MODE === "whatsapp"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-primary px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                    >
                      Didn't open? Tap here
                      <ArrowRight size={16} />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={reset}
                    className="text-sm font-semibold text-brand-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    Send another enquiry
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {serverError && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <p>{serverError}</p>
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="name" label="Your name" error={errorFor("name")}>
                    <input
                      {...fieldProps("name")}
                      type="text"
                      autoComplete="name"
                      placeholder="Full name"
                      className={inputClass(errorFor("name"), "px-4")}
                    />
                  </Field>

                  <Field
                    id="business"
                    label="Business name"
                    error={errorFor("business")}
                  >
                    <input
                      {...fieldProps("business")}
                      type="text"
                      autoComplete="organization"
                      placeholder="Your business"
                      className={inputClass(errorFor("business"), "px-4")}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    id="phone"
                    label="Mobile number"
                    error={errorFor("phone")}
                  >
                    <div className="relative">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 border-r border-brand-dark/15 pr-3 text-sm font-medium text-brand-dark/60"
                      >
                        +91
                      </span>
                      <input
                        {...fieldProps("phone")}
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        maxLength={10}
                        placeholder="10-digit number"
                        className={inputClass(
                          errorFor("phone"),
                          "pl-[4.5rem] pr-4",
                        )}
                      />
                    </div>
                  </Field>

                  <Field
                    id="email"
                    label="Email"
                    optional
                    error={errorFor("email")}
                  >
                    <input
                      {...fieldProps("email")}
                      type="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck="false"
                      placeholder="you@example.com"
                      className={inputClass(errorFor("email"), "px-4")}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="type" label="Type of business">
                    <SelectBox {...fieldProps("type")}>
                      {BUSINESS_TYPES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </SelectBox>
                  </Field>

                  <Field id="city" label="City" optional>
                    <input
                      {...fieldProps("city")}
                      type="text"
                      autoComplete="address-level2"
                      placeholder="Where are you based?"
                      className={inputClass(false, "px-4")}
                    />
                  </Field>
                </div>

                <fieldset>
                  <legend className="mb-2 flex w-full items-center justify-between text-sm font-medium text-brand-dark">
                    What are you interested in?
                    <span className="text-xs font-normal text-brand-muted">
                      Optional
                    </span>
                  </legend>
                  <div className="flex flex-wrap gap-2.5">
                    {INTERESTS.map((item) => {
                      const on = interests.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleInterest(item)}
                          aria-pressed={on}
                          disabled={sending}
                          className={`inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:opacity-60 ${
                            on
                              ? "border-brand-primary bg-brand-primary text-white"
                              : "border-brand-dark/15 bg-white text-brand-dark hover:border-brand-primary"
                          }`}
                        >
                          {on && <Check size={15} />}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <Field
                  id="quantity"
                  label="Approximate monthly quantity"
                  optional
                >
                  <SelectBox {...fieldProps("quantity")}>
                    {QUANTITIES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectBox>
                </Field>

                <Field
                  id="message"
                  label="Anything else we should know?"
                  optional
                >
                  <textarea
                    {...fieldProps("message")}
                    rows={4}
                    placeholder="Products, packaging, delivery timing…"
                    className="w-full resize-y rounded-xl border border-brand-dark/15 bg-white px-4 py-3 text-sm text-brand-dark outline-none transition placeholder:text-brand-dark/35 hover:border-brand-dark/30 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </Field>

                {/* honeypot (hidden from people) */}
                <div
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                >
                  <label htmlFor="website">Leave this field empty</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-6 text-sm font-semibold text-white shadow-lg shadow-brand-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 motion-reduce:transition-none"
                >
                  {sending ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none"
                      />
                      Sending…
                    </>
                  ) : (
                    <>
                      Request my quote
                      <ArrowRight
                        size={18}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

                <p className="text-center text-xs leading-5 text-brand-muted">
                  We'll only use your details to reply to this enquiry.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   Page
   ===================================================================== */

export default function Wholesale() {
  useEffect(() => {
    const previous = document.title;
    document.title = "Wholesale | BB's Royal Basket";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <>
      <Hero />
      <AudienceSection />
      <BenefitsSection />
      <StepsSection />
      <EnquirySection />
    </>
  );
}
