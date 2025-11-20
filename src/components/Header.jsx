// src/components/Header.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProductContext } from "../contexts/productContext";
import { useUserContext } from "../contexts/userContext";

export default function Header() {
  const { products, setSearchTerm, cartItems,wishlist } = useProductContext();
  const { user, logout } = useUserContext();

  const [showNav, setShowNav] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const wishCount = wishlist.length;
  const cartCount = cartItems.length;

  // Sync input with ?search= in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";

    // Only update if URL changed externally
    if (query !== searchInput) {
      setSearchInput(query);
      setSearchTerm(query);
    }
  }, [location.search]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchInput(term);
    setSearchTerm(term);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = searchInput.trim();
    navigate(`/products${term ? `?search=${encodeURIComponent(term)}` : ""}`);
  };

 return (
  <header className="bg-light text-success py-3 sticky-top shadow-sm">
    <div className="container-fluid">
      <nav className="navbar navbar-expand-md navbar-light bg-light">

        {/* Brand */}
        <Link to="/home" className="navbar-brand fw-bold">
          Merze
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setShowNav((prev) => !prev)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Nav */}
        <div className={`collapse navbar-collapse ${showNav ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto w-100 align-items-md-center">

            {/* SEARCH: full width on mobile, small on big screen */}
            <li className="nav-item w-100 my-2 my-md-0">
              <form
                className="d-flex w-100 justify-content-md-end"
                autoComplete="off"
                onSubmit={handleSearchSubmit}
              >
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  style={{
                    maxWidth: "250px",  // small on large screens
                    width: "100%",      // full-width on mobile
                  }}
                />
                <button className="btn btn-outline-success d-none d-md-block" type="submit">
                  Go
                </button>
                {/* Mobile icon button */}
                <button className="btn btn-outline-success d-md-none" type="submit">
                  🔍
                </button>
              </form>
            </li>

            {/* WISHLIST */}
            <li className="nav-item mx-md-2 my-1">
              <Link to="/wish-list" className="nav-link text-center">
                ❤️{wishCount ? `(${wishCount})` : ""}
              </Link>
            </li>

            {/* CART */}
            <li className="nav-item mx-md-2 my-1">
              <Link to="/cart" className="nav-link text-center">
                🛒{cartCount ? `(${cartCount})` : ""}
              </Link>
            </li>

            {/* ACCOUNT */}
            <li className="nav-item mx-md-2 my-1">
              <Link to="/user" className="nav-link text-center">
                Account
              </Link>
            </li>

            {/* LOGIN / LOGOUT (normal link, not button) */}
            <li className="nav-item mx-md-2 my-1 text-center">
              {!user ? (
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              ) : (
                <span
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    logout();
                    localStorage.removeItem("userId");
                    navigate("/login");
                  }}
                >
                  Logout
                </span>
              )}
            </li>

            {/* ADMIN (normal link) */}
            <li className="nav-item mx-md-2 my-1">
              <Link to="/admin" className="nav-link text-center">
                Admin
              </Link>
            </li>

          </ul>
        </div>
      </nav>
    </div>
  </header>
);
}
