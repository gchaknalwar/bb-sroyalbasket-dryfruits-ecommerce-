import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Wholesale from "../pages/Wholesale";
import ShippingPolicy from "../pages/ShippingPolicy";
import FAQs from "../pages/FAQ's";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="wholesale" element={<Wholesale />} />
        <Route path="product/:slug" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success/:orderNumber" element={<OrderSuccess />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/faq" element={<FAQs />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
      </Route>
    </Routes>
  );
}
