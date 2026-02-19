import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate()

  const logoClickedHandler = (e) => {
    navigate("/")
  }

  const ProfileClickedHandler = (e) => {
    navigate("/user")
  }

  return (
    <>
      {/* wideScreen */}
      <nav className="navbar">
        <div className="navbarContainer">
          <h3 className="navbarLeft logo" onClick={logoClickedHandler}>
            BookStore
          </h3>

          <ul>
            <li><NavLink to="/books" className={({ isActive }) => isActive ? "active-link" : "btn"}>
              <i className="fa-solid fa-book"></i>Books</NavLink></li>

            <li><NavLink to="/orders" className={({ isActive }) => isActive ? "active-link" : "btn"}>
              <i className="fa-solid fa-box"></i>Orders
              {/* {cart?.items?.length > 0 && <span className="navCartNotify">{cart?.items?.length}</span>} */}
            </NavLink>
            </li>
            <li><NavLink to="/cart" className={({ isActive }) => isActive ? "active-link" : "btn"}>
              <i className="fa-solid fa-basket-shopping"></i>Cart
              {cart?.items?.length > 0 && <span className="navCartNotify">{cart?.items?.length}</span>}
            </NavLink>
            </li>

            {user && <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active-link" : "btn"}>
              <i className="fa-solid fa-envelope"></i>Contact</NavLink></li>}

            {user && <li><NavLink to="/global" className={({ isActive }) => isActive ? "active-link" : "btn"}>
              <i className="fa-solid fa-globe"></i>Chat</NavLink></li>}

          </ul>

          {!user && <NavLink to={"/login"} className={({ isActive }) =>
            isActive ? "navbarRight active-link" : "navbarRight btn"}>Login</NavLink>}

          {user && <i className="fa-solid fa-circle-user navbarUser" style={{ fontSize: 30, cursor: "pointer" }} onClick={ProfileClickedHandler} />}

          <span className="navbarMenu" onClick={onMenuClick}><i className="fa-solid fa-bars" /></span>

        </div>
      </nav>

      {/* phones */}
      <nav className="navbarBottom">
        <ul>
          <NavLink to="/books" className={({ isActive }) => isActive ? "active-link" : "link"}>
            <i className="fa-solid fa-book"></i>
          </NavLink>

          <NavLink to="/orders" className={({ isActive }) => isActive ? "active-link" : "link"}>
            <i className="fa-solid fa-box"></i>
          </NavLink>

          {user && <NavLink to="/global" className={({ isActive }) => isActive ? "active-link" : "link"}>
            <i className="fa-solid fa-globe"></i>
          </NavLink>}


          <NavLink to="/cart" className={({ isActive }) => isActive ? "active-link" : "link"} >
            <i className="fa-solid fa-basket-shopping" style={{ position: "relative" }}>
              {cart?.items?.length > 0 && <span className="navCartNotify">{cart?.items?.length}</span>}
            </i>
          </NavLink>

          {/* {user && <NavLink to="/contact" className={({ isActive }) => isActive ? "active-link" : "link"}>
            <i className="fa-solid fa-envelope"></i>
          </NavLink>} */}

          <NavLink to="/user" className={({ isActive }) => isActive ? "active-link" : "link"}>
            <i className="fa-solid fa-circle-user"></i>
          </NavLink>
        </ul>
      </nav>
    </>

  );
};

export default Navbar;
