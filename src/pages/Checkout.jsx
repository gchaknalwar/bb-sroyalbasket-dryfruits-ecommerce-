import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";

const initialForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const submitRef = useRef(false);

  const { cartItems, clearCart } = useCart();

  const [form, setForm] = useState(initialForm);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0,
  );

  const shippingFee = subtotal >= 999 ? 0 : 50;
  const totalAmount = subtotal + shippingFee;

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Only allow digits for phone and pincode
    if (name === "phone" || name === "pincode") {
      const numericValue = value.replace(/\D/g, "");

      setForm((current) => ({
        ...current,
        [name]: numericValue,
      }));

      return;
    }

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitRef.current || submitting) {
      return;
    }

    // CART CHECK
    if (!cartItems.length) {
      toast.error("Your cart is empty.");
      navigate("/shop");
      return;
    }

    // BASIC VALIDATION
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      toast.error("Please complete all required delivery details.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^[1-9]\d{5}$/.test(form.pincode.trim())) {
      toast.error("Enter a valid 6-digit pincode.");
      return;
    }

    submitRef.current = true;
    setSubmitting(true);

    try {
      const orderData = {
        customer: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
        },

        shippingAddress: {
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
        },

        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: Number(item.quantity),
        })),

        paymentMethod,
      };

      const response = await createOrder(orderData);

      if (!response?.success || !response?.order) {
        throw new Error(response?.message || "Unable to place your order.");
      }

      toast.success("Order placed successfully!");

      clearCart();

      navigate(`/order-success/${response.order.orderNumber}`, {
        replace: true,
        state: {
          order: response.order,
        },
      });
    } catch (error) {
      console.error("Order placement error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "We couldn't place your order. Please try again.",
      );

      submitRef.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F5EC]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-[#64706A] hover:text-[#17251D]"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </Link>

          <h1 className="mt-5 text-3xl font-semibold text-[#17251D]">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-[#64706A]">
            Complete your delivery details and place your order.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          {/* LEFT */}
          <div className="space-y-6">
            {/* CUSTOMER */}
            <section className="rounded-2xl border border-[#E5D9C6] bg-white p-6">
              <h2 className="text-lg font-semibold text-[#17251D]">
                Customer Details
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#34423A]">
                    First Name *
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    className="w-full rounded-xl border border-[#DCCFBC] px-4 py-3 outline-none focus:border-[#A67C52]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#34423A]">
                    Last Name *
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    className="w-full rounded-xl border border-[#DCCFBC] px-4 py-3 outline-none focus:border-[#A67C52]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#34423A]">
                    Mobile Number *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-[#DCCFBC] px-4 py-3 outline-none focus:border-[#A67C52]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#34423A]">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="w-full rounded-xl border border-[#DCCFBC] px-4 py-3 outline-none focus:border-[#A67C52]"
                  />
                </div>
              </div>
            </section>

            {/* ADDRESS */}
            <section className="rounded-2xl border border-[#E5D9C6] bg-white p-6">
              <h2 className="text-lg font-semibold text-[#17251D]">
                Delivery Address
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#34423A]">
                    Full Address *
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    autoComplete="street-address"
                    className="w-full resize-none rounded-xl border border-[#DCCFBC] px-4 py-3 outline-none focus:border-[#A67C52]"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#34423A]">
                      City *
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      autoComplete="address-level2"
                      className="w-full rounded-xl border border-[#DCCFBC] px-4 py-3 outline-none focus:border-[#A67C52]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#34423A]">
                      State *
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      autoComplete="address-level1"
                      className="w-full rounded-xl border border-[#DCCFBC] px-4 py-3 outline-none focus:border-[#A67C52]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#34423A]">
                      Pincode *
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      maxLength={6}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      className="w-full rounded-xl border border-[#DCCFBC] px-4 py-3 outline-none focus:border-[#A67C52]"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* PAYMENT */}
            <section className="rounded-2xl border border-[#E5D9C6] bg-white p-6">
              <h2 className="text-lg font-semibold text-[#17251D]">
                Payment Method
              </h2>

              <div className="mt-5">
                <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-[#DCCFBC] p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                  />

                  <div>
                    <p className="font-medium text-[#17251D]">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-sm text-[#64706A]">
                      Pay when your order arrives.
                    </p>
                  </div>
                </label>

                <label className="mt-3 flex items-center gap-4 rounded-xl border border-[#DCCFBC] p-4 opacity-60">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    disabled
                  />

                  <div>
                    <p className="font-medium text-[#17251D]">Online Payment</p>

                    <p className="mt-1 text-sm text-[#64706A]">Coming soon.</p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <aside className="h-fit rounded-2xl border border-[#E5D9C6] bg-white p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-[#17251D]">
              Order Summary
            </h2>

            <div className="mt-5 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-[#17251D]">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-[#64706A]">
                      {item.quantity} × ₹{item.price}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-[#17251D]">
                    ₹
                    {(
                      Number(item.price) * Number(item.quantity)
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-5 border-t border-[#E8DFD2]" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#64706A]">Subtotal</span>

                <span className="font-medium text-[#17251D]">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#64706A]">Shipping</span>

                <span className="font-medium text-[#17251D]">
                  {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                </span>
              </div>
            </div>

            <div className="my-5 border-t border-[#E8DFD2]" />

            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#17251D]">Total</span>

              <span className="text-xl font-bold text-[#17251D]">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting || !cartItems.length}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#17251D] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#24362A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>

            <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#F7F3EA] p-4">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-[#7B4F2A]"
              />

              <p className="text-xs leading-5 text-[#64706A]">
                Your order information is securely protected.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
