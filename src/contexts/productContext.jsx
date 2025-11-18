// src/contexts/ProductContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "../useFetch";

const ProductContext = createContext();
export const useProductContext = () => useContext(ProductContext);

export default function ProductProvider({ children }) {
  const API = import.meta.env.VITE_BASE_URI;

  // FETCH DATA
  const { data: productRes } = useFetch(`${API}/api/products`, { data: [] });
  const { data: sectionRes } = useFetch(`${API}/sections`, { sections: [] });
  const { data: typeRes } = useFetch(`${API}/types`, { types: [] });

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // CART ARRAY (single source of truth)
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
  });
  // WISH LIST
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  });


  // LOAD PRODUCTS FROM SERVER
  useEffect(() => {
    if (!productRes?.data) return;

    const normalized = productRes.data.map((p) => ({
      ...p,
      id: p._id,
      sectionName: p.section?.name || null,
      typeName: p.types?.name || null,
      images: p.images?.length ? p.images : ["https://placehold.co/400"],
    }));

    setProducts(normalized);
  }, [productRes]);

  // SAVE CART
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // SAVE WISH LIST
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // SEARCH FILTER
  const searchedProducts = searchTerm
    ? products.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;


  // WISHLIST
  const toggleWishList = (productId) => {
    setWishlist((prev) => {
    if (prev.includes(productId)) {
      return prev.filter(id => id !== productId);
    }
    return [...prev, productId];
  });
  };

  // ADD TO CART 
  const addToCart = (product, size, qty = 1) => {
    if (!size) return;

    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.size === size
      );

      // If already in cart → increase quantity by qty
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.size === size
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }

      // New entry → add with qty
      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0],
          size,
          quantity: qty,
        },
      ];
    });
  };

  // CHANGE CART ITEM QUANTITY
  const changeCartQuantity = (productId, size, amount) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.size === size) {
            const newQty = item.quantity + amount;
            return { ...item, quantity: newQty < 1 ? 1 : newQty };
          }
          return item;
        })
    );
  };

  // REMOVE CART ITEM
  const removeCartItem = (productId, size) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.size === size)
      )
    );
  };

  // SECTION-TYPE MAP
  const [sectionTypeMap, setSectionTypeMap] = useState({});

  useEffect(() => {
    if (!sectionRes.sections || !typeRes.types) return;

    const map = {};
    sectionRes.sections.forEach((s) => {
      map[s.name] = {
        image: s.images?.[0] || "",
        types: [],
      };
    });

    typeRes.types.forEach((t) => {
      const sec = sectionRes.sections.find((s) => s._id === t.section);
      if (sec) {
        map[sec.name].types.push({
          name: t.name,
          image: t.images?.[0],
        });
      }
    });

    setSectionTypeMap(map);
  }, [sectionRes, typeRes]);

  return (
    <ProductContext.Provider
      value={{
        products: searchedProducts,
        allProducts: products,
        sectionTypeMap,
        searchTerm,
        setSearchTerm,

        // wishlist
        wishlist,
        toggleWishList,

        // cart
        cartItems,
        addToCart,
        changeCartQuantity,
        removeCartItem,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
