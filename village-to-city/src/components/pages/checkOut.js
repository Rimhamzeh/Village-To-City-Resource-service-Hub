import { useState, useEffect } from "react";
import { database } from "../../FireBaseConf";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useMainContext } from "../../utils/context";

function Checkout() {
  const { cartProducts, setCartProducts } = useMainContext();
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    setCartProducts(guestCart);

    return () => clearTimeout(timer);
  }, [setCartProducts]);

  useEffect(() => {
    if (cartProducts.length > 0) {
      localStorage.setItem("guestCart", JSON.stringify(cartProducts));
    }
  }, [cartProducts]);

  const [buyerInfo, setBuyerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
  });

  const handleChange = (e) => {
    setBuyerInfo({ ...buyerInfo, [e.target.name]: e.target.value });
  };

  const calculateTotalPrice = () => {
    return cartProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartProducts.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      await addDoc(collection(database, "guestOrders"), {
        buyerInfo,
        cartProducts,
        paymentMethod: "Cash on Delivery",
        createdAt: Timestamp.now(),
      });

      setShowAlert(true);
      localStorage.removeItem("guestCart");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {showAlert && (
        <div
          className="toast show position-fixed bottom-0 end-0 m-3"
          role="alert"
          style={{ zIndex: 1055 }}
        >
          <div className="toast-header bg-success text-white">
            ✅ Order Success!
            <button
              type="button"
              className="btn-close btn-close-white ms-auto"
              onClick={() => setShowAlert(false)}
            ></button>
          </div>
          <div className="toast-body">
            Your order has been placed successfully! Redirecting to homepage...
          </div>
        </div>
      )}
      <h1 className="text-center mb-4">Checkout</h1>
      <div className="row g-4">
        <div className="col-md-7">
          <form onSubmit={handleSubmit} className="row g-3">
            {/* Buyer Info Fields */}
            {/* ... (keep this part as is) */}
            {/* Delivery Address, Payment Method, Place Order button */}
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={buyerInfo.firstName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={buyerInfo.lastName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={buyerInfo.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={buyerInfo.phone}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Country</label>
              <input
                type="text"
                name="country"
                value={buyerInfo.country}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                value={buyerInfo.city}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Delivery Address</label>
              <textarea
                name="address"
                value={buyerInfo.address}
                onChange={handleChange}
                className="form-control"
                rows="3"
                required
              ></textarea>
            </div>

            <div className="col-12">
              <div className="alert alert-info">
                <strong>Payment Method:</strong> Cash on Delivery
              </div>
            </div>

            <div className="col-12 text-center">
              <button type="submit" className="btn btn-primary px-5">
                Place Order
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="col-md-5">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              {cartProducts.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <>
                  {cartProducts.map((product, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center mb-3 border-bottom pb-2"
                    >
                      <img
                        src={product.productImage}
                        alt={product.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          marginRight: "10px",
                        }}
                      />
                      <div className="flex-grow-1">
                        <strong>{product.name}</strong>
                        <div className="text-muted small">
                          Qty: {product.quantity}
                        </div>
                      </div>
                      <div>
                        ${(product.price * product.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}

                  <h5 className="text-end mt-3">
                    Total: ${calculateTotalPrice().toFixed(2)}
                  </h5>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
