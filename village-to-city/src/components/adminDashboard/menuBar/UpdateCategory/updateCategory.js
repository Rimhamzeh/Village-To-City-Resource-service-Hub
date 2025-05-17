import { useState, useEffect } from "react";
import { updateCategory } from "../../../../utils/productService";
import { IoCloseSharp } from "react-icons/io5";

function UpdateCategory({ category, handleClose, refreshCategories }) {
  const [inputs, setInputs] = useState({
    name: category.name || "",
    description: category.description || "",
    categoryImage: category.categoryImage || "",
    published: category.published || false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setInputs((prev) => ({ ...prev, categoryImage: reader.result }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!inputs.name || !inputs.description) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await updateCategory(category.id, inputs); 
      alert("Category updated!");
      refreshCategories(); 
      handleClose(); 
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category.");
    }
  };

  return (
    <div className="p-4 bg-white border rounded shadow mt-4">
      <div className="d-flex justify-content-between mb-4">
        <div>
          <h4 className="mb-3">Edit Category</h4>
          <p className="text-muted">Update category details from here</p>
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
        <label className="form-label">Category Icon (Image)</label>
        <input
          type="file"
          className="form-control"
          onChange={handleImageChange}
        />
        {inputs.categoryImage && (
          <div className="mt-2">
            <img
              src={inputs.categoryImage}
              alt="Category Icon"
              style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
        )}
      </div>

      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="published"
          checked={inputs.published}
          onChange={() => setInputs((prev) => ({ ...prev, published: !prev.published }))}
        />
        <label className="form-check-label" htmlFor="published">
          Mark as Published
        </label>
      </div>

      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary me-2" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Update Category
        </button>
      </div>
    </div>
  );
}

export default UpdateCategory;
