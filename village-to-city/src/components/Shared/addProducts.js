import { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { createProduct } from "../../utils/productService";
import { getAllUsers } from "../../utils/productService";
import { isAdmin } from "../../environment/environment.js";
import { useMainContext } from "../../utils/context";
import { doc } from "firebase/firestore";
import { ColorRing } from "react-loader-spinner";
import { database } from "../../FireBaseConf.js";
import { getCategories } from "../../utils/productService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
function AddProducts({ handleClose, refreshProducts }) {
  const { user } = useMainContext();
  const isAdminUser = isAdmin(user.roleId.id);
  const [storeNames, setStoreNames] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [special, setSpecial] = useState(false);
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    price: Number,
    wasPrice: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        const stores = users.map((user) => ({
          uid: user.uid,
          storeName: user.name || "Unknown",
        }));

        setStoreNames(stores);
        console.log(storeNames);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleAddProduct = async () => {
    let storeReference;

    if (isAdminUser) {
      storeReference = doc(database, "users", selectedStore);
    } else {
      storeReference = doc(database, "users", user.uid);
    }

    if (!selectedCategoryId) {
      Swal.fire({
        icon: "warning",
        title: "Missing Category",
        text: "Please select a category.",
      });
      return;
    }

    const categoryRef = doc(database, "categories", selectedCategoryId);

    const priceNum = parseFloat(inputs.price);
    const wasPriceNum = parseFloat(inputs.wasPrice);

    if (
      !inputs.name ||
      !inputs.description ||
      isNaN(priceNum) ||
      isNaN(wasPriceNum)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Input",
        text: "Please fill in all fields with valid numbers for price and wasPrice.",
      });
      return;
    }

    try {
      let productData = {
        ...inputs,
        special,
        price: priceNum,
        wasPrice: wasPriceNum,
        storeRef: storeReference,
        categoryRef: categoryRef,
      };

      if (image) {
        const base64Image = await toBase64(image);
        productData.productImage = base64Image;
      }

      await createProduct(productData);

      toast.success("Product added successfully!");

      refreshProducts();
      handleClose();
      <ColorRing />;
      refreshProducts();
      handleClose();
    } catch (error) {
      if (error.message === "DUPLICATE_PRODUCT") {
        Swal.fire({
          icon: "error",
          title: "Duplicate Product",
          text: "A product with this name already exists in your store.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Add Product",
          text: "An error occurred while adding the product.",
        });
      }
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  return (
    <div className="p-4 bg-white border rounded shadow mt-4">
      <div className="d-flex justify-content-between mb-4">
        <div>
          <h4 className="mb-3">Add Product</h4>
          <p className="text-muted">
            Add your product and necessary information here
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleClose}>
          <IoCloseSharp />
        </button>
      </div>

      {isAdminUser && (
        <div>
          <div className="mb-3">
            <label className="form-label">Select Store</label>
            <select
              className="form-control"
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
            >
              <option value="">Select a store</option>
              {storeNames.map((store) => (
                <option key={store.uid} value={store.uid}>
                  {store.storeName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="specialProduct"
              checked={special}
              onChange={(e) => setSpecial(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="specialProduct">
              Mark as Special Product
            </label>
          </div>
        </div>
      )}
      <div className="mb-3">
        <label className="form-label">Select Category</label>
        <select
          className="form-control"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Product Name</label>
        <input
          name="name"
          type="text"
          className="form-control"
          value={inputs.name}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Product Description</label>
        <textarea
          name="description"
          className="form-control"
          rows="4"
          value={inputs.description}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Product Price</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            value={inputs.price}
            onChange={handleInputChange}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Product WasPrice</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input
            name="wasPrice"
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            value={inputs.wasPrice}
            onChange={handleInputChange}
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Product Image</label>
        <input type="file" className="form-control" onChange={handleImage} />
      </div>

      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary me-2" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleAddProduct}>
          Add Product
        </button>
      </div>
    </div>
  );
}

export default AddProducts;
