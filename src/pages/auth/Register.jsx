import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LockKeyhole, Mail } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import AuthShell from "./AuthShell";
import {
  Field,
  PasswordToggle,
  ServerError,
  SubmitButton,
  getSafeRedirect,
  inputClass,
} from "./authShared";

const FIELD_ORDER = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "password",
  "confirmPassword",
];

/* --------------------------------
   Validation
-------------------------------- */

const validate = (form) => {
  const errors = {};

  if (!form.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!form.lastName.trim()) errors.lastName = "Enter your last name.";

  const email = form.email.trim();
  if (!email) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email address.";

  if (!/^[6-9]\d{9}$/.test(form.phone))
    errors.phone = "Enter a valid 10-digit mobile number.";

  if (form.password.length < 6)
    errors.password = "Password must be at least 6 characters.";

  if (!form.confirmPassword) errors.confirmPassword = "Repeat your password.";
  else if (form.password !== form.confirmPassword)
    errors.confirmPassword = "Passwords do not match.";

  return errors;
};

/* --------------------------------
   Password strength (a guide only, it never blocks)
-------------------------------- */

const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong", "Strong"];
const STRENGTH_COLORS = [
  "bg-red-500",
  "bg-red-500",
  "bg-amber-500",
  "bg-brand-secondary",
  "bg-brand-primary",
];

const getStrength = (password) => {
  if (!password) return { label: "", filled: 0 };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const tooShort = password.length < 6;
  return {
    label: tooShort ? "Too short" : STRENGTH_LABELS[score],
    filled: tooShort ? 1 : Math.max(1, score),
  };
};

/* --------------------------------
   Register Page
-------------------------------- */

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const { register, isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const redirectTo = useMemo(() => getSafeRedirect(location), [location]);
  const errors = useMemo(() => validate(form), [form]);
  const strength = useMemo(() => getStrength(form.password), [form.password]);

  const errorFor = (name) =>
    touched[name] || submitted ? errors[name] : undefined;

  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  // Already signed in? Skip the form.
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, isAuthenticated, navigate, redirectTo]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitted(true);

    const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);
    setServerError("");

    try {
      const result = await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone,
        password: form.password,
      });

      if (!result?.success) {
        setServerError(result?.message || "Unable to create your account.");
        return;
      }

      toast.success("Account created successfully!");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error("Registration page error:", error);
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldProps = (name) => ({
    id: name,
    name,
    value: form[name],
    onChange: handleChange,
    onBlur: handleBlur,
    disabled: submitting,
    "aria-invalid": Boolean(errorFor(name)),
    "aria-describedby":
      errorFor(name) || (name === "confirmPassword" && passwordsMatch)
        ? `${name}-message`
        : undefined,
  });

  return (
    <AuthShell
      mode="signup"
      title="Create your account"
      subtitle="Join BB's Royal Basket and manage your orders easily."
    >
      <ServerError message={serverError} />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Name */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="firstName"
            label="First name"
            error={errorFor("firstName")}
          >
            <input
              {...fieldProps("firstName")}
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              className={inputClass(errorFor("firstName"), "px-4")}
            />
          </Field>

          <Field id="lastName" label="Last name" error={errorFor("lastName")}>
            <input
              {...fieldProps("lastName")}
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              className={inputClass(errorFor("lastName"), "px-4")}
            />
          </Field>
        </div>

        {/* Email */}
        <Field id="email" label="Email address" error={errorFor("email")}>
          <div className="relative">
            <Mail
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40"
            />
            <input
              {...fieldProps("email")}
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck="false"
              placeholder="you@example.com"
              className={inputClass(errorFor("email"), "pl-11 pr-4")}
            />
          </div>
        </Field>

        {/* Phone */}
        <Field id="phone" label="Mobile number" error={errorFor("phone")}>
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
              placeholder="10-digit mobile number"
              className={inputClass(errorFor("phone"), "pl-[4.5rem] pr-4")}
            />
          </div>
        </Field>

        {/* Password + strength */}
        <div>
          <Field id="password" label="Password" error={errorFor("password")}>
            <div className="relative">
              <LockKeyhole
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40"
              />
              <input
                {...fieldProps("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                className={inputClass(errorFor("password"), "pl-11 pr-12")}
              />
              <PasswordToggle
                shown={showPassword}
                disabled={submitting}
                onClick={() => setShowPassword((v) => !v)}
              />
            </div>
          </Field>

          {form.password && (
            <div className="mt-3" aria-live="polite">
              <div className="flex gap-1.5" aria-hidden="true">
                {[1, 2, 3, 4].map((segment) => (
                  <span
                    key={segment}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      segment <= strength.filled
                        ? STRENGTH_COLORS[strength.filled]
                        : "bg-brand-dark/10"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-xs text-brand-muted">
                Password strength:{" "}
                <span className="font-semibold text-brand-dark">
                  {strength.label}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <Field
          id="confirmPassword"
          label="Confirm password"
          error={errorFor("confirmPassword")}
          hint={passwordsMatch ? "Passwords match." : undefined}
        >
          <div className="relative">
            <LockKeyhole
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40"
            />
            <input
              {...fieldProps("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repeat your password"
              className={inputClass(errorFor("confirmPassword"), "pl-11 pr-12")}
            />
            <PasswordToggle
              shown={showConfirmPassword}
              disabled={submitting}
              onClick={() => setShowConfirmPassword((v) => !v)}
            />
          </div>
        </Field>

        <div className="pt-1">
          <SubmitButton
            loading={submitting}
            loadingText="Creating account…"
            disabled={loading}
          >
            Create account
          </SubmitButton>
        </div>

        <p className="text-center text-xs leading-5 text-brand-muted">
          By creating an account you agree to our{" "}
          <Link
            to="/privacy-policy"
            className="font-medium text-brand-primary underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}
