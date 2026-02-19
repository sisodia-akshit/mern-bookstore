import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import QueryProvider from "@/context/QueryProvider";
import "../styles/index.css";
import "../styles/App.css";
import { CheckoutProvider } from "@/context/CheckoutContext";

export const metadata = {
  title: "BookStore",
  description: "MERN Marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
      </head>
      <body>
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <CheckoutProvider>{children}</CheckoutProvider>
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
