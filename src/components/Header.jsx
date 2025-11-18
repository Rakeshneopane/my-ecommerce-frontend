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
          <div className="container-fluid">

            {/* Brand */}
            <Link to="/home" className="navbar-brand fw-bold">Merze</Link>

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
              <ul className="navbar-nav ms-auto align-items-center">

                {/* SEARCH BAR */}
                <li className="nav-item mx-2">
                  <form
                    className="d-flex"
                    autoComplete="off"
                    onSubmit={handleSearchSubmit}
                  >
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Search products..."
                      value={searchInput}
                      onChange={handleSearchChange}
                      style={{ width: "250px" }}
                    />
                    <button className="btn btn-outline-success" type="submit">
                      Search
                    </button>
                  </form>
                </li>

                {/* WISHLIST */}
                <li className="nav-item">
                  <Link to="/wish-list" className="nav-link">
                    ❤️{wishCount ? `(${wishCount})` : ""}
                  </Link>
                </li>

                {/* CART */}
                <li className="nav-item">
                  <Link to="/cart" className="nav-link">
                    🛒 {cartCount ? `(${cartCount})` : ""}
                  </Link>
                </li>

                {/* ACCOUNT */}
                <li className="nav-item">
                  <Link to="/user" className="nav-link">
                    Account
                  </Link>
                </li>

                {/* LOGIN / LOGOUT */}
                <li className="nav-item">
                  {!user ? (
                    <Link to="/login" className="nav-link">
                      Login
                    </Link>
                  ) : (
                    <button
                      className="btn btn-link nav-link"
                      onClick={() => {
                        logout();
                        localStorage.removeItem("userId");
                        navigate("/login");
                      }}
                      style={{ textDecoration: "none" }}
                    >
                      Logout
                    </button>
                  )}
                </li>

                {/* ADMIN */}
                <li className="nav-item">
                  <Link to="/admin" className="nav-link">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </nav>
      </div>
    </header>
  );
}
