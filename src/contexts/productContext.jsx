// src/contexts/productContext.jsx
import { useState, useEffect, createContext, useContext } from "react";
// import productsData from "../../products.json";
// import sections from "../../sections.json";
// import types from "../../types.json";
import { useFetch } from "../useFetch";

const ProductContext = createContext();
export const useProductContext = () => useContext(ProductContext);



export default function ProductProvider({ children }) {

  const { data: productsData, loading, error } = useFetch("http://localhost:3000/api/products");
  console.log("Fetched raw productsData:", productsData);
  
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!productsData) return;

    console.log("Fetched:", productsData);
    
    const list = Array.isArray(productsData)
      ? productsData
      : productsData.data || [];

      console.log("Normalized product list:", list);

      if (!Array.isArray(list)) return;

      const saved = JSON.parse(localStorage.getItem("products")) || [];

      const merged = list.map(prod => {
      const normalized = { ...prod,
        id: prod.id || prod._id,  //  normalize _id → id
        images: Array.isArray(prod.images) && prod.images.length > 0 // image exist
          ? prod.images
          : ["https://placehold.co/400x400?text=No+Image"],
       }; 

      const savedProd = saved.find(p => p.id === normalized.id);
      return savedProd
        ? { ...normalized, ...savedProd }
        : { ...normalized, isOnWishList: false, isInCart: false };
    });

    console.log("Final merged products:", merged);

    setProducts(merged);
  }, [productsData]);

  const [filters, setFilters] = useState({ type: "", section: "" });

  // NEW: searchTerm kept in context
  const [searchTerm, setSearchTerm] = useState("");

  // Derived list: applies both filters and searchTerm
  const filteredProducts = products.filter(p => {
    const matchesFilter =
      (!filters.type || p.type.id === filters.type) &&
      (!filters.section || p.section.id === filters.section);

    const matchesSearch =
      searchTerm === "" ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Save to localStorage on change
   useEffect(() => {
    if (!products.length) return;
    const minimal = products.map(p => ({
      id: p.id,
      isOnWishList: p.isOnWishList,
      isInCart: p.isInCart,
      quantity: p.quantity || 1,
    }));
    localStorage.setItem("products", JSON.stringify(minimal));
  }, [products]);

  function toggleWishList(id) {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, isOnWishList: !p.isOnWishList } : p))
    );
  }

  function toggleCart(id) {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, isInCart: !p.isInCart } : p))
    );
  }

  function changeQuantity(id, delta) {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) } : p
      )
    );
  }

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;

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
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
