import { useState, useEffect } from "react";
import { GiVillage } from "react-icons/gi";
import { FaCity } from "react-icons/fa6";
import Footer from "../footer/footer";
import StoreCard from "../storeCard/storeCard";
import { getAllUsers } from "../../utils/productService";
function Store() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [storeType, setStoreType] = useState(null);
  const [stores, setStores] = useState([]);

  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storeData = await getAllUsers();
        console.log("Fetched stores in component:", storeData);
        setStores(storeData);
      } catch (error) {
        console.error("Failed to fetch stores", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = stores.filter((store) => {
    if (storeType === "village")
      return store.storeTypeSelected === "Village Store";
    if (storeType === "city") return store.storeTypeSelected === "City Store";
    return true;
  });

  const handleStoreSelection = (type) => {
    setStoreType(type);
  };

  return (
    <div>
      <div
        className="container-fluid bg-light py-5"
        style={{ borderRadius: "10px" }}
      >
        <div className="row align-items-center justify-content-between px-4">
          <div className="col-md-4">
            <h2 className="fw-bold text-dark Store__Title">Stores</h2>
          </div>

          <div className="col-md-2 position-relative">
            <button
              className="btn btn-secondary dropdown-toggle w-100"
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Choose Store
            </button>

            {dropdownOpen && (
              <ul
                className="dropdown-menu show w-100 bg-white border shadow"
                style={{ position: "absolute", zIndex: 10 }}
              >
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center text-dark py-2"
                    style={{ backgroundColor: "white" }}
                    onClick={() => {
                      handleStoreSelection("village");
                      setDropdownOpen(false);
                    }}
                  >
                    <GiVillage className="me-2 text-success" />
                    Village Store
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center text-dark py-2"
                    style={{ backgroundColor: "white" }}
                    onClick={() => {
                      handleStoreSelection("city");
                      setDropdownOpen(false);
                    }}
                  >
                    <FaCity className="me-2 text-primary" />
                    City Store
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center text-dark py-2"
                    style={{ backgroundColor: "white" }}
                    onClick={() => {
                      handleStoreSelection(null);
                      setDropdownOpen(false);
                    }}
                  >
                    <span className="me-2 text-secondary">&#9679;</span>
                    Show All
                  </button>
                </li>
              </ul>
            )}
          </div>

          <div className="col-md-4 text-end">
            <img
              src="/images/StoreImage.png"
              alt="Stores Banner"
              className="img-fluid"
              style={{ maxHeight: "90px" }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "300px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-5 justify-content-center mt-5">
          {filteredStores.map((store) => (
            <StoreCard key={store.id} Store={store} />
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Store;
