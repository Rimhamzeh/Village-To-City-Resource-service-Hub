import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../../utils/context";

function ProductCard({ product, showActions, showStoreButton }) {
  const StoreId = product.storeId || product.storeRef?.id || "";
  const { id, storeId, name, description, wasPrice, price, productImage } =
    product;
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addToCart } = useMainContext();
  const [showAlert, setShowAlert] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const formatPrice = (value) => {
    if (typeof value === "number") {
      return `$${value.toFixed(2)}`;
    }
    if (typeof value === "string") {
      const number = parseFloat(value.replace(/[^0-9.-]+/g, ""));
      return !isNaN(number) ? `$${number.toFixed(2)}` : "";
    }
    return "";
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowAlert(true);
    setTimeout(() => setAlertVisible(true), 50);

    setTimeout(() => setAlertVisible(false), 3000);
    setTimeout(() => setShowAlert(false), 3500);
  };

  const goToProductDetails = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate(`/productDetails/${id}`);
    }, 400);
  };

  const goToStore = () => {
    navigate(`/StoreVisit/${StoreId}`);
  };

  return (
    <div className="product-card">
      {showAlert && (
        <div
          className={`alert alert-success alert-dismissible fade show custom-toast ${
            alertVisible ? "show-toast" : "hide-toast"
          }`}
          role="alert"
        >
          ✅ Product added to cart successfully!
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setAlertVisible(false);
              setTimeout(() => setShowAlert(false), 500);
            }}
          ></button>
        </div>
      )}
      <div className="product-card__content">
        <div className="product-card__content__images-container">
          <img
            src={productImage || "/images/productImage.png"}
            alt={name}
            className={`product-card__content__image ${
              isAnimating ? "image-clicked" : ""
            }`}
            onClick={goToProductDetails}
            style={{ cursor: "pointer" }}
          />
        </div>
        <span className="product-card__content__title">{name}</span>
        <div className="product-card__content__price">
          {formatPrice(price)}
          {wasPrice && (
            <span className="product-card__content__price__slash">
              {formatPrice(wasPrice)}
            </span>
          )}
        </div>
        {showStoreButton && (
          <button
            onClick={goToStore}
            className="Special__product-card__btn"
            style={{ marginTop: "30px", backgroundColor: "#E3BC9A" }}
          >
            🏪 Go to Store
          </button>
        )}
        {showActions && (
          <>
            <div className="d-flex justify-content-center align-items-center mb-3">
              <button
                className="quantity"
                onClick={decrement}
                style={{
                  backgroundColor: "#E3BC9A",
                  color: "white",
                  border: "none",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                }}
              >
                -
              </button>
              <span className="mx-2">{quantity}</span>
              <button
                className="quantity"
                onClick={increment}
                style={{
                  backgroundColor: "#E3BC9A",
                  color: "white",
                  border: "none",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                }}
              >
                +
              </button>
            </div>
            
            <button onClick={handleAddToCart} className="product-card__btn">
              🛒 Add To Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
