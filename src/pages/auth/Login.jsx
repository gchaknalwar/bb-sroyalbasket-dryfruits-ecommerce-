import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const validate = (form) => {
  const errors = {};
  const email = form.email.trim();

  if (!email) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email address.";

  if (!form.password) errors.password = "Enter your password.";

  return errors;
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const redirectTo = useMemo(() => getSafeRedirect(location), [location]);
  const errors = useMemo(() => validate(form), [form]);

  const errorFor = (name) =>
    touched[name] || submitted ? errors[name] : undefined;

  // Already signed in? Skip the form.
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, isAuthenticated, navigate, redirectTo]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (serverError) setServerError("");
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitted(true);

    const firstInvalid = ["email", "password"].find((name) => errors[name]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);
    setServerError("");

    try {
      const result = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (!result?.success) {
        setServerError(result?.message || "Unable to login. Please try again.");
        return;
      }

      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error("Login page error:", error);
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
    "aria-describedby": errorFor(name) ? `${name}-message` : undefined,
  });

  return (
    <AuthShell
      mode="login"
      title="Welcome back"
      subtitle="Sign in to your BB's Royal Basket account."
    >
      <ServerError message={serverError} />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
              autoComplete="current-password"
              placeholder="Enter your password"
              className={inputClass(errorFor("password"), "pl-11 pr-12")}
            />
            <PasswordToggle
              shown={showPassword}
              disabled={submitting}
              onClick={() => setShowPassword((v) => !v)}
            />
          </div>
        </Field>

        <div className="pt-1">
          <SubmitButton
            loading={submitting}
            loadingText="Signing in…"
            disabled={loading}
          >
            Sign in
          </SubmitButton>
        </div>
      </form>
    </AuthShell>
  );
}
