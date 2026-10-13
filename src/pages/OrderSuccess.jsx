import { Link, Navigate, useLocation } from "react-router-dom";
import { Check, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { LAST_ORDER_KEY } from "../constants/store";
import { formatINR } from "../utils/format";

const readLastOrder = () => {
  try {
    return JSON.parse(sessionStorage.getItem(LAST_ORDER_KEY));
  } catch {
    return null;
  }
};

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order ?? readLastOrder();

  if (!order) {
    return <Navigate to="/shop" replace />;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      toast.success("Order number copied.");
    } catch {
      toast.error("Couldn't copy. Please note it down.");
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary text-white">
        <Check size={22} />
      </div>

      <h1 className="mt-5 font-display text-3xl leading-tight text-brand-dark sm:text-4xl">
        {order.customer?.firstName
          ? `Thank you, ${order.customer.firstName}. Your order is placed.`
          : "Thank you. Your order is placed."}
      </h1>

      <p className="mt-3 text-brand-muted">
        We've received your order. Keep the order number below for reference.
      </p>

      <div className="mt-8 flex items-center justify-between gap-4 rounded-lg border border-brand-dark/15 bg-white p-5">
        <div className="min-w-0">
          <p className="text-sm text-brand-muted">Order number</p>
          <p className="mt-1 break-all font-semibold text-brand-dark">
            {order.orderNumber}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-2 rounded-md border border-brand-dark/20 px-3.5 py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-cream"
        >
          <Copy size={15} />
          Copy
        </button>
      </div>

      <h2 className="mt-10 font-display text-xl text-brand-dark">Items</h2>

      <ul className="mt-4 divide-y divide-brand-dark/15 border-y border-brand-dark/15">
        {order.items.map((item, index) => (
          <li
            key={`${item.product}-${index}`}
            className="flex items-center justify-between gap-4 py-4"
          >
            <div>
              <p className="text-sm font-medium text-brand-dark">{item.name}</p>
              <p className="text-sm text-brand-muted">
                {item.weight}, {item.quantity} × {formatINR(item.price)}
              </p>
            </div>

            <p className="text-sm font-medium tabular-nums text-brand-dark">
              {formatINR(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-brand-muted">Subtotal</dt>
          <dd className="tabular-nums">{formatINR(order.subtotal)}</dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-brand-muted">Delivery</dt>
          <dd className="tabular-nums">
            {order.shippingFee === 0 ? "Free" : formatINR(order.shippingFee)}
          </dd>
        </div>

        <div className="flex justify-between border-t border-brand-dark/15 pt-4 text-base font-semibold text-brand-dark">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatINR(order.totalAmount)}</dd>
        </div>
      </dl>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-xl text-brand-dark">Delivery address</h2>

          <p className="mt-3 text-sm leading-6 text-brand-muted">
            {order.customer?.firstName} {order.customer?.lastName}
            <br />
            {order.shippingAddress.address}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.pincode}
            {order.customer?.phone && (
              <>
                <br />
                +91 {order.customer.phone}
              </>
            )}
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl text-brand-dark">Payment</h2>

          <p className="mt-3 text-sm leading-6 text-brand-muted">
            {order.paymentMethod === "COD"
              ? `Cash on delivery. Please keep ${formatINR(order.totalAmount)} ready when your order arrives.`
              : "Online payment"}
          </p>
        </div>
      </div>

      <Link
        to="/shop"
        className="mt-12 inline-block rounded-md bg-brand-primary px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Continue shopping
      </Link>
    </section>
  );
}
