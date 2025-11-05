import { useState, createContext, useContext } from 'react';
import { Routes,Route } from "react-router-dom";

import ProductProvider from './contexts/productContext';
import { UserProvider } from "./contexts/userContext";
import Header from "./components/Header";
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import WishList from './pages/WishList';
import Cart from "./pages/Cart"
import AddressManagement from './pages/AddressManagement';
import UserProfile from './pages/UserProfile';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';


function App() {
  return (
    <>
      <ProductProvider >
        <UserProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Home />}> </Route>
              <Route path="/home" element={<Home />}> </Route>
              <Route path="/products" element={<Products />}> </Route>
              <Route path="/product-detail/:productId" element={<ProductDetails />}> </Route>
              <Route path="/wish-list" element={<WishList />}></Route>
              <Route path="/cart" element={<Cart />}></Route>
              <Route path="/user" element={<UserProfile />}></Route>
              <Route path="/address" element={<AddressManagement />}></Route>
            </Routes>
            <Footer />
        </UserProvider>
      </ProductProvider>
    </>
  )
}

export default App
