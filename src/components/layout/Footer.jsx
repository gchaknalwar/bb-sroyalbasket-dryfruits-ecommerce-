import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Mail,
  MessageCircle,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ */
/* Instagram icon (inline SVG, lucide-style so it matches the others)  */
/* Newer lucide-react versions removed brand icons.                    */
/* ------------------------------------------------------------------ */
function InstagramIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Fill these in. Empty values are hidden automatically.               */
/* ------------------------------------------------------------------ */
const CONTACT = {
  instagram: "", // e.g. "https://instagram.com/yourhandle"
  whatsapp: "", // e.g. "https://wa.me/91XXXXXXXXXX"
  email: "", // e.g. "hello@yourdomain.com"
};

const socials = [
  CONTACT.instagram && {
    label: "Instagram",
    href: CONTACT.instagram,
    icon: InstagramIcon,
    external: true,
  },
  CONTACT.whatsapp && {
    label: "WhatsApp",
    href: CONTACT.whatsapp,
    icon: MessageCircle,
    external: true,
  },
  CONTACT.email && {
    label: "Email",
    href: `mailto:${CONTACT.email}`,
    icon: Mail,
    external: false,
  },
].filter(Boolean);

const linkColumns = [
  {
    title: "Shop",
    links: [
      { name: "Shop All", to: "/shop" },
      { name: "Dry Fruits", to: "/category/dry-fruits" },
      { name: "Seeds", to: "/category/seeds" },
      { name: "Dried Berries", to: "/category/dried-berries" },
    ],
  },
  {
    title: "Explore",
    links: [
      { name: "Our Story", to: "/about" },
      { name: "Wholesale", to: "/wholesale" },
      { name: "Contact Us", to: "/contact" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { name: "FAQs", to: "/faq" },
      { name: "Shipping Policy", to: "/shipping-policy" },
      { name: "Returns & Refunds", to: "/refund-policy" },
      { name: "Privacy Policy", to: "/privacy-policy" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group inline-flex w-fit py-1 text-sm text-brand-cream/65 transition-colors duration-300 hover:text-brand-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
    >
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-secondary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
        />
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const reduce = useReducedMotion();

  const backToTop = () =>
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

  return (
    <footer className="relative overflow-hidden bg-brand-dark px-4 pt-20 text-brand-cream sm:px-6 sm:pt-28 lg:px-8">
      {/* soft glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-brand-primary/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* ---------------- CTA band ---------------- */}
        <div className="flex flex-col gap-10 border-b border-brand-cream/15 pb-16 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-2xl font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Naturally rich.
            <span className="block italic text-brand-secondary">
              Truly premium.
            </span>
          </h2>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-brand-secondary pl-8 pr-3 text-sm font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-brand-cream transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
              />
              <span className="relative">Shop the collection</span>
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-dark text-brand-cream transition-transform duration-500 group-hover:-rotate-45">
                <ArrowRight size={17} />
              </span>
            </Link>

            <Link
              to="/wholesale"
              className="inline-flex h-14 items-center gap-2 rounded-full border border-brand-cream/25 px-7 text-sm font-semibold text-brand-cream transition-colors duration-300 hover:border-brand-cream hover:bg-brand-cream hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              Wholesale enquiries
            </Link>
          </div>
        </div>

        {/* ---------------- Links ---------------- */}
        <div className="grid gap-14 py-16 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link
              to="/"
              className="font-display text-2xl font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
            >
              BB's ROYAL BASKET
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-brand-cream/65">
              Bringing carefully selected dry fruits, seeds, and dried berries
              to your everyday table.
            </p>

            {socials.length > 0 && (
              <ul className="mt-8 flex gap-3">
                {socials.map(({ label, href, icon: Icon, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-cream/20 text-brand-cream transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary hover:bg-brand-secondary hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
                    >
                      <Icon size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Link columns */}
          <nav
            aria-label="Footer"
            className="grid gap-10 sm:grid-cols-3 lg:col-span-7"
          >
            {linkColumns.map((column) => (
              <div key={column.title}>
                <h3 className="font-display text-lg font-medium text-brand-cream">
                  {column.title}
                </h3>
                <ul className="mt-5 flex flex-col gap-1.5">
                  {column.links.map((link) => (
                    <li key={link.to}>
                      <FooterLink to={link.to}>{link.name}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* ---------------- Giant wordmark ---------------- */}
        <div aria-hidden="true" className="select-none overflow-hidden">
          <motion.p
            initial={reduce ? false : { y: "100%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="whitespace-nowrap text-center font-display text-[clamp(2rem,8.4vw,7.5rem)] font-bold leading-[0.95] tracking-tight text-brand-cream/[0.07]"
          >
            BB's ROYAL BASKET
          </motion.p>
        </div>

        {/* ---------------- Bottom bar ---------------- */}
        <div className="flex flex-col items-center gap-5 border-t border-brand-cream/15 py-6 text-xs text-brand-cream/50 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} BB's Royal Basket. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1 transition-colors duration-300 hover:text-brand-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
            >
              Shop Premium Collection
              <ArrowUpRight size={13} />
            </Link>

            <button
              type="button"
              onClick={backToTop}
              aria-label="Back to top"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-cream/20 text-brand-cream transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary hover:bg-brand-secondary hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
