import { useMainContext } from "../../utils/context";
import CartCard from "../cart-card/cart-card";
import CheckoutForm from "../CheckOut/checkOutForm";
import { useEffect } from "react";
function Cart() {
  const { cartProducts, setCartProducts } = useMainContext(); 


useEffect(() => {
  const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
  console.log("Cart from LocalStorage:", guestCart);
  setCartProducts(guestCart); 
}, [setCartProducts]);


useEffect(() => {
  if (cartProducts.length > 0) {
    console.log("Saving cart to LocalStorage:", cartProducts);  
    localStorage.setItem("guestCart", JSON.stringify(cartProducts));  
  }
}, [cartProducts]);
useEffect(() => {
  console.log("Cart Products updated:", cartProducts);
}, [cartProducts]);
  return (
    <div className="cart">
      <div className="cart__products">
        <h1 className="text-center">Shopping Cart</h1>
        {cartProducts.length === 0 ? (
          <div className="cart__message cart__message--empty-cart">
            Please add products to your cart
          </div>
        ) : (
          cartProducts.map((product, index) => {
            return <CartCard key={index} product={product} />;
          })
        )}
      </div>

      <div>
        <CheckoutForm /> 
      </div>
    </div>
  );
}

export default Cart;
