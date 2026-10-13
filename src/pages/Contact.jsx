import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock,
  Camera,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const EASE = [0.22, 1, 0.36, 1];

/* =====================================================================
   SETTINGS: fill these in (anything left empty is simply hidden)
   ===================================================================== */

// How messages are delivered:
//   "whatsapp" -> opens WhatsApp with the message already written (default)
//   "email"    -> opens the visitor's email app with the message written
//   "api"      -> sends the message to your backend (see API_ENDPOINT below)
const SUBMIT_MODE = "whatsapp";

// WhatsApp number with country code, digits only. Example: "919876543210"
const WHATSAPP_NUMBER = "";

// Shown on the page and used in "email" mode
const BUSINESS_EMAIL = "";

// Phone number to show and call. Example: "+91 98765 43210"
const PHONE_NUMBER = "";

// Full address, shown with a "Get directions" link
const ADDRESS = "";

// Example: "Mon to Sat, 10:00 am to 7:00 pm"
const OPENING_HOURS = "";

// Full link, example: "https://instagram.com/yourhandle"
const INSTAGRAM_URL = "";

// Only used when SUBMIT_MODE is "api". Your backend should accept this JSON:
// { name, email, phone, topic, orderNumber, message }
const API_ENDPOINT = "/api/contact";

/* =====================================================================
   CONTENT
   ===================================================================== */

const TOPICS = [
  "Help with an order",
  "Product question",
  "Wholesale / bulk",
  "Feedback",
  "Something else",
];

const ORDER_TOPIC = TOPICS[0];
const WHOLESALE_TOPIC = TOPICS[2];

// CLIENT-CONFIRM: check these answers with the client
const HELP = [
  {
    q: "Where is my order?",
    a: "Orders are dispatched within 24 hours. If something looks wrong, send us your order number and we'll check it straight away.",
    link: { to: "/shipping-policy", label: "Shipping policy" },
  },
  {
    q: "How do returns and refunds work?",
    a: "If something isn't right with your order, tell us and we'll make it right. Our policy explains the steps.",
    link: { to: "/refund-policy", label: "Returns & refunds" },
  },
  {
    q: "Do you offer bulk pricing?",
    a: "Yes, we supply shops, cafés, events and gifting with custom business pricing.",
    link: { to: "/wholesale", label: "Wholesale enquiries" },
  },
  {
    q: "Where can I find more answers?",
    a: "Our FAQ page covers the questions we hear most often.",
    link: { to: "/faq", label: "Read the FAQ" },
  },
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

const onlyDigits = (value) => value.replace(/\D/g, "");

function Eyebrow({ children }) {
  return (
    <p className="mb-6 flex items-center gap-3 text-sm font-medium text-brand-primary">
      <span className="h-px w-10 bg-brand-primary/60" />
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

function Field({ id, label, optional, error, hint, children }) {
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
      {error ? (
        <p
          id={`${id}-message`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
        >
          <AlertCircle size={13} aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-message`} className="mt-1.5 text-xs text-brand-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/* Builds the readable message used for WhatsApp / email */
const buildMessage = (data) => {
  const lines = [
    "Hello BB's Royal Basket,",
    "",
    `Topic: ${data.topic}`,
    `Name: ${data.name}`,
  ];

  if (data.phone) lines.push(`Phone: ${data.phone}`);
  if (data.email) lines.push(`Email: ${data.email}`);
  if (data.orderNumber) lines.push(`Order number: ${data.orderNumber}`);

  lines.push("", data.message);

  return lines.join("\n");
};

const whatsappLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

const emailLink = (text) =>
  `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(
    "Message from the website",
  )}&body=${encodeURIComponent(text)}`;

/* =====================================================================
   Contact cards (only the ones you filled in are shown)
   ===================================================================== */

function buildContactCards() {
  const cards = [];

  if (WHATSAPP_NUMBER) {
    cards.push({
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us",
      note: "Quick answers to quick questions",
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      external: true,
    });
  }

  if (BUSINESS_EMAIL) {
    cards.push({
      icon: Mail,
      label: "Email",
      value: BUSINESS_EMAIL,
      note: "We reply as soon as we can",
      href: `mailto:${BUSINESS_EMAIL}`,
    });
  }

  if (PHONE_NUMBER) {
    cards.push({
      icon: Phone,
      label: "Phone",
      value: PHONE_NUMBER,
      note: OPENING_HOURS || "Give us a call",
      href: `tel:${PHONE_NUMBER.replace(/[^\d+]/g, "")}`,
    });
  }

  if (ADDRESS) {
    cards.push({
      icon: MapPin,
      label: "Visit us",
      value: ADDRESS,
      note: "Get directions",
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        ADDRESS,
      )}`,
      external: true,
    });
  }

  if (INSTAGRAM_URL) {
    cards.push({
      icon: Camera,
      label: "Instagram",
      value: "Follow along",
      note: "Fresh picks and behind the scenes",
      href: INSTAGRAM_URL,
      external: true,
    });
  }

  return cards;
}

/* =====================================================================
   Hero
   ===================================================================== */

function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-brand-cream px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-[32rem] w-[32rem] rounded-full bg-brand-secondary/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <Eyebrow>Contact us</Eyebrow>

        <h1
          id="contact-heading"
          className="font-display text-[clamp(3rem,8vw,7.5rem)] font-medium leading-[0.97] tracking-tight text-brand-dark"
        >
          <RevealLine delay={0.1}>We'd love to</RevealLine>
          <RevealLine delay={0.25} className="italic text-brand-primary">
            hear from you.
          </RevealLine>
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
          className="mt-8 max-w-xl text-base leading-8 text-brand-muted sm:text-lg"
        >
          Questions about an order, a product or buying in bulk? Send us a
          message and a real person will get back to you.
        </motion.p>
      </div>
    </section>
  );
}

/* =====================================================================
   Message form
   ===================================================================== */

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  topic: TOPICS[0],
  orderNumber: "",
  message: "",
  website: "", // honeypot: real people never fill this
};

const MESSAGE_LIMIT = 1000;

const validate = (form) => {
  const errors = {};

  if (!form.name.trim()) errors.name = "Enter your name.";

  const email = form.email.trim();
  if (email && !emailLooksValid(email))
    errors.email = "Enter a valid email address.";

  if (form.phone && !/^[6-9]\d{9}$/.test(form.phone))
    errors.phone = "Enter a valid 10-digit mobile number.";

  if (!email && !form.phone)
    errors.contact = "Add a phone number or email so we can reply.";

  const message = form.message.trim();
  if (!message) errors.message = "Tell us how we can help.";
  else if (message.length < 10)
    errors.message = "Please add a little more detail.";

  return errors;
};

function FormSection() {
  const reduce = useReducedMotion();
  const { user } = useAuth();

  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [serverError, setServerError] = useState("");
  const [fallbackLink, setFallbackLink] = useState("");

  const prefilled = useRef(false);

  // Logged-in customers don't need to type their details again
  useEffect(() => {
    if (!user || prefilled.current) return;
    prefilled.current = true;

    setForm((current) => ({
      ...current,
      name:
        current.name ||
        [user.firstName, user.lastName].filter(Boolean).join(" "),
      email: current.email || user.email || "",
      phone: current.phone || onlyDigits(String(user.phone || "")).slice(-10),
    }));
  }, [user]);

  const errors = useMemo(() => validate(form), [form]);
  const errorFor = (name) =>
    touched[name] || submitted ? errors[name] : undefined;
  const sending = status === "sending";

  const showOrderField = form.topic === ORDER_TOPIC;
  const showWholesaleHint = form.topic === WHOLESALE_TOPIC;

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (serverError) setServerError("");
    setForm((current) => ({
      ...current,
      [name]: name === "phone" ? onlyDigits(value).slice(0, 10) : value,
    }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  };

  const reset = () => {
    setForm({
      ...EMPTY_FORM,
      name: form.name,
      email: form.email,
      phone: form.phone,
    });
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

    const firstInvalid = ["name", "email", "phone", "message"].find(
      (key) => errors[key],
    );
    if (firstInvalid || errors.contact) {
      const target = firstInvalid || (form.phone ? "email" : "phone");
      document.getElementById(target)?.focus();
      return;
    }

    // Bots fill hidden fields. Pretend it worked and do nothing.
    if (form.website) {
      setStatus("sent");
      return;
    }

    const data = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone,
      topic: form.topic,
      orderNumber: showOrderField ? form.orderNumber.trim() : "",
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
        "We couldn't send your message just now. Please try again in a moment.",
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
          title: "Thank you, we've got your message.",
          text: "A member of our team will get back to you soon.",
        }
      : SUBMIT_MODE === "email"
        ? {
            title: "Your email is ready to send.",
            text: "We've opened your email app with your message written out. Press send there and we'll reply soon.",
          }
        : {
            title: "Your WhatsApp message is ready.",
            text: "We've opened WhatsApp with your message written out. Press send there and we'll reply soon.",
          };

  const cards = buildContactCards();

  return (
    <section
      aria-labelledby="message-heading"
      className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left: ways to reach us */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Get in touch</Eyebrow>
          <h2
            id="message-heading"
            className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-brand-dark sm:text-5xl"
          >
            Send us
            <span className="block italic text-brand-primary">a message.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-brand-muted sm:text-lg">
            Fill in the form and we'll reply as soon as we can. You can also
            reach us directly using any of the options below.
          </p>

          {cards.length > 0 && (
            <ul className="mt-8 space-y-3">
              {cards.map(
                ({ icon: Icon, label, value, note, href, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group flex items-center gap-4 rounded-2xl border border-brand-dark/10 p-4 transition-colors duration-300 hover:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary transition-colors duration-300 group-hover:bg-brand-primary group-hover:text-white">
                        <Icon size={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs text-brand-muted">
                          {label}
                        </span>
                        <span className="block truncate text-sm font-semibold text-brand-dark">
                          {value}
                        </span>
                        <span className="block truncate text-xs text-brand-muted">
                          {note}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={18}
                        className="shrink-0 text-brand-dark/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-primary"
                      />
                    </a>
                  </li>
                ),
              )}
            </ul>
          )}

          {OPENING_HOURS && !PHONE_NUMBER && (
            <p className="mt-6 flex items-center gap-3 text-sm text-brand-muted">
              <Clock size={17} className="text-brand-primary" />
              {OPENING_HOURS}
            </p>
          )}
        </div>

        {/* Right: form */}
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
                    Send another message
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

                <Field id="name" label="Your name" error={errorFor("name")}>
                  <input
                    {...fieldProps("name")}
                    type="text"
                    autoComplete="name"
                    placeholder="Full name"
                    className={inputClass(errorFor("name"), "px-4")}
                  />
                </Field>

                <div>
                  <div className="grid gap-5 sm:grid-cols-2">
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

                    <Field
                      id="phone"
                      label="Mobile number"
                      optional
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
                  </div>

                  {(touched.email || touched.phone || submitted) &&
                    errors.contact && (
                      <p
                        role="alert"
                        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600"
                      >
                        <AlertCircle size={13} aria-hidden="true" />
                        {errors.contact}
                      </p>
                    )}
                </div>

                <Field id="topic" label="What is this about?">
                  <div className="relative">
                    <select
                      {...fieldProps("topic")}
                      className={inputClass(
                        false,
                        "appearance-none px-4 pr-11",
                      )}
                    >
                      {TOPICS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-dark/50"
                    />
                  </div>
                </Field>

                {showOrderField && (
                  <Field id="orderNumber" label="Order number" optional>
                    <input
                      {...fieldProps("orderNumber")}
                      type="text"
                      autoComplete="off"
                      placeholder="You'll find it in your order confirmation"
                      className={inputClass(false, "px-4")}
                    />
                  </Field>
                )}

                {showWholesaleHint && (
                  <p className="rounded-xl border border-brand-primary/20 bg-white px-4 py-3 text-sm leading-6 text-brand-muted">
                    For bulk pricing, our{" "}
                    <Link
                      to="/wholesale"
                      className="font-semibold text-brand-primary underline-offset-4 hover:underline"
                    >
                      wholesale enquiry form
                    </Link>{" "}
                    gets you a quote faster.
                  </p>
                )}

                <Field
                  id="message"
                  label="Your message"
                  error={errorFor("message")}
                  hint={`${form.message.length} / ${MESSAGE_LIMIT}`}
                >
                  <textarea
                    {...fieldProps("message")}
                    rows={5}
                    maxLength={MESSAGE_LIMIT}
                    placeholder="How can we help?"
                    className={`w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm text-brand-dark outline-none transition placeholder:text-brand-dark/35 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errorFor("message")
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                        : "border-brand-dark/15 hover:border-brand-dark/30 focus:border-brand-primary focus:ring-brand-primary/15"
                    }`}
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
                      Send message
                      <ArrowRight
                        size={18}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

                <p className="text-center text-xs leading-5 text-brand-muted">
                  We'll only use your details to reply to this message.
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
   Quick help (accordion)
   ===================================================================== */

function HelpSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      aria-labelledby="help-heading"
      className="bg-brand-cream px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Quick help</Eyebrow>
          <h2
            id="help-heading"
            className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-brand-dark sm:text-5xl"
          >
            Maybe we've
            <span className="block italic text-brand-primary">
              already answered.
            </span>
          </h2>
        </div>

        <ul className="border-t border-brand-dark/10 lg:col-span-7">
          {HELP.map((item, i) => {
            const open = openIndex === i;
            const id = `help-${i}`;
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

/* =====================================================================
   Page
   ===================================================================== */

export default function Contact() {
  useEffect(() => {
    const previous = document.title;
    document.title = "Contact Us | BB's Royal Basket";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <>
      <Hero />
      <FormSection />
      <HelpSection />
    </>
  );
}
