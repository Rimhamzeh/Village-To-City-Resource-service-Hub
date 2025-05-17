import MenuBar from "../adminDashboard/menuBar/menuBar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useMainContext } from "../../utils/context";
import { Hearts } from "react-loader-spinner";

function SellerDashboard() {
  const [isMenuOpened, setIsOpenedMenu] = useState(true);
  const { user, loading } = useMainContext();
  const seller = "Seller Dashboard";
  const role = "seller";

  if (loading) {
    return (
      <div className="text-center p-5">
        <Hearts
          height="80"
          width="80"
          color="#d6aa8d"
          ariaLabel="hearts-loading"
          wrapperStyle={{}}
          visible={true}
        />
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return <div>Please log in to access the dashboard</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <MenuBar isMenuOpened={isMenuOpened} User={seller} role={role} userId={user.uid}  />
        <main className={isMenuOpened ? "col-md-10 p-4" : "col-md-12 p-4"}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SellerDashboard;