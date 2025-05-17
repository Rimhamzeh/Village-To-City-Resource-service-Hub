import { useState, useEffect } from "react";

import { getAllUsers } from "../../utils/productService";
import AddProducts from "./addProducts";
import {
  getAllProducts,
  getProductsByStore,
  deleteProduct,
  updateProduct,
  getCategories,
} from "../../utils/productService";
import UpdateProducts from "./updateProducts";
import { ColorRing } from "react-loader-spinner";
import { useMainContext } from "../../utils/context";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../../FireBaseConf";

function ProductTable({ userRole, sellerId }) {
  const [storeData, setStoreData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [storeSearchTerm, setStoreSearchTerm] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showUpdateProduct, setUpdateProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storeNames, setStoreNames] = useState([]);
  const { user } = useMainContext();
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    const fetchStoreDetails = async () => {
      const uniqueStoreIds = [
        ...new Set(products.map((p) => p.storeRef?.id).filter(Boolean)),
      ];

      const fetchedData = {};

      await Promise.all(
        uniqueStoreIds.map(async (storeId) => {
          const storeDoc = await getDoc(doc(database, "users", storeId));
          if (storeDoc.exists()) {
            fetchedData[storeId] = storeDoc.data();
          }
        })
      );

      setStoreData(fetchedData);
    };

    if (products.length > 0) {
      fetchStoreDetails();
    }
  }, [products]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        const stores = users.map((user) => ({
          uid: user.uid,
          storeName: user.name || "Unknown",
        }));
        setStoreNames(stores);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let data = [];

      if (userRole === "seller") {
        data = await getProductsByStore(user.uid);
      } else {
        data = await getAllProducts();
      }

      console.log("Fetched products:", data);
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user, userRole]);

  const handleSpecialToggle = async (productId, currentSpecialStatus) => {
    try {
      const updatedData = { special: !currentSpecialStatus };
      const success = await updateProduct(productId, updatedData);

      if (success) {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === productId
              ? { ...product, special: !currentSpecialStatus }
              : product
          )
        );
      }
    } catch (error) {
      console.error("Error updating product special status:", error);
      alert("Failed to update product special status");
    }
  };


  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      const success = await deleteProduct(id);
      if (success) {
        alert("Product deleted successfully!");
        fetchProducts();
      }
    } catch (error) {
      alert("Failed to delete product.");
    }
  };

  const handleAddProduct = () => setShowAddProduct(true);

  const handleUpdateProduct = (product) => {
    setSelectedProduct(product);
    setUpdateProduct(true);
  };

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearchTerm = product.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStoreName =
        userRole === "admin" && storeNames.length > 0
          ? storeNames.some(
              (store) =>
                store.uid === product.storeRef?.id &&
                (store.storeName || "")
                  .toLowerCase()
                  .includes(storeSearchTerm.toLowerCase())
            )
          : true;

      const matchesCategory = categoryFilter
        ? product.categoryRef?.id === categoryFilter
        : true;

      return matchesSearchTerm && matchesStoreName && matchesCategory;
    });

    setFilteredProducts(filtered);
  }, [
    searchTerm,
    storeSearchTerm,
    categoryFilter,
    products,
    userRole,
    storeNames,
  ]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center p-5">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={["#d6aa8d", "#e4eced", "#b8b9bb", "#abbd81", "#f4f5f7"]}
          />
          <p className="mt-3">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showAddProduct && (
        <AddProducts
          handleClose={() => setShowAddProduct(false)}
          refreshProducts={fetchProducts}
        />
      )}

      {showUpdateProduct && selectedProduct && (
        <UpdateProducts
          show={showUpdateProduct}
          productToEdit={selectedProduct}
          handleClose={() => {
            setUpdateProduct(false);
            setSelectedProduct(null);
            fetchProducts();
          }}
          refreshProducts={fetchProducts}
        />
      )}

      <div className="d-flex justify-content-between text-center mb-4">
        <h3>Products</h3>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search Product"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          {userRole === "admin" && (
            <input
              type="text"
              className="form-control"
              placeholder="Search Store Name"
              onChange={(e) => setStoreSearchTerm(e.target.value)}
            />
          )}
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <button className="btn btn-success" onClick={handleAddProduct}>
            + Add Product
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Product Name</th>
              <th>Product Description</th>
              <th>Store Name</th>
              <th>Special Products</th>
              <th>Product Image</th>
              <th>Category</th>
              <th>Price</th>
              <th>Was Price</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr key={index}>
                  <td className="centered-cell">{product.name}</td>
                  <td className="centered-cell">{product.description}</td>
                  <td className="centered-cell">
                    {storeData[product.storeRef?.id]?.storeName ||
                      "Unknown Store"}
                  </td>
                  <td className="centered-cell">
                    <div className="checkbox-wrapper-10">
                      <input
                        className="tgl tgl-flip"
                        id={`special-${index}`}
                        type="checkbox"
                        checked={product.special}
                        onChange={() =>
                          userRole === "admin" &&
                          handleSpecialToggle(product.id, product.special)
                        }
                        disabled={userRole !== "admin"}
                      />
                      <label
                        className="tgl-btn"
                        data-tg-off="Nope"
                        data-tg-on="Yeah!"
                        htmlFor={`special-${index}`}
                      ></label>
                    </div>
                  </td>

                  <td className="centered-cell">
                    <img
                      src={product?.productImage || "/image/productImage.png"}
                      alt="Product"
                      className="img-fluid"
                      style={{ maxHeight: "90px" }}
                    />
                  </td>
                  <td className="centered-cell">
                    {categories.find(
                      (cat) => cat.id === product.categoryRef?.id
                    )?.name || "Unknown Category"}
                  </td>
                  <td className="centered-cell">
                    <strong>${product.price}</strong>
                  </td>
                  <td className="centered-cell">
                    <strong>${product.wasPrice}</strong>
                  </td>

                  <td className="centered-cell">
                    <div className="checkbox-wrapper-2 d-flex justify-content-center">
                      <input
                        className="sc-gJwTLC ikxBAC"
                        type="checkbox"
                        checked={product.published}
                        readOnly
                      />
                    </div>
                  </td>
                  <td className="d-flex centered-cell">
                    <button
                      onClick={() => handleUpdateProduct(product)}
                      className="btn btn-sm btn-outline-primary me-1"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;
