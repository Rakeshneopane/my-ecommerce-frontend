
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

import CreateProduct from './admin/createProduct';
import AdminDashboard from './admin/adminDashboard';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';


function App() {
  return (
    <>
      <ProductProvider >
        <UserProvider>
           <div className="d-flex flex-column min-vh-100 bg-success-subtle">
            <Header />
             <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />}> </Route>
              <Route path="/home" element={<Home />}> </Route>
              <Route path="/products" element={<Products />}> </Route>
              <Route path="/product-detail/:productId" element={<ProductDetails />}> </Route>
              <Route path="/wish-list" element={<WishList />}></Route>
              <Route path="/cart" element={<Cart />}></Route>
              <Route path="/user" element={<UserProfile />}></Route>
              <Route path="/address" element={<AddressManagement />}></Route>
              <Route path="/admin/create-product" element={<CreateProduct />}></Route>
              <Route path="/admin/edit-product/:productId" element={<CreateProduct />}></Route>
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
            </main>
            
            <Footer />
            </div>
        </UserProvider>
      </ProductProvider>
    </>
  )
}

export default App
