import { Navigate } from "react-router-dom";
import { useMainContext } from "../utils/context";
import {Oval} from "react-loader-spinner"
export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useMainContext();

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Oval
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
        <div className="text-center p-5">
          <p className="mt-3">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/authenticate"  />;
  }

  if (requiredRole) {
    const isAdmin = user.roleId?.id === "1";
    if (requiredRole === "admin" && !isAdmin) {
      return <Navigate to="/sellerDashboard"  />;
    }
    if (requiredRole === "seller" && isAdmin) {
      return <Navigate to="/adminDashboard" />;
    }
  }

  return children;
};
