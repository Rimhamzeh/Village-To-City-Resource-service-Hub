import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../utils/productService"; 
import { useMainContext } from "../../utils/context";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useMainContext();
  const [showAlert, setShowAlert] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100%",
      flexDirection: "column",
    }}>
      <div className="spinner-border" role="status" style={{ width: "3rem", height: "3rem", color: "#E3BC9A" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p style={{ marginTop: "1rem", fontSize: "1.5rem", color: "#E3BC9A" }}>Loading product details...</p>
    </div>
  );
}

  if (!product) return <p>Product not found.</p>;

  return (
    <div className="container py-5">
       {showAlert && (
        <div
          className={`alert alert-success alert-dismissible fade show custom-toast ${
            alertVisible ? "show-toast" : "hide-toast"
          }`}
          role="alert"
          style={{ position: "fixed",marginTop:50, right: 20,}}
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
      <div className="row">
        
        <div className="col-md-6 text-center">
          <img
            src={product.productImage || "/images/productImage.png"}
            alt={product.name}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
         
          <h1 className="display-4">{product.name}</h1>
          <h2 className="text-success">{formatPrice(product.price)}</h2>
          {product.wasPrice && (
            <p className="text-muted text-decoration-line-through">
              {formatPrice(product.wasPrice)}
            </p>
          )}
          <p>{product.description}</p>

          {/* Quantity controls */}
          <div className="d-flex align-items-center mb-3" style={{gap: "10px"}}>
            <button
              onClick={decrement}
              style={{
                backgroundColor: "#E3BC9A",
                color: "white",
                border: "none",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              -
            </button>
            <span style={{ minWidth: "20px", textAlign: "center" }}>{quantity}</span>
            <button
              onClick={increment}
              style={{
                backgroundColor: "#E3BC9A",
                color: "white",
                border: "none",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>

          <button onClick={handleAddToCart} className="product-card__btn" style={{ marginLeft:90,marginBottom: "150px" }}>
            🛒 Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
