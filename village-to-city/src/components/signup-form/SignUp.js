import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../../firebaseFunctions';
function SignUp({setRegisterMode }) {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    storeName: '',
    storeTypeSelected: '',
    storeSince:'',
    description:'',
    location: '',
    password: '',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };
  async function handleUploadAndSubmit() {
    if (!image) {
      return alert('Please select an image');
    }
  
    
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
  
    try {
      const base64Image = await toBase64(image);
  
      
      if (inputs.password.length < 8 || inputs.password.length > 20) {
        setError('Password must be 8–20 characters long.');
        return;
      }
      if (!inputs.storeTypeSelected) {
        setError('Please select a store type.');
        return;
      }
  
     
      const result = await registerUser(
        inputs.firstName,
        inputs.lastName,
        inputs.phoneNumber,
        inputs.email,
        inputs.storeName,
        base64Image, 
        inputs.storeTypeSelected,
        inputs.storeSince,
        inputs.description,
        inputs.location,
        inputs.password
      );
      if (result.success) {
        alert('Registration successful! Please login.');
        setRegisterMode(false);  
      } else {
        setError(result.error || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong during registration.');
    }
  }
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  return (
    <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
      <div className="container-fluid main-container">
        <div className="d-flex justify-content-center align-items-center">
          <div className="col-md-6 shadow p-5 bg-white rounded">
            <h1 className="text-center fw-bold mb-4">Sign Up</h1>
            <div className="text-center mb-4">
              <img
                src="/images/icon.png"
                alt="Village-to-City Logo"
                className="img-fluid"
                style={{ maxWidth: '120px' }}
              />
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  onChange={handleInputChange}
                  value={inputs.firstName}
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  onChange={handleInputChange}
                  value={inputs.lastName}
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  onChange={handleInputChange}
                  value={inputs.phoneNumber}
                  className="form-control"
                  id="phone"
                  name="phoneNumber"
                  placeholder="Phone Number"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  onChange={handleInputChange}
                  value={inputs.email}
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Email Address"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="storeName" className="form-label">
                  Store Name
                </label>
                <input
                  type="text"
                  onChange={handleInputChange}
                  value={inputs.storeName}
                  className="form-control"
                  id="storeName"
                  name="storeName"
                  placeholder="Store Name"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="storePicture" className="form-label">
                  Store Picture
                </label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImage}
                  id="storePicture"
                  name="storePicture"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="storeType" className="form-label">
                  Select Store Type
                </label>
                <select
                  id="storeTypeSelected"
                  name="storeTypeSelected"
                  className="form-select"
                  value={inputs.storeTypeSelected}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Choose Store</option>
                  <option value="Village Store">Village Store</option>
                  <option value="City Store">City Store</option>
                </select>
              </div>
              <div >
              <label htmlFor="storeSince" className="form-label">
                  Store Since
                </label>
                <input
                  type="text"
                  onChange={handleInputChange}
                  value={inputs.storeSince}
                  className="form-control"
                  id="storeSince"
                  name="storeSince"
                  placeholder="Store storeSince"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="storeType" className="form-label">
                  Store Description
                </label>
               <textarea
                name="description"
                className="form-control"
                rows="4"
                value={inputs.description}
                onChange={handleInputChange}
               >

               </textarea>

              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <input
                  type="text"
                  onChange={handleInputChange}
                  value={inputs.location}
                  className="form-control"
                  id="location"
                  name="location"
                  placeholder="Location"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleInputChange}
                    value={inputs.password}
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Password"
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="position-absolute top-50 end-0 translate-middle-y me-3"
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>
                {error && <div className="form-text" style={{ color: 'red' }}>{error}</div>}
              </div>
            </div>

            <div className="text-center mt-4">
              <button type="button" onClick={handleUploadAndSubmit} className="btn btn-primary w-100">
                Sign Up
              </button>
            </div>

            <p className="text-center" style={{ color: 'black' }}>
              Already have an account?{' '}
              <b onClick={() => setRegisterMode(false)} className="authenticate__anchor" style={{ cursor: 'pointer' }}>
                Login
              </b>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

export default SignUp;
