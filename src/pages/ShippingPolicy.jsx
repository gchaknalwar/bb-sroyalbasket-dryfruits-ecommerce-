
import { motion, useReducedMotion } from "framer-motion";
import {
  Truck,
  PackageCheck,
  MapPin,
  Clock3,
  CreditCard,
  Package,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

const shippingSections = [
  {
    icon: Package,
    title: "1. Order Processing",
    content: [
      "Once your order is placed successfully, you will receive an order confirmation.",
      "Orders are prepared and packed carefully to help preserve the freshness and quality of our dry fruits, seeds, and other products.",
      "Processing times may vary depending on product availability, order volume, and holidays.",
    ],
  },
  {
    icon: Truck,
    title: "2. Shipping & Delivery",
    content: [
      "Delivery availability depends on your location and the serviceability of the delivery address.",
      "Estimated delivery information, where available, will be shared during checkout or through your order updates.",
      "Actual delivery times may vary due to courier operations, weather conditions, public holidays, or other circumstances beyond our control.",
    ],
  },
  {
    icon: CreditCard,
    title: "3. Shipping Charges",
    content: [
      "Applicable shipping or delivery charges will be displayed at checkout before you complete your order.",
      "Any promotional shipping offers or free-delivery eligibility will be communicated on our website or during checkout.",
      "Please review your order total carefully before making payment.",
    ],
  },
  {
    icon: PackageCheck,
    title: "4. Order Tracking",
    content: [
      "When tracking information is available, we will share it through the contact details provided with your order.",
      "Courier tracking updates may take some time to appear after the shipment has been dispatched.",
      "If you need help locating your order, please contact our support team with your order number.",
    ],
  },
  {
    icon: MapPin,
    title: "5. Delivery Address",
    content: [
      "Please provide a complete and accurate delivery address, including your PIN code and a reachable phone number.",
      "We may not be able to change the delivery address once an order has been processed or dispatched.",
      "If you notice an error in your address, contact us as soon as possible. Address changes cannot be guaranteed.",
    ],
  },
  {
    icon: RefreshCw,
    title: "6. Delays & Delivery Issues",
    content: [
      "Delivery may occasionally be delayed because of courier disruptions, weather, public holidays, or other unforeseen events.",
      "If your order appears delayed or the tracking status has not changed for an extended period, please contact us so we can help investigate.",
      "We will make reasonable efforts to assist you in resolving delivery-related concerns.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "7. Damaged or Incorrect Orders",
    content: [
      "Please inspect your package when it arrives.",
      "If you receive a damaged, missing, or incorrect item, contact us as soon as possible and include your order number and clear photographs of the package and product, where applicable.",
      "Our team will review the issue and guide you through the applicable resolution process under our return and refund policy.",
    ],
  },
];

export default function ShippingPolicy() {
  const reduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen bg-brand-cream text-brand-dark">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-brand-dark/10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-brand-secondary/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
              <Truck size={15} />
              Delivery Information
            </span>

            <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Our <span className="italic text-brand-primary">Shipping</span>
              <br />
              Policy
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
              From our basket to your doorstep, we want every BB’s Royal Basket
              order to arrive with care. Learn about our order processing,
              delivery, tracking, and shipping procedures.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2.5 text-sm text-brand-dark shadow-sm">
                <PackageCheck size={17} className="text-brand-primary" />
                Carefully packed
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2.5 text-sm text-brand-dark shadow-sm">
                <MapPin size={17} className="text-brand-primary" />
                Delivery updates
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
          className="rounded-3xl border border-brand-dark/10 bg-white/60 p-6 sm:p-9"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
              <Clock3 size={23} />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl">
                A little about our delivery process
              </h2>
              <p className="mt-3 text-sm leading-7 text-brand-muted sm:text-base">
                This policy explains how we handle orders placed through BB’s
                Royal Basket. Delivery estimates and service availability may
                vary depending on your location, the items ordered, and courier
                availability. Please refer to the information provided at
                checkout and in your order updates for the latest details.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Policy sections */}
      <section className="mx-auto max-w-5xl px-5 pb-16 sm:px-8 lg:px-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">
            The Details
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Shipping guidelines
          </h2>
        </div>

        <div className="space-y-4">
          {shippingSections.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.article
                key={section.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.12 }}
                variants={fadeUp}
                transition={{
                  duration: reduceMotion ? 0 : 0.4,
                  delay: reduceMotion ? 0 : index * 0.04,
                }}
                className="rounded-3xl border border-brand-dark/10 bg-white/60 p-6 transition-colors hover:bg-white/80 sm:p-8"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl sm:text-2xl">
                      {section.title}
                    </h3>

                    <ul className="mt-4 space-y-3">
                      {section.content.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm leading-7 text-brand-muted sm:text-base"
                        >
                          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-5 pb-16 sm:px-8 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-brand-dark px-6 py-10 text-center text-brand-cream sm:px-12 sm:py-14"
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-brand-secondary/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <MessageCircle size={25} />
            </div>

            <h2 className="mt-6 font-display text-3xl sm:text-4xl">
              Need help with your <span className="italic">order?</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-brand-cream/70 sm:text-base">
              Questions about shipping, tracking, or a delivery issue? Our team
              is here to help you with your BB’s Royal Basket order.
            </p>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Contact Us
              <ArrowRight size={17} />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
