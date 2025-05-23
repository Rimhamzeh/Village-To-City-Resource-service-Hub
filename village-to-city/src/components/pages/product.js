import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import Footer from "../footer/footer";
import ProductsList from "../product-card/productList";
import { RotatingLines } from "react-loader-spinner";
import { getCategories, getAllProducts } from "../../utils/productService"; 
import { database } from "../../FireBaseConf";
import { doc, getDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";

function ProductPage() {

  const [villageChecked, setVillageChecked] = useState(false);
  const [cityChecked, setCityChecked] = useState(false);
  const [showAllChecked, setShowAllChecked] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]); 

 
  const publishedCategories = categories.filter(cat => cat.published);

  const publishedCategoryIds = new Set(publishedCategories.map(cat => cat.id));

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      setShowAllChecked(true);  
      setCityChecked(false);
      setVillageChecked(false);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
  
      const updatedProducts = await Promise.all(
        data.map(async (product) => {
          if (product.storeRef?.id) {
            try {
              const storeDoc = await getDoc(doc(database, "users", product.storeRef.id));
              if (storeDoc.exists()) {
                const storeData = storeDoc.data();
                return {
                  ...product,
                  storeTypeSelected: storeData.storeTypeSelected || "Unknown",
                };
              }
            } catch (error) {
              console.error("Error fetching store data:", error);
            }
          }
          return {
            ...product,
            storeTypeSelected: "Unknown",
          };
        })
      );
  
      
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    };
  
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      console.log(data);
      setCategories(data); 
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [
    searchTerm,
    villageChecked,
    cityChecked,
    selectedCategory,
    showAllChecked,
   
  ]);

  const filterProducts = () => {
    const filtered = products.filter((product) => {
      

      const matchesSearchTerm = product.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const storeType = product.storeTypeSelected || "Unknown"; 

      const matchesVillage = storeType === "Village Store";
      const matchesCity = storeType === "City Store";

      
      if (product.categoryRef?.id && !publishedCategoryIds.has(product.categoryRef.id)) {
        return false;
      }

      const matchesCategory = selectedCategory
        ? product.categoryRef?.id === selectedCategory
        : true;

      const villageCityCondition =
        showAllChecked || 
        (villageChecked && matchesVillage) || 
        (cityChecked && matchesCity); 

      return matchesSearchTerm && villageCityCondition && matchesCategory;
    });

    setFilteredProducts(filtered);
  };

  const handleVillageChange = () => {
    setVillageChecked((prev) => {
      const newState = !prev;
      if (newState){
        setShowAllChecked(false);
        setCityChecked(false);
      } 
      return newState;
    });
  };

  const handleCityChange = () => {
    setCityChecked((prev) => {
      const newState = !prev;
      if (newState){
        setVillageChecked(false);
        setShowAllChecked(false);
      }
      return newState;
    });
  };

  const handleShowAllChange = () => {
    setShowAllChecked((prev) => {
      const newState = !prev;
      if (newState) {
        setVillageChecked(false);
        setCityChecked(false);
      }
      return newState;
    });
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory((prev) => (prev === categoryId ? "" : categoryId));
  };

  if (products.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="#d6aa8d"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="bg-white p-3 shadow-sm rounded">
            <h5 className="fw-bold mb-2">Products</h5>
            <div
              className="mb-3"
              style={{
                width: "60px",
                height: "4px",
                backgroundColor: "#9ee7c5",
              }}
            ></div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="villageCheck"
                checked={villageChecked}
                onChange={handleVillageChange}
              />
              <label className="form-check-label" htmlFor="villageCheck">
                Village Product
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="cityCheck"
                checked={cityChecked}
                onChange={handleCityChange}
              />
              <label className="form-check-label" htmlFor="cityCheck">
                City Product
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="showAllCheck"
                checked={showAllChecked}
                onChange={handleShowAllChange}
              />
              <label className="form-check-label" htmlFor="showAllCheck">
                Show All Products
              </label>
            </div>
          </div>

          <div className="bg-white p-3 shadow-sm rounded mt-3">
            <h5 className="fw-bold mb-2">Category</h5>
            <div
              className="mb-3"
              style={{
                width: "60px",
                height: "4px",
                backgroundColor: "#9ee7c5",
              }}
            ></div>

            <ul className="list-unstyled">
              {publishedCategories.map((cat) => (
                <li
                  key={cat.id} 
                  className={`categoryProducts   d-flex align-items-center p-2 mb-2 border rounded ${
                    selectedCategory === cat.id ? "bg-dark text-white" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <span style={{ fontSize: "1.5rem", marginRight: "10px" }}>
                    <img
                      src={cat?.categoryImage} 
                      alt="Category"
                      className="img-fluid"
                      style={{ maxHeight: "20px" }}
                    />
                  </span>
                  <span>{cat.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col product">
          <div className="container mb-4">
            <div className="text-center">
              <div className="search-input-wrapper">
                <CiSearch className="search-icon" />
                <input
                  type="text"
                  className="form-control search-input text-center"
                  placeholder="Search for a product"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "300px", margin: "0 auto" }}
                />
              </div>
            </div>
          </div>

          <ProductsList products={filteredProducts} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductPage;
