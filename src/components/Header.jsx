import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProductContext } from "../contexts/productContext";

export default function Header() {
  const { products, setSearchTerm } = useProductContext();
  const [showNav, setShowNav] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const wishCount = products.filter((p) => p.isOnWishList).length;
  const cartCount = products.filter((p) => p.isInCart).length;

  // Sync input with query param if navigating via URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchInput(query);
    setSearchTerm(query); // live filtering based on URL
  }, [location.search, setSearchTerm]);

  // Live search while typing
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchInput(term);
    setSearchTerm(term); // live filtering
  };

  // Submit search (updates URL)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = searchInput.trim();
    navigate(`/products${term ? `?search=${encodeURIComponent(term)}` : ""}`);
  };

  return (
    <header className="bg-light text-success py-4 sticky-top">
      <div className="container-fluid">
        <nav className="navbar navbar-expand-md navbar-light bg-light">
          <div className="container-fluid">
            <Link to="/home" className="navbar-brand">
              Merze
            </Link>
            <button
              type="button"
              className="navbar-toggler"
              onClick={() => setShowNav((prev) => !prev)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${showNav ? "show" : ""}`}>
              <ul className="navbar-nav ms-auto">
                <li className="nav-item mx-2">
                  <form className="d-flex" autoComplete="off" onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Search products..."
                      value={searchInput}
                      onChange={handleSearchChange} // live search
                      style={{ width: "250px" }}
                    />
                    <button className="btn btn-outline-success" type="submit">
                      Search
                    </button>
                  </form>
                </li>
                <li className="nav-item">
                  <Link to="/wish-list" className="nav-link">
                    Wish List{wishCount ? `(${wishCount})` : ""}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/cart" className="nav-link">
                    Cart{cartCount ? `(${cartCount})` : ""}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/user" className="nav-link">
                    Account
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
