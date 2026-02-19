import Link from "next/link";
import "../../styles/layout.css";
import { useAuth } from "../../context/AuthContext";


const Sidebar = ({ show, setShow }) => {
  const { user } = useAuth();
  return (
    <div className={`sidebar ${show ? "show" : ""}`}>
      <h2>Pages</h2>
      <br />
      <hr />
      <nav>
        {user && <Link href="/user" onClick={() => setShow(false)} className={"sidebarLink"}>Profile</Link>}
        <Link href="/books" onClick={() => setShow(false)} className={"sidebarLink"}>Books</Link>
        <Link href="/orders" onClick={() => setShow(false)} className={"sidebarLink"}>Orders</Link>
        <Link href="/cart" onClick={() => setShow(false)} className={"sidebarLink"}>Cart</Link>
        {user && <Link href="/contact" onClick={() => setShow(false)} className={"sidebarLink"}>Contact</Link>}
        <Link href="/" onClick={() => setShow(false)} className={"sidebarLink"}>About</Link>
        <Link href="/global" onClick={() => setShow(false)} className={"sidebarLink"}>Global Chat</Link>
        {!user && <Link href="/login" onClick={() => setShow(false)} className={"sidebarLink"}>Login</Link>}
        {!user && <Link href="/register" onClick={() => setShow(false)} className={"sidebarLink"}>Signup</Link>}
      </nav>
      {!user && <Link href={"/login"} className={"btn sidebarLogin"}>Login</Link>}
    </div>
  );
};

export default Sidebar;
