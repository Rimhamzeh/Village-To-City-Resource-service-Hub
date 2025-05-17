import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateUserProfile, getUserById } from "../../utils/productService";
import { IoCloseSharp } from "react-icons/io5";

function EditSellerProfile({ refreshUsers }) {
  const { userId } = useParams();
  const navigate = useNavigate();

 
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    storeName: "",
    storePicture: "",
    storeTypeSelected: "",
    storeSince: "",
    description: "",
  });


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(userId);
        if (data) {
          setInputs({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            storeName: data.storeName || "",
            storePicture: data.storePicture || "",
            storeTypeSelected: data.storeTypeSelected || "",
            storeSince: data.storeSince || "",
            description: data.description || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setInputs((prev) => ({ ...prev, storePicture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

 
  const handleClose = () => {
    navigate(-1);
  };

  
 const handleSubmit = async () => {
  if (!inputs.firstName || !inputs.lastName || !inputs.email || !inputs.storeName) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    const updatedData = {
      ...inputs,
      storeTypeSelected: inputs.storeTypeSelected, 
    };
    delete updatedData.storeTypeSelected;  

    await updateUserProfile(userId, updatedData);
    alert("User profile updated successfully!");
    if (refreshUsers) refreshUsers();
    handleClose();
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile.");
  }
};

  return (
    <div className="p-4 bg-white border rounded shadow mt-4">
      <div className="d-flex justify-content-between mb-4">
        <div>
          <h4 className="mb-3">Edit Seller Profile</h4>
          <p className="text-muted">Update seller details here</p>
        </div>
        <button className="btn btn-primary" onClick={handleClose}>
          <IoCloseSharp />
        </button>
      </div>

      {/* Input Fields */}
      {[
        { label: "First Name", name: "firstName", type: "text" },
        { label: "Last Name", name: "lastName", type: "text" },
        { label: "Phone Number", name: "phoneNumber", type: "text" },
        { label: "Email", name: "email", type: "email" },
        { label: "Store Name", name: "storeName", type: "text" },
        { label: "Store Since", name: "storeSince", type: "text" },
      ].map(({ label, name, type }) => (
        <div className="mb-3" key={name}>
          <label className="form-label">{label}</label>
          <input
            name={name}
            type={type}
            className="form-control"
            value={inputs[name]}
            onChange={handleInputChange}
          />
        </div>
      ))}

      {/* Store Picture */}
      <div className="mb-3">
        <label className="form-label">Store Picture</label>
        <input type="file" className="form-control" onChange={handleImageChange} />
        {inputs.storePicture && (
          <div className="mt-2">
            <img
              src={inputs.storePicture}
              alt="Store"
              style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }}
            />
          </div>
        )}
      </div>

      {/* Store Type */}
      <div className="mb-3">
        <label className="form-label">Store Type</label>
        <select
          name="storeTypeSelected"
          className="form-select"
          value={inputs.storeTypeSelected}
          onChange={handleInputChange}
        >
          <option value="">Select Store Type</option>
          <option value="Village Store">Village Store</option>
          <option value="City Store">City Store</option>
        </select>
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="form-label">Store Description</label>
        <textarea
          name="description"
          className="form-control"
          rows={4}
          value={inputs.description}
          onChange={handleInputChange}
        />
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary me-2" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Update Profile
        </button>
      </div>
    </div>
  );
}

export default EditSellerProfile;
