import { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { updateProduct } from "../../utils/productService";
import { getFirestore, doc, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { isAdmin } from "../../environment/environment";
import { useMainContext } from "../../utils/context";
import { getCategories } from "../../utils/productService";
import { database } from "../../FireBaseConf";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function UpdateProducts({ handleClose, productToEdit }) {
  const db = getFirestore();
  const auth = getAuth();
  const { user } = useMainContext();
  const currentUser = auth.currentUser;
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [storeNames, setStoreNames] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [image, setImage] = useState(null);
  const [special, setSpecial] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    price: "",
    wasPrice: "",
  });

  const isAdminUser = user?.roleId?.id ? isAdmin(user.roleId.id) : false;

  const storeCollection = collection(db, "users");

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(storeCollection);
        const stores = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            storeName: data.storeName,
            email: data.email,
          };
        });

        setStoreNames(stores);

        if (!isAdminUser) {
          const myStore = stores.find(
            (store) => store.email === currentUser?.email
          );
          if (myStore) {
            setSelectedStore(myStore.id); 
          }
        }
      } catch (error) {
        console.error("Error fetching store names:", error);
      }
    };

    fetchData();
  }, [isAdminUser, currentUser]);

  useEffect(() => {
    if (productToEdit) {
      setInputs({
        name: productToEdit.name || "",
        description: productToEdit.description || "",
        price: productToEdit.price || "",
        wasPrice: productToEdit.wasPrice || "",
      });
      setSelectedStore(productToEdit.storeRef?.id || ""); 
      setSpecial(productToEdit.special || false);
    }
  }, [productToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSpecialChange = (e) => {
    setSpecial(e.target.checked); 
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

   const handleUploadAndUpdateProduct = async () => {
  try {
    if (!selectedCategoryId) {
      return Swal.fire({
        icon: "warning",
        title: "Category Missing",
        text: "Please select a category before updating the product.",
      });
    }

    const storeRef = doc(database, "users", selectedStore);
    const categoryRef = doc(database, "categories", selectedCategoryId);

    const updatedData = {
      ...inputs,
      price: Number(inputs.price),
      wasPrice: Number(inputs.wasPrice),
      productImage: image ? await toBase64(image) : productToEdit.productImage,
      storeRef,
      special,
      categoryRef,
    };

    await updateProduct(productToEdit.id, updatedData);

    toast.success("Product updated successfully!");

    handleClose();
  } catch (error) {
    console.error("Error updating product:", error);
    toast.error("Error updating product.");
  }
};
    

  return (
    <div className="p-4 bg-white border rounded shadow mt-4">
      <div className="d-flex justify-content-between mb-4">
        <div>
          <h4 className="mb-3">Edit Product</h4>
          <p className="text-muted">Update your product details below</p>
        </div>
        <button className="btn btn-primary" onClick={handleClose}>
          <IoCloseSharp />
        </button>
      </div>

      {isAdminUser && (
        <div className="mb-3">
          <label className="form-label">Select Store</label>
          <select
            className="form-control"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            <option value="">Select a store</option>
            {storeNames.map((store) => (
              <option key={store.id} value={store.id}>
                {store.storeName}
              </option>
            ))}
          </select>
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
          placeholder="Product Name"
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
          placeholder="Product Description"
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
            className="form-control"
            placeholder="Product Price"
            value={inputs.price}
            onChange={handleInputChange}
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
            className="form-control"
            placeholder="Product WasPrice"
            value={inputs.wasPrice}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Product Image</label>
        <input
          name="productImage"
          type="file"
          className="form-control"
          onChange={handleImage}
        />
      </div>

      {isAdminUser && (
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="specialProduct"
            checked={special}
            onChange={handleSpecialChange}
          />
          <label className="form-check-label" htmlFor="specialProduct">
            Mark as Special Product
          </label>
        </div>
      )}

      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary me-2" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleUploadAndUpdateProduct}>
          Update
        </button>
      </div>
    </div>
  );
}

export default UpdateProducts;
