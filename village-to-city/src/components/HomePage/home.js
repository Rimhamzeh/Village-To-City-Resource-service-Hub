import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../product-card/product-card";
import Footer from "../footer/footer";
import ContactForm from "../ContactForm/contactForm";
import { RotatingLines } from "react-loader-spinner";
import { fetchSpecialProducts } from "../../utils/productService";
function Home() {
  
  const [specialProducts, setSpecialProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpecialProducts = async () => {
      try {
        const products = await fetchSpecialProducts();
        setSpecialProducts(products); 
      } catch (error) {
        console.error("Failed to fetch special products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSpecialProducts();
  }, []);

  return (
    <div>
      <main className="main">
        <div className="main__div-pic">
          <img
            width={"100%"}
            height={"60%"}
            className="div-pic__photo"
            src="/images/home.png"
            alt="A welcoming view of the village"
          />
        </div>

        <section id="SpecialProducts" className="SpecialProducts">
          <h1 className="SpecialProducts-h1">Special Products</h1>
          <Link to="/product">
            <h3 className="SpecialProducts-h3">Show All Products</h3>
          </Link>

          {loading ? (
            <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div>
                      
                      <RotatingLines
                                 visible={true}
                                 height="96"
                                 width="96"
                                 color="#d6aa8d"
                                 strokeWidth="5"
                                 animationDuration="0.75"
                                 ariaLabel="rotating-lines-loading"
                                 wrapperStyle={{}}
                                 wrapperClass=""
                               />
                      
                    </div>
                    </div>
          ) : specialProducts.length > 0 ? (
            <div className="product">
              {specialProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showActions={false}
                  showStoreButton={true}
                />
              ))}
            </div>
          ) : (
            <p className="text-center"> No Special Products Found.</p>
          )}
        </section>
        <section id="ContactUs" className="contact">
        <ContactForm/>
            
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
