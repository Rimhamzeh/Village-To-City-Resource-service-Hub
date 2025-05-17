import SignUp from "../signup-form/SignUp";
import Login from "../login-form/Login";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../utils/context";

function Authenticate() {
  const [registerMode, setRegisterMode] = useState(false);
  const { user, loading } = useContext(MainContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!loading && user) {
  //     navigate("/");
  //   }
  // }, [loading, user]);

  return registerMode ? (
    <div className="authenticate">
      <SignUp setRegisterMode={setRegisterMode} />
    </div>
  ) : (
    <div className="authenticate">
      <Login setRegisterMode={setRegisterMode} />
    </div>
  );
}
export default Authenticate;
