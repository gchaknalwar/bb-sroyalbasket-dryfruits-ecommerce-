import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, Leaf, MapPin, PackageCheck, Repeat, Zap } from "lucide-react";

import { LOGIN_PATH, SIGNUP_PATH } from "./authShared.jsx";

const EASE = [0.22, 1, 0.36, 1];

const PANEL_COPY = {
  login: {
    line1: "Good to see you",
    line2: "again.",
    text: "Sign in to track your orders, reorder your favourites and check out faster.",
    perks: [
      { icon: PackageCheck, text: "Track every order in one place" },
      { icon: Repeat, text: "Reorder your favourites in a tap" },
      { icon: Zap, text: "Check out faster with saved details" },
    ],
  },
  signup: {
    line1: "Your premium basket,",
    line2: "always within reach.",
    text: "Create your account to keep your orders, delivery details and shopping experience organized in one place.",
    perks: [
      { icon: PackageCheck, text: "Track every order in one place" },
      { icon: MapPin, text: "Save addresses for faster checkout" },
      { icon: Heart, text: "Keep a wishlist of your favourites" },
    ],
  },
};

const TABS = [
  { mode: "login", label: "Login", to: LOGIN_PATH },
  { mode: "signup", label: "Sign up", to: SIGNUP_PATH },
];

export default function AuthShell({ mode, title, subtitle, children }) {
  const location = useLocation();
  const reduce = useReducedMotion();
  const copy = PANEL_COPY[mode];
  const other = TABS.find((tab) => tab.mode !== mode);

  return (
    <main className="bg-brand-cream px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-brand-dark/10 bg-white shadow-[0_30px_90px_-30px_rgba(0,0,0,0.2)] lg:min-h-[760px] lg:grid-cols-2">
        {/* ---------------- Brand panel (light) ---------------- */}
        <section className="relative hidden flex-col overflow-hidden bg-brand-cream p-10 lg:flex xl:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-brand-secondary/20 blur-3xl"
          />

          <Link
            to="/"
            className="relative w-fit font-display text-xl font-bold tracking-tight text-brand-dark transition-colors hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            BB's ROYAL BASKET
          </Link>

          <div key={mode} className="relative mt-12">
            <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-brand-dark xl:text-5xl">
              <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: 0.05, ease: EASE }}
                >
                  {copy.line1}
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.12em] pr-2 -mb-[0.12em]">
                <motion.span
                  className="block italic text-brand-primary"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
                >
                  {copy.line2}
                </motion.span>
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-brand-muted">
              {copy.text}
            </p>

            <ul className="mt-9 space-y-4">
              {copy.perks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-primary/20 bg-white/70 text-brand-primary">
                    <Icon size={19} />
                  </span>
                  <span className="text-sm font-medium text-brand-dark">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Arch photo, same look as the home page hero */}
          <div className="relative mt-10 min-h-[220px] flex-1">
            <div className="absolute inset-x-10 bottom-0 top-0 overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] bg-brand-secondary/20">
              <img
                src="https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=900&q=80"
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/25 via-transparent to-transparent" />
            </div>

            <div className="absolute -left-1 bottom-6 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream text-brand-primary">
                  <Leaf size={20} />
                </span>
                <div>
                  <p className="font-display text-base font-semibold text-brand-dark">
                    Naturally Good
                  </p>
                  <p className="text-xs text-brand-muted">
                    Quality in Every Bite
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Form side ---------------- */}
        <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-12 xl:p-14">
          <div className="mx-auto w-full max-w-md">
            {/* Logo on small screens (the brand panel is hidden there) */}
            <Link
              to="/"
              className="mb-6 block text-center font-display text-lg font-bold tracking-tight text-brand-dark lg:hidden"
            >
              BB's ROYAL BASKET
            </Link>

            {/* Login / Sign up switch */}
            <nav
              aria-label="Account"
              className="grid grid-cols-2 rounded-full bg-brand-dark/5 p-1"
            >
              {TABS.map((tab) => {
                const active = tab.mode === mode;
                return (
                  <Link
                    key={tab.mode}
                    to={tab.to}
                    state={location.state}
                    replace
                    aria-current={active ? "page" : undefined}
                    className="relative flex h-11 items-center justify-center rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    {active && (
                      <motion.span
                        layoutId="auth-tab-pill"
                        className="absolute inset-0 rounded-full bg-white shadow-sm ring-1 ring-brand-dark/10"
                        transition={
                          reduce
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 420, damping: 36 }
                        }
                      />
                    )}
                    <span
                      className={`relative transition-colors duration-300 ${
                        active
                          ? "text-brand-primary"
                          : "text-brand-dark/60 hover:text-brand-dark"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <motion.div
              key={mode}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mt-8"
            >
              <h2 className="font-display text-3xl font-medium tracking-tight text-brand-dark sm:text-4xl">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-brand-muted">
                {subtitle}
              </p>

              <div className="mt-8">{children}</div>
            </motion.div>

            <p className="mt-8 text-center text-sm text-brand-muted">
              {mode === "login"
                ? "New to BB's Royal Basket?"
                : "Already have an account?"}{" "}
              <Link
                to={other.to}
                state={location.state}
                replace
                className="font-semibold text-brand-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {mode === "login" ? "Create an account" : "Sign in"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
