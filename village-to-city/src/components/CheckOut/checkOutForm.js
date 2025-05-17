import { useMainContext } from "../../utils/context";

function CheckoutForm() {
  const { cartProducts, updateCartItemQuantity } = useMainContext();

  const calculateTotalPrice = () => {
    return cartProducts.reduce((total, product) => total + (parseFloat(product.price) * product.quantity), 0);
  };

  const handleCheckout = () => {
    window.location.href = "/checkout";
  };

  const incrementQuantity = (productId) => {
    const product = cartProducts.find(p => p.id === productId);
    if (product) {
      updateCartItemQuantity(productId, product.quantity + 1);
    }
  };

  const decrementQuantity = (productId) => {
    const product = cartProducts.find(p => p.id === productId);
    if (product && product.quantity > 1) {
      updateCartItemQuantity(productId, product.quantity - 1);
    }
  };

  return (
    <div className="cart__checkout">
      <h2 className="text-center">Order Summary</h2>

      {cartProducts.map((product, index) => (
        <div key={index} className="checkout-item" style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          
          

          <img 
            src={product.productImage} 
            alt={product.name} 
            style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }}
          />
         
          <div>{product.name}</div>
          <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
            <button 
              onClick={() => decrementQuantity(product.id)}
              style={{ padding: "2px 6px", marginRight: "5px", borderRadius: "4px", background: "#E3BC9A", border: "none", color: "#fff" }}
            >-</button>

            <div style={{ width: "20px", textAlign: "center" }}>
              {product.quantity}
            </div>

            <button 
              onClick={() => incrementQuantity(product.id)}
              style={{ padding: "2px 6px", marginLeft: "5px", borderRadius: "4px", background: "#E3BC9A", border: "none", color: "#fff" }}
            >+</button>
          </div>
        </div>
      ))}

      <h3 className="text-center">Total: ${calculateTotalPrice()}</h3>

      <button onClick={handleCheckout} className="btn btn-primary">
        Checkout
      </button>
    </div>
  );
}

export default CheckoutForm;
