import {Link, useLocation,useNavigate } from "react-router-dom";
import { isCartSelected,isStoreSelected } from "../../../utils/checkRoutes";
import { IoStorefrontOutline } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { AiFillProduct } from "react-icons/ai";
function MobileMenu({ closeFn }) {
  const loc = useLocation();
  const navigate = useNavigate();
  return (
    <div className="mobile-menu">
      <div className="mobile-menu__content">
      <Link
    to="/"
    className={`mobile-menu__content__item
      ${
        isStoreSelected(loc.pathname) &&
        "mobile-menu__content__item--selected"
      }`}>
       <FaHome/> Home
    </Link>
    <Link
        to="/product"
        className={`mobile-menu__content__item
              ${
                isStoreSelected(loc.pathname) &&
                "navbar__right-side__item--selected"
              }`}
      >
        <AiFillProduct /> Products
      </Link>
      <Link
        to="/product"
        className={`mobile-menu__content__item
              ${
                isStoreSelected(loc.pathname) &&
                "navbar__right-side__item--selected"
              }`}
      >

      </Link>
        <Link
          onClick={closeFn}
          to="/Store"
          className={`mobile-menu__content__item
              ${
                isStoreSelected(loc.pathname) &&
                "mobile-menu__content__item--selected"
              }`}
        >
        <IoStorefrontOutline/>  Store
        </Link>
        <Link
          onClick={closeFn}
          to="/cart"
          className={`mobile-menu__content__item
              ${
                isCartSelected(loc.pathname) &&
                "mobile-menu__content__item--selected"
              }`}
        >
         <BsCart3/> Cart
        </Link>
        <button onClick={() => navigate("/authenticate")}
        className="navbar__right-side__btn primary" >Login</button>
      </div>
    </div>
  );
}
export default MobileMenu;
