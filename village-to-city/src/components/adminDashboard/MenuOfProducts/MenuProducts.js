
import { useEffect,useState } from "react";
import ProductTable from "../../Shared/productTable";
import { getAllProducts } from "../../../utils/productService";
function MenuProduct() {
    const role="admin";
     const [products, setProducts] = useState([]);
   
     useEffect(() => {
       getAllProducts().then((res) => {
         setProducts(res);
       });
     }, []);
   
     return (
       <div>
         <ProductTable userRole={role}  />
       </div>
     );
   }



export default MenuProduct;
