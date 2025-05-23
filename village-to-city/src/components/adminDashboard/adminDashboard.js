import MenuBar from "./menuBar/menuBar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

function AdminDashboard() {
  const [isMenuOpened, setIsOpenedMenu] = useState(true);
  const toggleMenu = () => {
    setIsOpenedMenu(!isMenuOpened);
  };

  const admin = "Super Admin Dashboard";
  const role = "admin";
  return (
    <div className="container-fluid">
      <div className="row">
        <MenuBar isMenuOpened={isMenuOpened} User= {admin} role={role} />
        <main className={isMenuOpened ? "col-md-10 p-4" : "col-md-12 p-4"}>
        <button className="btn btn-secondary mb-3" onClick={toggleMenu}>
          <GiHamburgerMenu />
        </button>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default AdminDashboard;
