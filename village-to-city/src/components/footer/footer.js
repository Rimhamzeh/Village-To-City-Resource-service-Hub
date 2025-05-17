import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../utils/productService";

function Footer() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(); 
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const goToCategory = (categoryId) => {
    navigate(`/product?category=${categoryId}`);
  };


  const half = Math.ceil(categories.length / 2);
  const firstCol = categories.slice(0, half);
  const secondCol = categories.slice(half);
  return (
    <div className="bg-light text-dark mt-auto py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h6 className="fw-bold mb-3">Categories</h6>
            <div className="row">
              <div className="col-6">
                <ul className="list-unstyled text-muted small">
                  {firstCol.map((cat) => (
                    <li
                      key={cat.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => goToCategory(cat.id)}
                    >
                      {cat.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-6">
                <ul className="list-unstyled text-muted small">
                  {secondCol.map((cat) => (
                    <li
                      key={cat.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => goToCategory(cat.id)}
                    >
                      {cat.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          
          <div className="col-md-2">
            <h6 className="fw-bold mb-3">Get to know us</h6>
            <ul className="list-unstyled text-muted small">
              <li>Company</li>
              <li>About</li>
              <li>Blog</li>
              <li>Help Center</li>
              <li>Our Value</li>
            </ul>
          </div>

          <div className="col-md-2">
            <h6 className="fw-bold mb-3">For Consumers</h6>
            <ul className="list-unstyled text-muted small">
              <li>Payments</li>
              <li>Shipping</li>
              <li>Product Returns</li>
              <li>FAQ</li>
              <li>Shop Checkout</li>
            </ul>
          </div>

       
          <div className="col-md-2">
            <h6 className="fw-bold mb-3">Become a Shopper</h6>
            <ul className="list-unstyled text-muted small">
              <li>Shopper Opportunities</li>
              <li>Become a Shopper</li>
              <li>Earnings</li>
              <li>Ideas & Guides</li>
              <li>New Retailers</li>
            </ul>
          </div>

          
          <div className="col-md-2">
            <h6 className="fw-bold mb-3">Freshcart programs</h6>
            <ul className="list-unstyled text-muted small">
              <li>Freshcart programs</li>
              <li>Gift Cards</li>
              <li>Promos & Coupons</li>
              <li>Freshcart Ads</li>
              <li>Careers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Footer;
