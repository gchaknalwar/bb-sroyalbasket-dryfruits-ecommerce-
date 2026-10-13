import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { AuthProvider } from "./context/AuthContext.jsx";


import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <AppRoutes />

            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#17251D",
                  color: "#F9F5EC",
                  fontSize: "14px",
                  borderRadius: "8px",
                },
              }}
            />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
