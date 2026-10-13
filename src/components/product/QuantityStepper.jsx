import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

const HOLD_DELAY_MS = 450;
const REPEAT_MS = 90;

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantity",
  compact = false,
  disabled = false,
}) {
  const reduce = useReducedMotion();
  const size = compact ? "h-9 w-9" : "h-11 w-11";

  const current = Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : min;

  const atMin = disabled || current <= min;
  const atMax = disabled || current >= max;

  /* ---- Keep the latest values available to timers (no stale closures) ---- */
  const live = useRef({ current, min, max, onChange, disabled });
  useEffect(() => {
    live.current = { current, min, max, onChange, disabled };
  });

  /* ---- Direction of the last change, for the number animation ---- */
  const prev = useRef(current);
  const direction = current >= prev.current ? 1 : -1;
  useEffect(() => {
    prev.current = current;
  }, [current]);

  /* ---- Step + press-and-hold repeat ---- */
  const delayTimer = useRef(null);
  const repeatTimer = useRef(null);

  const stop = () => {
    clearTimeout(delayTimer.current);
    clearInterval(repeatTimer.current);
  };

  useEffect(() => stop, []);

  // Returns true if the value actually changed
  const step = (dir) => {
    const s = live.current;
    if (s.disabled || typeof s.onChange !== "function") return false;
    const next = Math.min(s.max, Math.max(s.min, s.current + dir));
    if (next === s.current) return false;
    s.current = next; // optimistic, so fast repeats don't wait for the parent
    s.onChange(next);
    return true;
  };

  const startHold = (dir) => (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    stop();
    if (!step(dir)) return;
    delayTimer.current = setTimeout(() => {
      repeatTimer.current = setInterval(() => {
        if (!step(dir)) stop();
      }, REPEAT_MS);
    }, HOLD_DELAY_MS);
  };

  // Keyboard activation (Enter / Space) arrives as a click with detail === 0
  const keyboardClick = (dir) => (e) => {
    if (e.detail === 0) step(dir);
  };

  const onGroupKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "+") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowDown" || e.key === "-") {
      e.preventDefault();
      step(-1);
    }
  };

  const btn = `flex ${size} touch-manipulation select-none items-center justify-center rounded-full text-brand-dark transition-all duration-200 hover:bg-brand-dark/5 hover:text-brand-primary active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary aria-disabled:cursor-not-allowed aria-disabled:text-brand-dark/30 aria-disabled:hover:bg-transparent aria-disabled:hover:text-brand-dark/30 aria-disabled:active:scale-100`;

  const lower = label.toLowerCase();

  return (
    <div
      role="group"
      aria-label={label}
      onKeyDown={onGroupKeyDown}
      className={`inline-flex items-center rounded-full border border-brand-dark/20 bg-white p-0.5 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      {/* aria-disabled (not `disabled`) so keyboard focus is not lost at the limits */}
      <button
        type="button"
        onPointerDown={startHold(-1)}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onContextMenu={(e) => e.preventDefault()}
        onClick={keyboardClick(-1)}
        aria-disabled={atMin}
        className={btn}
        aria-label={`Decrease ${lower}`}
      >
        <Minus size={15} aria-hidden="true" />
      </button>

      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`relative flex min-w-9 select-none items-center justify-center overflow-hidden text-sm font-semibold tabular-nums text-brand-dark ${
          compact ? "h-9" : "h-11"
        }`}
      >
        <motion.span
          key={current}
          initial={reduce ? false : { y: direction * 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {current}
        </motion.span>
      </span>

      <button
        type="button"
        onPointerDown={startHold(1)}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onContextMenu={(e) => e.preventDefault()}
        onClick={keyboardClick(1)}
        aria-disabled={atMax}
        className={btn}
        aria-label={`Increase ${lower}`}
      >
        <Plus size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
