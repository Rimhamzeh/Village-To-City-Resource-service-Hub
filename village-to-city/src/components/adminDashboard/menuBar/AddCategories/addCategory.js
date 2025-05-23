import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { createCategory } from "../../../../utils/productService";

function AddCategory({ handleClose, refreshCategories }) {
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
  });
  const [image, setImage] = useState(null);

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

  const handleAddCategory = async () => {
    if (!inputs.name || !inputs.description|| !image) {
      toast.warn("Please fill in all fields.");
      return;
    }

    try {
      const categoryData = {
        ...inputs,
      };

      if (image) {
        const base64Image = await toBase64(image);
        categoryData.categoryImage = base64Image;
      }

      await createCategory(categoryData);

      toast.success("Category added successfully!");
      refreshCategories();
      handleClose();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category.");
    }
  };

  return (
    <div className="p-4 bg-white border rounded shadow mt-4">
      <div className="d-flex justify-content-between mb-4">
        <div>
          <h4 className="mb-3">Add Category</h4>
          <p className="text-muted">
            Add your category name, description, and image here
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleClose}>
          <IoCloseSharp />
        </button>
      </div>

      <div className="mb-3">
        <label className="form-label">Category Name</label>
        <input
          name="name"
          type="text"
          className="form-control"
          value={inputs.name}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Category Description</label>
        <textarea
          name="description"
          className="form-control"
          rows="4"
          value={inputs.description}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Category Image</label>
        <input type="file" className="form-control" onChange={handleImage} />
      </div>

      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary me-2" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleAddCategory}>
          Add Category
        </button>
      </div>
    </div>
  );
}

export default AddCategory;
