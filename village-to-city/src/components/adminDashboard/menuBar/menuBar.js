import { GrUserAdmin } from "react-icons/gr";
import { AiFillProduct } from "react-icons/ai";
import { MdCategory } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import { LiaJediOrder } from "react-icons/lia";
import { FaStore } from "react-icons/fa";
import { logoutUser } from "../../../firebaseFunctions";
import { BiSolidMessageAltDetail } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";

function MenuBar({ isMenuOpened, User, role ,userId }) {
  const navigate = useNavigate();

  const logOut = async () => {
    await logoutUser();
    navigate("/authenticate");
  };
  return (
    <nav
      className={`bg-light d-flex flex-column p-3 ${
        isMenuOpened ? "col-md-2" : "d-none"
      }`}
      style={{ minHeight: "100vh" }}
    >
      <h4 className="text-center mt-3">
        <GrUserAdmin />
        {User}
      </h4>
      <ul className="nav flex-column mt-5">
        {role === "admin" && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/adminDashboard/MenuProducts">
                <AiFillProduct /> Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/adminDashboard/menuCategories">
                <MdCategory /> Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/adminDashboard/menuBuyers">
                <BsFillPersonFill /> Sellers
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/adminDashboard/menuOrders">
                <LiaJediOrder /> Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/adminDashboard/menuSellerRequest">
                <BiSolidMessageAltDetail />
                Buyers Requests
              </Link>
            </li>
            <li className="nav-item">
          <Link className="nav-link" to="/">
            <FaStore /> View Online Store
          </Link>
        </li>
          </>
        )}

        {role === "seller" && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/sellerDashboard/manageProducts">
                <AiFillProduct /> My Products
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to={`/sellerDashboard/sellerMenuOrders/${userId}`}>
                <LiaJediOrder /> Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={`/sellerDashboard/editProfile/${userId}`}>
                <CgProfile /> Edit Profile
              </Link>
            </li>
            <li className="nav-item">
          <Link className="nav-link" to={`/StoreVisit/${userId}`}>
            <FaStore /> View Online Store
          </Link>
        </li>
          </>
        )}

        

        <li className="nav-item mt-5">
          <button className="btn btn-primary w-100" onClick={logOut}>
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  );
}
export default MenuBar;
