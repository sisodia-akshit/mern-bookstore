"use client";

import "../../styles/Navbar.css";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path) =>
    pathname.startsWith(path) ? "active-link" : "btn";

  return (
    <>
      <nav className="navbar">
        <div className="navbarContainer">
          <h3
            className="navbarLeft logo"
            onClick={() => router.push("/")}
          >
            BookStore
          </h3>

          <ul>
            <li>
              <Link href="/books" className={isActive("/books")}>
                Books
              </Link>
            </li>

            <li>
              <Link href="/orders" className={isActive("/orders")}>
                Orders
              </Link>
            </li>

            <li>
              <Link href="/cart" className={isActive("/cart")}>
                Cart
                {cart?.items?.length > 0 && (
                  <span className="navCartNotify">
                    {cart.items.length}
                  </span>
                )}
              </Link>
            </li>

            {user && (
              <li>
                <Link href="/contact" className={isActive("/contact")}>
                  Contact
                </Link>
              </li>
            )}

            {user && (
              <li>
                <Link href="/global" className={isActive("/global")}>
                  Chat
                </Link>
              </li>
            )}
          </ul>

          {!user && (
            <Link href="/login" className="navbarRight btn">
              Login
            </Link>
          )}

          {user && (
            <span className="navbarUser">
              <i
                className="fa-solid fa-circle-user navbarUser"
                style={{ fontSize: 30, cursor: "pointer" }}
                onClick={() => router.push("/user")}
              />
            </span>
          )}

          <span className="navbarMenu" onClick={onMenuClick}>
            <i className="fa-solid fa-bars" />
          </span>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
