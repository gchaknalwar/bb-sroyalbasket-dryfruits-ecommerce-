import { AlertCircle, ArrowRight, Check, Eye, EyeOff } from "lucide-react";

/* Change these if your routes are different */
export const LOGIN_PATH = "/login";
export const SIGNUP_PATH = "/register";
export const DEFAULT_REDIRECT = "/account";

/* --------------------------------
   Safe Redirect
   (accepts a string or a router location object)
-------------------------------- */

export const getSafeRedirect = (location) => {
  const from = location.state?.from;

  const target =
    typeof from === "string"
      ? from
      : typeof from?.pathname === "string"
        ? `${from.pathname}${from.search || ""}${from.hash || ""}`
        : null;

  // Only allow internal application routes.
  if (
    !target ||
    !target.startsWith("/") ||
    target.startsWith("//") ||
    target.includes("\\")
  ) {
    return DEFAULT_REDIRECT;
  }

  return target;
};

/* --------------------------------
   Input styling
-------------------------------- */

export const inputClass = (hasError, extra = "") =>
  `h-12 w-full rounded-xl border bg-white text-sm text-brand-dark outline-none transition placeholder:text-brand-dark/35 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
      : "border-brand-dark/15 hover:border-brand-dark/30 focus:border-brand-primary focus:ring-brand-primary/15"
  } ${extra}`;

/* --------------------------------
   Field wrapper (label + message)
-------------------------------- */

export function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-brand-dark"
      >
        {label}
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
        <p
          id={`${id}-message`}
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-brand-primary"
        >
          <Check size={13} aria-hidden="true" />
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/* --------------------------------
   Show / hide password button
-------------------------------- */

export function PasswordToggle({ shown, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={shown ? "Hide password" : "Show password"}
      aria-pressed={shown}
      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-brand-dark/50 transition-colors hover:bg-brand-dark/5 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
    >
      {shown ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

/* --------------------------------
   Error banner from the server
-------------------------------- */

export function ServerError({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

/* --------------------------------
   Primary submit button
-------------------------------- */

export function SubmitButton({ loading, loadingText, disabled, children }) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-6 text-sm font-semibold text-white shadow-lg shadow-brand-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary/90 hover:shadow-xl hover:shadow-brand-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 motion-reduce:transition-none"
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none"
          />
          {loadingText}
        </>
      ) : (
        <>
          {children}
          <ArrowRight
            size={18}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </>
      )}
    </button>
  );
}
