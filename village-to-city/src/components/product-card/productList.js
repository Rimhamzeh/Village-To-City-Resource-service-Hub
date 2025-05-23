import { useState, useEffect } from "react";
import { getAllProducts } from "../../utils/productService";
import ProductCard from "./product-card";
function ProductsList({ products }) {
  if (!products || products.length === 0) {
    return <div>No Products Found</div>;
  }

  return (
    <div className="products-grid">
      {products.map(
        (product) =>
          product.published && (
            <ProductCard
              key={product.id}
              product={product}
              showActions={true}
              showStoreButton={false}
            />
          )
      )}
    </div>
  );
}

export default ProductsList;
