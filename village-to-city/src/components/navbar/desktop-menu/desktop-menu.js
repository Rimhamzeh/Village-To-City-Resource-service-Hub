import {Link, useLocation, useNavigate } from "react-router-dom";
import { isCartSelected, isStoreSelected } from "../../../utils/checkRoutes";
import { FaShoppingCart } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";
import { IoStorefront } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { useContext } from "react";
import { MainContext } from "../../../utils/context";
function DesktopMenu() {
  const loc = useLocation();
  const { cartProducts } = useContext(MainContext);
  const navigate = useNavigate();
  return (
    <div>
      <Link
        to="/"
        className={`navbar__right-side__item
      ${isStoreSelected(loc.pathname) && "navbar__right-side__item--selected"}`}
      >
       <FaHome />Home
      </Link>
      <Link
        to="/product"
        className={`navbar__right-side__item
              ${
                isStoreSelected(loc.pathname) &&
                "navbar__right-side__item--selected"
              }`}
      >
        <AiFillProduct /> Products
      </Link>
      <Link
        to="/Store"
        className={`navbar__right-side__item
              ${
                isStoreSelected(loc.pathname) &&
                "navbar__right-side__item--selected"
              }`}
      >
      <IoStorefront />  Store
      </Link>
      
      <Link
        to="/cart"
        className={`navbar__right-side__item  navbar__right-side__item--cart-count
              ${
                isCartSelected(loc.pathname) &&
                "navbar__right-side__item--selected"
              }`}
      >
        <FaShoppingCart  />Cart
      </Link>
      {cartProducts && (
          <div className="navbar__right-side__cart-count">
            {cartProducts.length}
          </div>
           )}
      <a
        href="/#contact-form"
        className={`navbar__right-side__item ${
          isStoreSelected(loc.pathname) && "navbar__right-side__item--selected"
        }`}
      >
       <MdContactPhone />Contact Us
      </a>
      

      <button
        onClick={() => navigate("/authenticate")}
        className="navbar__right-side__btn primary"
      >
        Login
      </button>
    </div>
  );
}
export default DesktopMenu;
