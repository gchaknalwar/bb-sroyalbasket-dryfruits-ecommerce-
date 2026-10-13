import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = "bbs_auth_token";
const AUTH_USER_KEY = "bbs_auth_user";

// setTimeout cannot handle delays above this (about 24.8 days)
const MAX_TIMEOUT_MS = 2 ** 31 - 1;

const SESSION_EXPIRED_MESSAGE =
  "Your session has expired. Please log in again.";

/* -----------------------------
   Storage Helpers
----------------------------- */

const getStoredToken = () => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (!storedUser) return null;

    const parsed = JSON.parse(storedUser);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const storeAuth = (token, user) => {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage errors (private mode, quota, etc.).
  }
};

const removeStoredAuth = () => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    // Ignore storage errors.
  }
};

/* -----------------------------
   Token Helpers
----------------------------- */

// Returns the expiry time in ms for a JWT, or null if it isn't a readable JWT.
const getTokenExpiry = (token) => {
  try {
    const payload = token?.split(".")[1];
    if (!payload) return null;

    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json);

    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const expiry = getTokenExpiry(token);
  return expiry !== null && expiry <= Date.now();
};

// Read the saved session once. An expired token is dropped immediately,
// so we don't waste a request or flash a logged-in UI.
const readInitialAuth = () => {
  const token = getStoredToken();

  if (token && isTokenExpired(token)) {
    removeStoredAuth();
    return { token: null, user: null };
  }

  return { token, user: token ? getStoredUser() : null };
};

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

/* -----------------------------
   Auth Provider
----------------------------- */

export function AuthProvider({ children }) {
  const [initial] = useState(readInitialAuth);

  const [token, setToken] = useState(initial.token);
  const [user, setUser] = useState(initial.user);
  const [loading, setLoading] = useState(Boolean(initial.token));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // A token we just received from login/register is already trusted,
  // so we skip the extra "who am I" request for it.
  const trustedToken = useRef(null);

  /* -----------------------------
     Save / Clear Authentication
  ----------------------------- */

  const saveAuth = useCallback((authToken, authUser) => {
    if (!authToken || !authUser) return;

    trustedToken.current = authToken;
    storeAuth(authToken, authUser);

    setToken(authToken);
    setUser(authUser);
  }, []);

  const clearAuth = useCallback(() => {
    trustedToken.current = null;
    removeStoredAuth();

    setToken(null);
    setUser(null);
  }, []);

  /* -----------------------------
     Login
  ----------------------------- */

  const login = useCallback(
    async (credentials) => {
      setError("");
      setSubmitting(true);

      try {
        const response = await loginUser(credentials);

        if (!response?.success || !response?.token || !response?.user) {
          throw new Error(response?.message || "Unable to login.");
        }

        saveAuth(response.token, response.user);

        return {
          success: true,
          user: response.user,
          message: response.message || "Login successful.",
        };
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Unable to login. Please try again.",
        );

        setError(message);
        return { success: false, message };
      } finally {
        setSubmitting(false);
      }
    },
    [saveAuth],
  );

  /* -----------------------------
     Register
  ----------------------------- */

  const register = useCallback(
    async (userData) => {
      setError("");
      setSubmitting(true);

      try {
        const response = await registerUser(userData);

        if (!response?.success || !response?.token || !response?.user) {
          throw new Error(
            response?.message || "Unable to create your account.",
          );
        }

        saveAuth(response.token, response.user);

        return {
          success: true,
          user: response.user,
          message: response.message || "Account created successfully.",
        };
      } catch (err) {
        const message = getErrorMessage(err, "Unable to create your account.");

        setError(message);
        return { success: false, message };
      } finally {
        setSubmitting(false);
      }
    },
    [saveAuth],
  );

  /* -----------------------------
     Logout
  ----------------------------- */

  const logout = useCallback(() => {
    clearAuth();
    setError("");
  }, [clearAuth]);

  /* -----------------------------
     Update the logged-in user locally
     (e.g. after the profile is edited)
  ----------------------------- */

  const updateUser = useCallback((changes) => {
    setUser((previous) => {
      if (!previous) return previous;

      const next = { ...previous, ...changes };

      try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors.
      }

      return next;
    });
  }, []);

  /* -----------------------------
     Restore Session
     Only a real "not authorised" answer logs the user out.
     A network or server error keeps them signed in.
  ----------------------------- */

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      if (trustedToken.current === token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        if (cancelled) return;

        if (response?.success && response?.user) {
          setUser(response.user);
          storeAuth(token, response.user);
        } else {
          clearAuth();
        }
      } catch (err) {
        if (cancelled) return;

        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          clearAuth();
        }
        // Any other failure (offline, 500): keep the saved session.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [token, clearAuth]);

  /* -----------------------------
     Auto logout when the token expires
  ----------------------------- */

  useEffect(() => {
    if (!token) return undefined;

    const expiry = getTokenExpiry(token);
    if (expiry === null) return undefined;

    const remaining = expiry - Date.now();

    if (remaining <= 0) {
      clearAuth();
      setError(SESSION_EXPIRED_MESSAGE);
      return undefined;
    }

    const timer = setTimeout(
      () => {
        clearAuth();
        setError(SESSION_EXPIRED_MESSAGE);
      },
      Math.min(remaining, MAX_TIMEOUT_MS),
    );

    return () => clearTimeout(timer);
  }, [token, clearAuth]);

  /* -----------------------------
     Keep multiple tabs in sync
     (log out in one tab = logged out everywhere)
  ----------------------------- */

  useEffect(() => {
    const onStorage = (event) => {
      if (
        event.key !== null &&
        event.key !== AUTH_TOKEN_KEY &&
        event.key !== AUTH_USER_KEY
      ) {
        return;
      }

      const storedToken = getStoredToken();
      setToken(storedToken);
      setUser(storedToken ? getStoredUser() : null);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* -----------------------------
     Optional: log out when any API call returns 401.
     In your axios response interceptor, run:
       window.dispatchEvent(new Event("auth:unauthorized"))
  ----------------------------- */

  useEffect(() => {
    const onUnauthorized = () => {
      clearAuth();
      setError(SESSION_EXPIRED_MESSAGE);
    };

    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, [clearAuth]);

  /* -----------------------------
     Clear Error
  ----------------------------- */

  const clearError = useCallback(() => {
    setError("");
  }, []);

  /* -----------------------------
     Context Value
  ----------------------------- */

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      submitting,
      error,

      isAuthenticated: Boolean(token && user),

      login,
      register,
      logout,
      updateUser,

      clearError,
    }),
    [
      user,
      token,
      loading,
      submitting,
      error,
      login,
      register,
      logout,
      updateUser,
      clearError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* -----------------------------
   Auth Hook
----------------------------- */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
