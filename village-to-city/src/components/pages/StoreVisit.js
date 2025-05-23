import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../product-card/product-card";
import { getStoreById, getProductsByStore } from "../../utils/productService";

const StoreVisit = () => {
  const { index } = useParams();
  const storeId = index;

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeData = await getStoreById(storeId);
        const productsData = await getProductsByStore(storeId);

        setStore(storeData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching store or products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!store) {
    return <h2 className="text-center mt-5">Store not found</h2>;
  }

  const {
    name,
    since,
    storePicture,
    address,
    phone,
    description,
    firstName,
    storeTypeSelected,
  } = store;
  return (
    <div className="storePage">
      <div className="container">
        <h1 className="storeH1 text-center">Welcome to {name}</h1>
        <div className="store-header d-flex flex-wrap align-items-center justify-content-between">
          <div className="store-logo">
            <img
              src={store?.storePicture || "/images/StoreImage.png"}
              alt={name}
              className="img-fluid"
            />
          </div>

          <div className="store-info">
            <h2>{name}</h2>
            <p>
              <strong>Since:</strong> {since || "N/A"}
            </p>
            <h5 className="card-title">
              <u>{name}</u>
            </h5>
            <p className="mb-3">
              {description
                ? description
                    .split(". ")
                    .slice(0, 5)
                    .map((line, i) => (
                      <span key={i}>
                        {line.trim()}.
                        <br />
                      </span>
                    ))
                : "No description available."}
            </p>
          </div>
          <div className="store-contact">
            <p>
              <strong>Address:</strong> {address || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {phone || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="product container mt-4">
        {products.length > 0 ? (
          products.map((product) => (
            product.published &&(
            <ProductCard
              key={product.id}
              product={product}
              showActions={true}
              showStoreButton={false}
            />
            )
          ))
        ) : (
          <p className="text-center">No products available for this store.</p>
        )}
      </div>
    </div>
  );
};

export default StoreVisit;
