import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import Navbar from './components/navbar/navbar';
import Home from './components/HomePage/home';
import Product from './components/pages/product'; 
import Store from './components/pages/Store';
import StoreVisit from './components/pages/StoreVisit';
import Authenticate from "./components/pages/authenticate";
import Cart from "./components/pages/cart";
import Checkout from "./components/pages/checkOut";
import ProductDetails from "./components/pages/productDetails";

import AdminDashboard from './components/adminDashboard/adminDashboard';
import MenuProduct from "./components/adminDashboard/MenuOfProducts/MenuProducts";
import MenuCategories from "./components/adminDashboard/menuBar/menuCategories";
import MenuOrders from "./components/adminDashboard/menuBar/menuOrders";
import MenuSellers from "./components/adminDashboard/menuBar/menuSeller";
import MenuSellerRequest from "./components/adminDashboard/menuBar/menuSellerRequest";
import MenuBuyersRequest from "./components/adminDashboard/menuBar/menuBuyersRequest";


import { MainContextProvider } from './utils/context';
import SellerDashboard from "./components/sellerDashboard/sellerDashboard";
import ManageProducts from "./components/sellerDashboard/manageProducts";
import EditSellerProfile from "./components/sellerDashboard/editProfile";
import SellerMenuOrders from "./components/sellerDashboard/sellerMenuOrders";
import { ProtectedRoute } from './components/ProtectedRoute';


function App() {
  return (
    <MainContextProvider>
      <MainLayout />
    </MainContextProvider>
  );
}

function MainLayout() {
  const location = useLocation();
  const hideNavbar = 
    location.pathname.startsWith('/adminDashboard') || 
    location.pathname.startsWith('/sellerDashboard');

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/store" element={<Store />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/StoreVisit/:index" element={<StoreVisit />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkOut" element={<Checkout />} />
        <Route path="/productDetails/:id" element={<ProductDetails />} />
        

        <Route 
          path="/sellerDashboard" 
          element={
            <ProtectedRoute requiredRole="seller">
              <SellerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManageProducts />} />
          <Route path="manageProducts" element={<ManageProducts />} />
          <Route path="editProfile/:userId" element={<EditSellerProfile />} />
          <Route path="sellerMenuOrders/:userId" element={<SellerMenuOrders />} />
        </Route>

        <Route path="/adminDashboard" element={<AdminDashboard />}>
          <Route index element={<MenuProduct />} />
          <Route path="MenuProducts" element={<MenuProduct />} />
          <Route path="menuCategories" element={<MenuCategories />} />
          <Route path="menuOrders" element={<MenuOrders />} />
          <Route path="menuSeller" element={<MenuSellers />} />
          <Route path="menuSellerRequest" element={<MenuSellerRequest />} />
          <Route path="menuBuyersRequest" element={<MenuBuyersRequest/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
