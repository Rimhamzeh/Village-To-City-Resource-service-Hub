import { useNavigate } from "react-router-dom";
import {
  loginUser,
  getFrontendErrorMessage,
  loginAdmin,
  login,
} from "../../firebaseFunctions";
import { isAdmin } from "../../environment/environment";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useMainContext } from "../../utils/context";
import {RotatingSquare} from"react-loader-spinner";

function Login({ setRegisterMode }) {
 
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const { user, setUser } = useMainContext();

  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      console.log("User state updated:", user);
      if (user.roleId?.id && isAdmin(user.roleId.id)) {
        navigate("/adminDashboard");
      } else {
        navigate("/sellerDashboard");
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password);
      console.log("Login response:", res);

      if (res.success) {
        setUser(res.user);
        console.log("User data:", res.user);

        // Immediate navigation attempt
        const isAdminUser = res.user?.roleId?.id && isAdmin(res.user.roleId.id);
        const path = isAdminUser ? "/adminDashboard" : "/sellerDashboard";
        console.log("Navigating to:", path);
        
        // Use replace to prevent going back to login page
        window.location.href = path;
      } else {
        setError(getFrontendErrorMessage(res.error));
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary" role="status">
            <RotatingSquare
              visible={true}
              height="100"
              width="100"
              color="#4fa94d"
              ariaLabel="rotating-square-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="container-fluid main-container">
          <div className=" d-flex justify-content-center align-items-center vh-100">
            <div className="login-container row shadow p-4 bg-white rounded">
              <div className="login__right__side col">
                <h1 className=" login__right__side__title text-center fw-bold mb-4">
                  Login Page
                </h1>
                <div className=" logo col text-center d-flex justify-content-center align-items-center">
                  <img
                    src="/images/icon.png"
                    alt="Village-to-City Resource & Service Hub"
                    className="img-fluid logo"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <br></br>
                  <input
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    id="email"
                    required
                    placeholder="Email Address"
                    className="form-control login_input "
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password:</label>
                  <br></br>
                  <div className="position-relative">
                    <input
                      value={password}
                      id="password"
                      required
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="form-control login_input"
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className="position-absolute top-50 end-0 translate-middle-y me-3"
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                  </div>
                </div>
                {error && (
                  <div className="form__group">
                    <div className="error form-text" style={{ color: "red" }}>
                      {" "}
                      {error}
                    </div>
                  </div>
                )}

                <div className="d-grid col-6 btn-login">
                  <button type="submit" className=" btn btn-primary ">
                    Login
                  </button>
                </div>
                <div className="mt-3">
                  <p className="text-center " style={{ color: "black" }}>
                    Don't have an account?{" "}
                    <b
                      onClick={() => setRegisterMode(true)}
                      className="authenticate__anchor"
                      style={{ cursor: "pointer" }}
                    >
                      Register
                    </b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;
