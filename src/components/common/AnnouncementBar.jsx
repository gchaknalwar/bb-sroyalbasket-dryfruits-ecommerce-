import { useEffect, useMemo, useState } from "react";
import { FREE_SHIPPING_THRESHOLD } from "../../constants/store";
import { formatINR } from "../../utils/format";

const ROTATE_MS = 4500;
const FADE_MS = 250;
// Same-day dispatch cutoff (24h, store time in IST). Change it, or delete the
// dispatch message below if the client doesn't offer this.
const DISPATCH_CUTOFF_HOUR = 16;
const DISMISS_KEY = "announcement-dismissed";

function useNow(intervalMs) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

const STORE_TZ = "Asia/Kolkata";

// Minutes-left text based on STORE time, not the visitor's device time.
function timeToCutoff(now) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: STORE_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour").value);
  const m = Number(parts.find((p) => p.type === "minute").value);
  const left = DISPATCH_CUTOFF_HOUR * 60 - (h * 60 + m);
  if (left <= 0) return null;
  const hours = Math.floor(left / 60);
  return hours > 0 ? `${hours}h ${left % 60}m` : `${left}m`;
}

/**
 * cartTotal: pass the live cart subtotal (number) so the bar reacts as
 * items are added or removed. Defaults to 0 (no cart yet).
 */
export default function AnnouncementBar({ cartTotal: rawTotal = 0 }) {
  const cartTotal = Number.isFinite(rawTotal) ? rawTotal : 0;
  const now = useNow(30_000);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const unlocked = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const progress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const cutoffLeft = timeToCutoff(now);

  const messages = useMemo(() => {
    const list = [];
    if (unlocked) {
      list.push("You've unlocked free delivery on this order");
    } else if (cartTotal > 0) {
      list.push(`Add ${formatINR(remaining)} more to get free delivery`);
    } else {
      list.push(
        `Free delivery on orders above ${formatINR(FREE_SHIPPING_THRESHOLD)}`,
      );
    }
    list.push("Cash on delivery available");
    if (cutoffLeft)
      list.push(`Order within ${cutoffLeft} for same-day dispatch`);
    return list;
  }, [unlocked, cartTotal, remaining, cutoffLeft]);

  // Rotate messages: fade out, swap, fade in.
  useEffect(() => {
    if (paused || dismissed || messages.length < 2) return;
    let swap;
    const id = setInterval(() => {
      setVisible(false);
      swap = setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => {
      clearInterval(id);
      clearTimeout(swap);
      setVisible(true); // never leave the text faded out if we stop mid-fade
    };
  }, [paused, dismissed, messages.length]);

  // When the cart changes, jump to the delivery message so the shopper sees it.
  useEffect(() => {
    setIndex(0);
    setVisible(true);
  }, [cartTotal]);

  if (dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* storage unavailable, dismiss for this view only */
    }
  };

  return (
    <div
      role="region"
      aria-label="Store announcements"
      className="relative bg-brand-primary text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center px-10 py-2">
        <p
          aria-live="off"
          className={`text-center text-[13px] font-medium tracking-wide transition-all duration-200 motion-reduce:transition-none ${
            visible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
          }`}
        >
          {messages[index % messages.length]}
        </p>

        {messages.length > 1 && (
          <div
            className="ml-4 hidden items-center gap-1.5 sm:flex"
            aria-hidden="true"
          >
            {messages.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full bg-white transition-all duration-300 motion-reduce:transition-none ${
                  i === index % messages.length
                    ? "w-4 opacity-100"
                    : "w-1.5 opacity-40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-lg leading-none text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        &times;
      </button>

      {cartTotal > 0 && (
        <div
          className="absolute inset-x-0 bottom-0 h-[3px] bg-white/20"
          role="progressbar"
          aria-label="Progress toward free delivery"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div
            className={`h-full transition-[width] duration-500 ease-out motion-reduce:transition-none ${
              unlocked ? "bg-emerald-300" : "bg-amber-300"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
