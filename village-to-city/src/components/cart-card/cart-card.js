import { AiFillDelete } from "react-icons/ai";
import { useContext, useState } from "react";
import { MainContext } from "../../utils/context";


function CartCard({ product }) {
  const { name, description, price, productImage } = product;
  const { removeFromCart } = useContext(MainContext);

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
  };

  return (
    <div className="cart-card">
      <img
        src={product.productImage || "/images/productImage.png"}
        alt={name}
        className="cart-card__image"
      />

      <span className="cart-card__title">{name}</span>

      <span className="cart-card__description">{description}</span>
      <span>$ {price}</span>
      <AiFillDelete className="cart-card__icon" onClick={handleRemoveFromCart} />
    </div>
  );
}

export default CartCard;
