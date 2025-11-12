// src/contexts/productContext.jsx
import { useState, useEffect, createContext, useContext } from "react";
import { useFetch } from "../useFetch";

const ProductContext = createContext();
export const useProductContext = () => useContext(ProductContext);

export default function ProductProvider({ children }) {
  const API_BASE = import.meta.env.VITE_BASE_URI || "https://my-ecommerce-eta-ruby.vercel.app";

  // 🧩 Local state
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ type: "", section: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🧩 Fetch from backend (manual, replacing useFetch)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/products`);
      if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
      const json = await res.json();
      console.log("Fetched raw productsData:", json);
      const list = Array.isArray(json.data) ? json.data : [];

      // Merge with localStorage
      const saved = JSON.parse(localStorage.getItem("products")) || [];
      const merged = list.map((prod) => {
        const normalized = {
          ...prod,
          id: prod.id || prod._id,
          images:
            Array.isArray(prod.images) && prod.images.length > 0
              ? prod.images
              : ["https://placehold.co/400x400?text=No+Image"],
        };

        const savedProd = saved.find((p) => p.id === normalized.id);
        return savedProd
          ? { ...normalized, ...savedProd }
          : { ...normalized, isOnWishList: false, isInCart: false };
      });

      console.log("Final merged products:", merged);
      setProducts(merged);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Refresh helper (to call from anywhere)
  const refreshProducts = () => fetchProducts();

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Save product meta (wishlist/cart/qty) to localStorage
  useEffect(() => {
    if (!products.length) return;
    const minimal = products.map((p) => ({
      id: p.id,
      isOnWishList: p.isOnWishList,
      isInCart: p.isInCart,
      quantity: p.quantity || 1,
    }));
    localStorage.setItem("products", JSON.stringify(minimal));
  }, [products]);

  // Filters and search
  const filteredProducts = products.filter((p) => {
    const matchesFilter =
      (!filters.type || p.type?.id === filters.type) &&
      (!filters.section || p.section?.id === filters.section);
    const matchesSearch =
      searchTerm === "" ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Wishlist / cart handlers
  function toggleWishList(id) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isOnWishList: !p.isOnWishList } : p
      )
    );
  }

  function toggleCart(id) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isInCart: !p.isInCart } : p
      )
    );
  }

  function changeQuantity(id, delta) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) }
          : p
      )
    );
  }

  // Loading/error UI
  if (loading)
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-dark">
        <div
          className="spinner-border text-dark mb-3"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        ></div>
        <h4>Loading products...</h4>
      </div>
    );

  if (error)
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-danger">
        <i className="bi bi-exclamation-octagon display-4 mb-3"></i>
        <h4>Something went wrong!</h4>
        <p className="text-secondary">{error}</p>
      </div>
    );

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        filters,
        setFilters,
        searchTerm,
        setSearchTerm,
        toggleWishList,
        toggleCart,
        changeQuantity,
        refreshProducts, 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
