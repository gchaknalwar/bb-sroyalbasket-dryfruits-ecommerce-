import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  UserRound,
  ChevronDown,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop", mega: true },
  { name: "Dry Fruits", path: "/category/dry-fruits" },
  { name: "Seeds", path: "/category/seeds" },
  { name: "Wholesale", path: "/wholesale" },
  { name: "Our Story", path: "/about" },
];

const megaCollections = [
  {
    name: "Dry Fruits",
    path: "/category/dry-fruits",
    note: "Almonds, cashews, walnuts and more",
  },
  {
    name: "Seeds",
    path: "/category/seeds",
    note: "Pumpkin, chia, flax and sunflower",
  },
  {
    name: "All Products",
    path: "/shop",
    note: "Browse the full basket",
  },
];

const popularSearches = [
  "Almonds",
  "Cashews",
  "Walnuts",
  "Pumpkin Seeds",
  "Dates",
];

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

/**
 * Dialog behaviour for full-screen overlays:
 * - moves focus inside when opened
 * - traps Tab / Shift+Tab inside
 * - returns focus to the previously focused element on close
 */
function useOverlay(ref, active, initialFocusRef) {
  useEffect(() => {
    if (!active) return;

    const node = ref.current;
    const previouslyFocused = document.activeElement;

    const focusTimer = window.setTimeout(() => {
      initialFocusRef?.current?.focus();
    }, 80);

    const onKeyDown = (e) => {
      if (e.key !== "Tab" || !node) return;
      const items = node.querySelectorAll(FOCUSABLE);
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [ref, active, initialFocusRef]);
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [query, setQuery] = useState("");
  const [bump, setBump] = useState(false);

  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileRef = useRef(null);
  const mobileCloseRef = useRef(null);
  const megaFirstLinkRef = useRef(null);

  const lastY = useRef(0);
  const ticking = useRef(false);
  const megaCloseTimer = useRef(null);

  const { cartCount } = useCart();
  const { user, isAuthenticated } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const prevCartCount = useRef(cartCount);

  const accountPath = isAuthenticated ? "/account" : "/login";
  const overlayOpen = mobileOpen || searchOpen;

  /* ---------- Mega menu hover-intent helpers ---------- */
  const cancelMegaClose = useCallback(() => {
    window.clearTimeout(megaCloseTimer.current);
  }, []);

  const openMega = useCallback(() => {
    window.clearTimeout(megaCloseTimer.current);
    setMegaOpen(true);
  }, []);

  const closeMegaNow = useCallback(() => {
    window.clearTimeout(megaCloseTimer.current);
    setMegaOpen(false);
  }, []);

  const scheduleMegaClose = useCallback(() => {
    window.clearTimeout(megaCloseTimer.current);
    megaCloseTimer.current = window.setTimeout(() => setMegaOpen(false), 150);
  }, []);

  useEffect(() => () => window.clearTimeout(megaCloseTimer.current), []);

  /* ---------- Overlay behaviour (focus trap + focus return) ---------- */
  useOverlay(searchRef, searchOpen, searchInputRef);
  useOverlay(mobileRef, mobileOpen, mobileCloseRef);

  /* ---------- Close everything on route change ---------- */
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setMegaOpen(false);
  }, [location.pathname]);

  /* ---------- Close mobile menu when resizing to desktop ---------- */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* ---------- Hide on scroll down, reveal on scroll up ---------- */
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 12);

        if (y > lastY.current + 6 && y > 220) {
          setHidden(true);
          setMegaOpen(false);
        } else if (y < lastY.current - 6 || y <= 220) {
          setHidden(false);
        }

        lastY.current = y;
        ticking.current = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- Lock body scroll (without layout shift) ---------- */
  useEffect(() => {
    if (!overlayOpen) return;

    const { style } = document.body;
    const prevOverflow = style.overflow;
    const prevPadding = style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    style.overflow = "hidden";
    if (scrollbarWidth > 0) style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      style.overflow = prevOverflow;
      style.paddingRight = prevPadding;
    };
  }, [overlayOpen]);

  /* ---------- Escape closes things ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setSearchOpen(false);
        setMegaOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- Cart badge pop (only when the count actually changes) ---------- */
  useEffect(() => {
    if (prevCartCount.current === cartCount) return;
    prevCartCount.current = cartCount;
    if (cartCount === 0) return;

    setBump(true);
    const t = window.setTimeout(() => setBump(false), 300);
    return () => window.clearTimeout(t);
  }, [cartCount]);

  /* ---------- Search submit ---------- */
  const runSearch = useCallback(
    (term) => {
      const value = term.trim();
      if (!value) {
        searchInputRef.current?.focus();
        return;
      }
      setSearchOpen(false);
      setQuery("");
      navigate(`/shop?q=${encodeURIComponent(value)}`);
    },
    [navigate],
  );

  /* ---------- Mega menu: keyboard toggle ---------- */
  const toggleMega = () => {
    if (megaOpen) {
      closeMegaNow();
      return;
    }
    openMega();
    window.setTimeout(() => megaFirstLinkRef.current?.focus(), 80);
  };

  /* ---------- Keep header visible while keyboard-navigating it ---------- */
  const handleHeaderFocus = (e) => {
    if (e.target.matches?.(":focus-visible")) setKeyboardFocus(true);
  };

  const handleHeaderBlur = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (keyboardFocus) setMegaOpen(false);
    setKeyboardFocus(false);
  };

  const isMouse = (e) => e.pointerType === "mouse";

  const iconBtn =
    "relative items-center justify-center rounded-full text-brand-dark transition-colors duration-300 hover:bg-brand-dark/5 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary";

  const mobileTile =
    "flex flex-col items-center gap-2 rounded-2xl border border-brand-cream/15 py-4 text-xs font-medium transition-colors hover:bg-brand-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary";

  return (
    <>
      {/* Skip link (add id="main-content" to your <main> element) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-brand-dark focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-brand-cream"
      >
        Skip to content
      </a>

      <header
        onPointerEnter={(e) => isMouse(e) && cancelMegaClose()}
        onPointerLeave={(e) => isMouse(e) && scheduleMegaClose()}
        onFocus={handleHeaderFocus}
        onBlur={handleHeaderBlur}
        className={`sticky top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          hidden && !overlayOpen && !keyboardFocus
            ? "-translate-y-full"
            : "translate-y-0"
        }`}
      >
        {/* Main bar */}
        <div
          className={`relative border-b transition-all duration-500 motion-reduce:transition-none ${
            scrolled
              ? "border-brand-dark/10 bg-brand-cream/85 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)] backdrop-blur-xl"
              : "border-transparent bg-brand-cream"
          }`}
        >
          <div
            className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-[height] duration-500 motion-reduce:transition-none sm:px-6 lg:px-8 ${
              scrolled ? "h-16" : "h-20"
            }`}
          >
            {/* Logo */}
            <Link
              to="/"
              className="group block shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              aria-label="BB's Royal Basket home"
            >
              <span className="block font-display text-xl font-bold tracking-tight text-brand-dark transition-colors duration-300 group-hover:text-brand-primary sm:text-2xl">
                BB's ROYAL BASKET
              </span>
              <span
                aria-hidden="true"
                className={`block overflow-hidden text-[10px] font-medium uppercase tracking-[0.25em] text-brand-secondary transition-all duration-500 motion-reduce:transition-none ${
                  scrolled ? "max-h-0 opacity-0" : "max-h-4 opacity-100"
                }`}
              >
                Naturally Rich • Truly Premium
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav
              className="hidden items-center gap-8 lg:flex"
              aria-label="Primary"
            >
              {navLinks.map((link) => (
                <div
                  key={link.path}
                  className="relative flex items-center"
                  onPointerEnter={(e) => {
                    if (!isMouse(e)) return;
                    if (link.mega) openMega();
                    else closeMegaNow();
                  }}
                >
                  <NavLink
                    to={link.path}
                    end={link.path === "/"}
                    className={({ isActive }) =>
                      `group relative py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                        isActive
                          ? "text-brand-primary"
                          : "text-brand-dark hover:text-brand-primary"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.name}
                        <span
                          aria-hidden="true"
                          className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-brand-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isActive
                              ? "scale-x-100"
                              : "scale-x-0 group-hover:scale-x-100"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>

                  {link.mega && (
                    <button
                      type="button"
                      onClick={toggleMega}
                      aria-expanded={megaOpen}
                      aria-controls="mega-menu"
                      aria-label="Toggle shop menu"
                      className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-brand-dark transition-colors hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    >
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${
                          megaOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                onClick={() => {
                  closeMegaNow();
                  setSearchOpen(true);
                }}
                className={`flex h-11 w-11 ${iconBtn}`}
                aria-label="Search products"
              >
                <Search size={19} />
              </button>

              <Link
                to={accountPath}
                className={`hidden h-11 w-11 sm:flex ${iconBtn}`}
                aria-label={
                  isAuthenticated ? "My Account" : "Login or Create Account"
                }
                title={
                  isAuthenticated
                    ? user?.firstName
                      ? `${user.firstName}'s Account`
                      : "My Account"
                    : "Login / Create Account"
                }
              >
                <UserRound size={19} />
                {isAuthenticated && (
                  <span
                    aria-hidden="true"
                    className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-primary ring-2 ring-brand-cream"
                  />
                )}
              </Link>

              <Link
                to="/wishlist"
                className={`hidden h-11 w-11 sm:flex ${iconBtn}`}
                aria-label="Wishlist"
              >
                <Heart size={19} />
              </Link>

              <Link
                to="/cart"
                className={`flex h-11 w-11 ${iconBtn}`}
                aria-label={`Shopping cart with ${cartCount} ${
                  cartCount === 1 ? "item" : "items"
                }`}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span
                    aria-hidden="true"
                    className={`absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-bold text-brand-cream transition-transform duration-300 ${
                      bump ? "scale-125" : "scale-100"
                    }`}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className={`ml-1 flex h-11 w-11 lg:hidden ${iconBtn}`}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>

          {/* Mega menu (hidden items are not focusable thanks to `invisible`) */}
          <div
            id="mega-menu"
            className={`absolute left-0 right-0 top-full hidden border-b border-brand-dark/10 bg-brand-cream shadow-[0_30px_50px_-30px_rgba(0,0,0,0.25)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:block ${
              megaOpen
                ? "visible translate-y-0 opacity-100"
                : "invisible -translate-y-2 opacity-0"
            }`}
          >
            <div className="mx-auto grid max-w-7xl grid-cols-12 gap-10 px-8 py-10">
              <div className="col-span-7">
                <p className="mb-5 text-xs font-medium text-brand-dark/50">
                  Shop by collection
                </p>
                <ul className="divide-y divide-brand-dark/10 border-y border-brand-dark/10">
                  {megaCollections.map((item, i) => (
                    <li key={item.path}>
                      <Link
                        ref={i === 0 ? megaFirstLinkRef : undefined}
                        to={item.path}
                        className="group flex items-center justify-between py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                      >
                        <span>
                          <span className="block font-display text-3xl font-bold tracking-tight text-brand-dark transition-all duration-500 group-hover:translate-x-2 group-hover:text-brand-primary">
                            {item.name}
                          </span>
                          <span className="mt-1 block text-sm text-brand-dark/60 transition-transform duration-500 group-hover:translate-x-2">
                            {item.note}
                          </span>
                        </span>
                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark transition-all duration-500 group-hover:rotate-45 group-hover:border-brand-primary group-hover:bg-brand-primary group-hover:text-brand-cream">
                          <ArrowRight size={18} />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-5">
                <Link
                  to="/wholesale"
                  className="group relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-3xl bg-brand-dark p-8 text-brand-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-secondary/20 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-150"
                  />
                  <p className="relative text-xs font-medium text-brand-secondary">
                    For shops, cafés and events
                  </p>
                  <div className="relative">
                    <h3 className="font-display text-3xl font-bold leading-tight tracking-tight">
                      Buying in bulk? Get wholesale pricing.
                    </h3>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-secondary">
                      Request a quote
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dim backdrop behind mega menu */}
      <div
        onClick={closeMegaNow}
        aria-hidden="true"
        className={`fixed inset-0 z-40 hidden bg-brand-dark/30 backdrop-blur-[2px] transition-opacity duration-500 motion-reduce:transition-none lg:block ${
          megaOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* ---------------- Search overlay ---------------- */}
      <div
        ref={searchRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className={`fixed inset-0 z-[70] bg-brand-cream transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          searchOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-6 opacity-0"
        }`}
      >
        <div className="mx-auto flex h-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className={`flex h-11 w-11 ${iconBtn}`}
              aria-label="Close search"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center pb-24">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                runSearch(query);
              }}
              className="flex items-center gap-4 border-b-2 border-brand-dark pb-4"
            >
              <Search
                size={28}
                aria-hidden="true"
                className="shrink-0 text-brand-dark/60"
              />
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search almonds, cashews, seeds…"
                aria-label="Search products"
                autoComplete="off"
                enterKeyHint="search"
                className="w-full bg-transparent font-display text-2xl font-bold tracking-tight text-brand-dark placeholder:text-brand-dark/30 focus:outline-none sm:text-5xl"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-dark text-brand-cream transition-colors hover:bg-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-10">
              <p className="mb-4 text-xs font-medium text-brand-dark/50">
                Popular searches
              </p>
              <div className="flex flex-wrap gap-3">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => runSearch(term)}
                    className="rounded-full border border-brand-dark/15 px-5 py-2.5 text-sm font-medium text-brand-dark transition-colors duration-300 hover:border-brand-primary hover:bg-brand-primary hover:text-brand-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Mobile menu ---------------- */}
      <div
        ref={mobileRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-0 z-[60] flex flex-col bg-brand-dark text-brand-cream transition-[clip-path,visibility] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none lg:hidden ${
          mobileOpen ? "visible" : "invisible"
        }`}
        style={{
          clipPath: mobileOpen
            ? "circle(150% at calc(100% - 2.5rem) 2.5rem)"
            : "circle(0% at calc(100% - 2.5rem) 2.5rem)",
        }}
      >
        <div className="flex h-20 shrink-0 items-center justify-between px-4 sm:px-6">
          <span className="font-display text-lg font-bold tracking-tight">
            BB's ROYAL BASKET
          </span>
          <button
            ref={mobileCloseRef}
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-cream/20 transition-colors hover:bg-brand-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <nav
          className="flex-1 overflow-y-auto px-4 pb-6 pt-2 sm:px-6"
          aria-label="Mobile"
        >
          <ul>
            {navLinks.map((link, i) => (
              <li
                key={link.path}
                className="overflow-hidden border-b border-brand-cream/10"
              >
                <NavLink
                  to={link.path}
                  end={link.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center justify-between py-4 font-display text-4xl font-bold tracking-tight transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary ${
                      isActive ? "text-brand-secondary" : "text-brand-cream"
                    } ${
                      mobileOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0"
                    }`
                  }
                  style={{
                    transitionDelay: mobileOpen ? `${250 + i * 70}ms` : "0ms",
                  }}
                >
                  {link.name}
                  <ArrowUpRight
                    size={22}
                    aria-hidden="true"
                    className="text-brand-cream/40"
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={`shrink-0 border-t border-brand-cream/10 px-4 pt-5 transition-all duration-700 motion-reduce:transition-none sm:px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] ${
            mobileOpen
              ? "translate-y-0 opacity-100 delay-500"
              : "translate-y-4 opacity-0"
          }`}
        >
          <div className="grid grid-cols-3 gap-3">
            <Link to={accountPath} className={mobileTile}>
              <UserRound size={20} />
              {isAuthenticated ? "Account" : "Login"}
            </Link>
            <Link to="/wishlist" className={mobileTile}>
              <Heart size={20} />
              Wishlist
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setSearchOpen(true);
              }}
              className={mobileTile}
            >
              <Search size={20} />
              Search
            </button>
          </div>
          <p className="mt-5 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-brand-secondary">
            Naturally Rich • Truly Premium
          </p>
        </div>
      </div>
    </>
  );
}
