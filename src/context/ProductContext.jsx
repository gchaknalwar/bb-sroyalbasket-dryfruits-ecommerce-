import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getProducts } from "../services/productService";
import { getErrorMessage } from "../services/api";

const ProductContext = createContext(null);

// Minimum gap between automatic background refreshes (on tab focus).
const FOCUS_REFRESH_INTERVAL_MS = 30_000;

export function ProductProvider({ children }) {
  const [state, setState] = useState({
    products: [],
    loading: true,
    error: "",
  });

  const lastLoadedAt = useRef(0);

  /*
   * silent = true: background refresh. It never flips `loading` and never
   * surfaces an error, so the UI doesn't flicker while the user is browsing.
   */
  const load = useCallback(async ({ silent = false } = {}) => {
    try {
      const data = await getProducts();
      const products = Array.isArray(data) ? data : [];

      lastLoadedAt.current = Date.now();
      setState({ products, loading: false, error: "" });
    } catch (err) {
      console.error("Failed to fetch products:", err);

      if (silent) return;

      setState((current) => ({
        ...current,
        loading: false,
        error: getErrorMessage(err, "We couldn't load the products."),
      }));
    }
  }, []);

  /* Initial load ---------------------------------------------------- */

  useEffect(() => {
    load();
  }, [load]);

  /* Keep stock fresh when the user returns to the tab ---------------- */

  useEffect(() => {
    const refreshIfStale = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastLoadedAt.current < FOCUS_REFRESH_INTERVAL_MS) return;

      load({ silent: true });
    };

    window.addEventListener("focus", refreshIfStale);
    document.addEventListener("visibilitychange", refreshIfStale);

    return () => {
      window.removeEventListener("focus", refreshIfStale);
      document.removeEventListener("visibilitychange", refreshIfStale);
    };
  }, [load]);

  /* Manual refresh (e.g. Retry button) ------------------------------ */

  const refreshProducts = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    return load();
  }, [load]);

  const value = useMemo(
    () => ({ ...state, refreshProducts }),
    [state, refreshProducts],
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used inside ProductProvider");
  }

  return context;
}
