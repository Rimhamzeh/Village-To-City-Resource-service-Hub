import { useEffect, useState } from "react";
import AddCategory from "./AddCategories/addCategory";
import { getCategories, deleteCategory, updateCategory } from "../../../utils/productService";
import UpdateCategory from "./UpdateCategory/updateCategory"; // Ensure this is imported

function MenuCategories() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleEdit = (category) => {
    setEditingCategory(category); 
    setShowEditModal(true);
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
      fetchCategories();
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {showAddModal && (
        <AddCategory
          category={editingCategory} 
          handleClose={() => setShowAddModal(false)}
          refreshCategories={fetchCategories}
        />
      )}
      
      {showEditModal && (
        <UpdateCategory
          category={editingCategory} 
          handleClose={() => setShowEditModal(false)}
          refreshCategories={fetchCategories}
        />
      )}

      <div className="d-flex justify-content-between text-center mb-4">
        <h3>Categories</h3>
        <div>
          <button
            className="btn btn-success"
            onClick={() => setShowAddModal(true)}
          >
            + Add Category
          </button>
        </div>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search By Category name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Id</th>
              <th>Icon</th>
              <th>Name</th>
              <th>Description</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat) => (
              <tr key={cat.id}>
                <td className="centered-cell">{cat.id}</td>
                <td className="centered-cell">
                  {cat.categoryImage && (
                    <img
                      src={cat.categoryImage}
                      alt={cat.name}
                      style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  )}
                </td>
                <td className="centered-cell">
                  <strong>{cat.name}</strong>
                </td>
                <td className="centered-cell">{cat.description}</td>
                <td className="centered-cell">
                  <div className="checkbox-wrapper-2 d-flex justify-content-center">
                    <input
                      type="checkbox"
                      className="sc-gJwTLC ikxBAC"
                      checked={cat.published || false}
                      readOnly
                    />
                  </div>
                </td>
                <td className="d-flex centered-cell">
                  <div className="tooltip-wrapper">
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => handleEdit(cat)} 
                    >
                      ✏️
                    </button>
                    <span className="tooltip-text">Edit</span>
                  </div>
                  <div className="tooltip-wrapper">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(cat.id)}
                    >
                      🗑️
                    </button>
                    <span
                      className="tooltip-text"
                      style={{ backgroundColor: "red" }}
                    >
                      Delete
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MenuCategories;
