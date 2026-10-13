import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useProducts } from "./ProductContext";
import { CART_STORAGE_KEY, MAX_QUANTITY_PER_ITEM } from "../constants/store";

const CartContext = createContext(null);

const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const normalizeQuantity = (quantity) => {
  const value = Number(quantity);

  if (!Number.isFinite(value) || value <= 0) return 0;

  return Math.min(Math.floor(value), MAX_QUANTITY_PER_ITEM);
};

const toSnapshot = (product, quantity) => ({
  id: String(product._id),
  slug: product.slug ?? "",
  name: product.name ?? "",
  price: Number(product.price) || 0,
  packSize: product.packSize ?? "",
  image: product.image ?? "",
  category: product.category ?? "",
  quantity: normalizeQuantity(quantity),
});

const readCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const saved = JSON.parse(raw);
    if (!Array.isArray(saved)) return [];

    return saved
      .map((item) => ({
        id: String(item?._id ?? item?.id ?? ""),
        slug: item?.slug ?? "",
        name: item?.name ?? "",
        price: Number(item?.price) || 0,
        packSize: item?.packSize ?? item?.weight ?? "",
        image: item?.image ?? "",
        category: item?.category ?? "",
        quantity: normalizeQuantity(item?.quantity),
      }))
      .filter((item) => OBJECT_ID.test(item.id) && item.quantity > 0);
  } catch {
    return [];
  }
};

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export function CartProvider({ children }) {
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refreshProducts,
  } = useProducts();

  const [stored, setStored] = useState(readCart);

  /*
   * The ref always holds the latest cart. Actions read from it and compute
   * the next cart synchronously, so addToCart can return an accurate result
   * (React state updaters are not guaranteed to run synchronously).
   */
  const storedRef = useRef(stored);

  const commit = useCallback((next) => {
    storedRef.current = next;
    setStored(next);
  }, []);

  /* Persist cart ---------------------------------------------------- */

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Storage unavailable or full. Cart still works for this session.
    }
  }, [stored]);

  /* Sync across browser tabs ---------------------------------------- */

  useEffect(() => {
    const onStorage = (event) => {
      // event.key is null when storage is cleared entirely.
      if (event.key !== null && event.key !== CART_STORAGE_KEY) return;
      commit(readCart());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [commit]);

  /* Product lookup -------------------------------------------------- */

  const productById = useMemo(
    () => new Map((products ?? []).map((p) => [String(p._id), p])),
    [products],
  );

  const catalogReady = !productsLoading && !productsError;

  /* Cart items (live catalogue data always wins) -------------------- */

  const cartItems = useMemo(() => {
    return stored.map((item) => {
      const live = productById.get(item.id);

      if (!live) {
        return {
          ...item,
          stock: null,
          issue: catalogReady ? "This product is no longer available." : null,
        };
      }

      const stock = Number(live.stock) || 0;

      let issue = null;
      if (stock <= 0) issue = "Sold out.";
      else if (item.quantity > stock) issue = `Only ${stock} left.`;

      return {
        ...item,
        slug: live.slug ?? item.slug,
        name: live.name ?? item.name,
        price: Number(live.price) || 0,
        packSize: live.packSize ?? item.packSize,
        image: live.image ?? item.image ?? "",
        category: live.category ?? item.category,
        stock,
        issue,
      };
    });
  }, [stored, productById, catalogReady]);

  /* Actions --------------------------------------------------------- */

  const addToCart = useCallback(
    (product, quantity = 1) => {
      if (!product?._id) {
        return { ok: false, message: "This product can't be added right now." };
      }

      const productId = String(product._id);
      const stock = Number(product.stock) || 0;

      if (stock <= 0) {
        return { ok: false, message: `${product.name} is sold out.` };
      }

      const requestedQuantity = normalizeQuantity(quantity);

      if (requestedQuantity <= 0) {
        return { ok: false, message: "Please select a valid quantity." };
      }

      const limit = Math.min(stock, MAX_QUANTITY_PER_ITEM);
      const items = storedRef.current;
      const existing = items.find((item) => item.id === productId);
      const currentQuantity = existing?.quantity ?? 0;
      const nextQuantity = Math.min(currentQuantity + requestedQuantity, limit);
      const added = nextQuantity - currentQuantity;

      if (added <= 0) {
        return {
          ok: false,
          message: `You already have all ${limit} available of ${product.name}.`,
        };
      }

      commit(
        existing
          ? items.map((item) =>
              item.id === productId
                ? { ...item, quantity: nextQuantity }
                : item,
            )
          : [...items, toSnapshot(product, nextQuantity)],
      );

      let message;
      if (added < requestedQuantity) {
        message = `Only ${limit} available, so we added ${added}.`;
      } else if (added === 1) {
        message = `${product.name} added to your basket.`;
      } else {
        message = `${added} × ${product.name} added to your basket.`;
      }

      return { ok: true, message };
    },
    [commit],
  );

  const removeFromCart = useCallback(
    (id) => {
      const productId = String(id);
      commit(storedRef.current.filter((item) => item.id !== productId));
    },
    [commit],
  );

  const updateQuantity = useCallback(
    (id, quantity) => {
      const productId = String(id);
      const nextQuantity = normalizeQuantity(quantity);
      const items = storedRef.current;

      if (nextQuantity <= 0) {
        commit(items.filter((item) => item.id !== productId));
        return;
      }

      const live = productById.get(productId);
      const stock = live ? Number(live.stock) || 0 : MAX_QUANTITY_PER_ITEM;
      const limit = Math.min(Math.max(stock, 1), MAX_QUANTITY_PER_ITEM);

      commit(
        items.map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.min(nextQuantity, limit) }
            : item,
        ),
      );
    },
    [commit, productById],
  );

  const clearCart = useCallback(() => commit([]), [commit]);

  /* Derived values -------------------------------------------------- */

  const cartCount = useMemo(
    () => stored.reduce((total, item) => total + item.quantity, 0),
    [stored],
  );

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0,
      ),
    [cartItems],
  );

  const hasIssues = useMemo(
    () => cartItems.some((item) => Boolean(item.issue)),
    [cartItems],
  );

  /* Context value --------------------------------------------------- */

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartSubtotal,
      hasIssues,
      catalogReady,
      catalogError: productsError,
      refreshCatalog: refreshProducts,

      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [
      cartItems,
      cartCount,
      cartSubtotal,
      hasIssues,
      catalogReady,
      productsError,
      refreshProducts,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
