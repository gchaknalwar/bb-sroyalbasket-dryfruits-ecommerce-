import { Outlet, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import { useCart } from "../../context/CartContext";
import AnnouncementBar from "../common/AnnouncementBar";
import ScrollToTop from "../common/ScrollToTop";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const { cartSubtotal } = useCart();

  return (
    // overflow-x-clip (not hidden) stops sideways scroll without breaking sticky elements
    <div className="flex min-h-screen flex-col overflow-x-clip bg-brand-cream text-brand-dark antialiased selection:bg-brand-secondary/40 selection:text-brand-dark">
      {/* Keyboard users can jump straight past the navbar */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-dark focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-secondary"
      >
        Skip to content
      </a>

      <ScrollToTop />
      <AnnouncementBar cartTotal={cartSubtotal} />
      <Navbar />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 focus:outline-none"
      >
        {/* Soft fade on every page change (opacity only, so sticky children keep working) */}
        <motion.div
          key={pathname}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
