import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useProductContext } from "../contexts/productContext";
import { toast } from "react-toastify";

export default function Products() {
  const {
    allProducts,
    products,
    searchTerm,
    sectionTypeMap,
    toggleWishList,
    wishlist,
    addToCart,
  } = useProductContext();

  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const selectedSection = query.get("section");
  const selectedType = query.get("type");

  const sections = Object.keys(sectionTypeMap);

  const [priceRange, setPriceRange] = useState([0, 200000]);

  const [filters, setFilters] = useState({
    sections: [],
    types: [],
    price: [],
    rating: [],
    sort: "",
  });

  // ---------------- CLEAR ALL FILTERS ----------------
  const clearFilters = () => {
    setFilters({
      sections: [],
      types: [],
      price: [],
      rating: [],
      sort: "",
    });

    setPriceRange([0, 20000]);

    window.history.replaceState({}, "", "/products");
  };

  // ---------------- UPDATE QUERY PARAMS ----------------
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.sections.length)
      params.set("section", filters.sections.join(","));

    if (filters.types.length)
      params.set("type", filters.types.join(","));

    if (filters.sort) params.set("sort", filters.sort);

    const queryString = params.toString();
    window.history.replaceState({}, "", queryString ? `?${queryString}` : "");
  }, [filters]);

  // ---------------- APPLY INITIAL QUERY FILTERS ----------------
  useEffect(() => {
    const initialSections = selectedSection ? [selectedSection] : [];
    const initialTypes = selectedType ? [selectedType] : [];

    setFilters((prev) => ({
      ...prev,
      sections: initialSections,
      types: initialTypes,
    }));
  }, [selectedSection, selectedType]);

  // ---------------- HANDLE CHECKBOXES ----------------
  const handleCheck = (e) => {
    const { name, value, checked } = e.target;

    const numericValue =
      name === "price"
        ? Number(value)
        : name === "rating"
        ? Number(value)
        : value;

    setFilters((prev) => ({
      ...prev,
      [name]: checked
        ? [...prev[name], numericValue]
        : prev[name].filter((v) => v !== numericValue),
    }));
  };

  // ---------------- FILTER LOGIC ----------------
  function match(p) {
    if (filters.sections.length && !filters.sections.includes(p.sectionName))
      return false;

    if (filters.types.length && !filters.types.includes(p.typeName))
      return false;

    if (filters.price.length) {
      const maxPrice = Math.max(...filters.price);
      if (p.price > maxPrice) return false;
    }

    if (p.price > priceRange[1]) return false;

    if (filters.rating.length) {
      if (!filters.rating.some((r) => p.rating >= r)) return false;
    }

    return true;
  }

  // ---------------- SORT ----------------
  function sortTheFiltered(products) {
    let sorted = [...products];

    switch (filters.sort) {
      case "low-high":
        return sorted.sort((a, b) => a.price - b.price);

      case "high-low":
        return sorted.sort((a, b) => b.price - a.price);

      case "best-rated":
        return sorted.sort((a, b) => b.rating - a.rating);

      case "relevance":
        return sorted.sort((a, b) => {
          const scoreA =
            (filters.sections.includes(a.sectionName) ? 1 : 0) +
            (filters.types.includes(a.typeName) ? 1 : 0);

          const scoreB =
            (filters.sections.includes(b.sectionName) ? 1 : 0) +
            (filters.types.includes(b.typeName) ? 1 : 0);

          return scoreB - scoreA;
        });

      default:
        return sorted;
    }
  }

  let filtered = sortTheFiltered(products.filter(match));

  // ---------------- BUTTON HANDLERS ----------------
  const handleWishList = (e, productId, title) => {
    e.preventDefault();
    e.stopPropagation();

    const isNowInList = !wishlist.includes(productId);
    toggleWishList(productId);

    toast.info(`❤️ ${title} ${isNowInList ? "added to" : "removed from"} wishlist`);
  };

  const handleCart = (e, productId, title) => {
    e.preventDefault();
    e.stopPropagation();

    const product = allProducts.find((p) => p.id === productId);
    if (!product) return;

    addToCart(product, "Default", 1);

    toast.success(`🛒 ${title} added to cart`);
  };


  console.log(filtered)
  return (
    <div className="container py-4">
      <div className="row gy-4">

        {/* FILTERS SIDEBAR (collapsible on mobile) */}
        <aside className="col-12 col-md-3">

          <div className="d-md-none mb-3">
            <button
              className="btn btn-success w-100"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#filterMenu"
            >
              Filters ⚙️
            </button>
          </div>

          <div className="collapse d-md-block" id="filterMenu">
            <div className="card p-3 shadow-sm">

              <div className="d-flex justify-content-between mb-2">
                <span className="h5 m-0">Filters</span>
                <button className="btn btn-sm btn-warning" onClick={clearFilters}>
                  Clear
                </button>
              </div>

              {/* SECTIONS */}
              <h6 className="mt-3">Sections</h6>
              {sections.map((sec) => (
                <div key={sec} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="sections"
                    value={sec}
                    checked={filters.sections.includes(sec)}
                    onChange={handleCheck}
                  />
                  <label className="form-check-label">{sec}</label>
                </div>
              ))}

              {/* TYPES */}
              <h6 className="mt-3">Types</h6>
              {sections.flatMap((sec) =>
                sectionTypeMap[sec].types.map((t) => (
                  <div key={t.name} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="types"
                      value={t.name}
                      checked={filters.types.includes(t.name)}
                      onChange={handleCheck}
                    />
                    <label className="form-check-label">{t.name}</label>
                  </div>
                ))
              )}

              {/* PRICE SLIDER */}
              <h6 className="mt-3">Price Range</h6>
              <input
                type="range"
                min="0"
                max="200000"
                step="500"
                value={priceRange[1]}
                onChange={(e) => {
                  const newMax = Number(e.target.value);
                  setPriceRange([0, newMax]);
                  setFilters((prev) => ({ ...prev, price: [newMax] }));
                }}
                className="form-range"
              />
              <p className="small text-muted">Up to: ₹{priceRange[1]}</p>

              {/* QUICK PRICE FILTERS */}
              <h6>Quick Prices</h6>
              {[500, 2000, 5000, 10000].map((p) => (
                <div key={p} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="price"
                    value={p}
                    checked={filters.price.includes(p)}
                    onChange={handleCheck}
                  />
                  <label className="form-check-label">Up to ₹{p}</label>
                </div>
              ))}

              {/* RATING */}
              <h6 className="mt-3">Rating</h6>
              {[4, 3, 2, 1].map((r) => (
                <div key={r} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="rating"
                    value={r}
                    checked={filters.rating.includes(r)}
                    onChange={handleCheck}
                  />
                  <label className="form-check-label">{r} ⭐ & above</label>
                </div>
              ))}

              {/* SORT */}
              <h6 className="mt-3">Sort By</h6>
              <select
                name="sort"
                value={filters.sort}
                className="form-select"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sort: e.target.value }))
                }
              >
                <option value="">All</option>
                <option value="low-high">Low → High</option>
                <option value="high-low">High → Low</option>
                <option value="relevance">Relevance</option>
                <option value="best-rated">Best Rated</option>
              </select>

            </div>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <section className="col-12 col-md-9">

          <h4 className="mb-3">
            {filtered.length} {filtered.length === 1 ? "Product" : "Products"}
          </h4>

          <div className="row g-3">
            {filtered.map((p) => (
              <div key={p.id} className="col-6 col-sm-6 col-md-4 col-lg-3">

                <Link to={`/product-detail/${p.id}`} className="text-decoration-none text-dark">
                  <div className="card h-100 shadow-sm hover-shadow">

                    <img
                      src={p.images[0]}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />

                    <div className="card-body">
                      <p className="fw-semibold small">{p.title}</p>
                      <p className="text-muted small">
                        {p.category} | {p.sectionName}
                      </p>
                      <p className="fw-bold mb-1">₹{p.price}</p>
                      <p className="small">⭐ {p.rating}</p>

                      {p.price > 1000 ? (
                        <span className="badge text-bg-success">Free Delivery</span>
                      ) : (
                        <span className="badge text-bg-danger">Paid Delivery</span>
                      )}
                    </div>

                    <div className="card-footer bg-white d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={(e) => handleCart(e, p.id, p.title)}
                      >
                        🛒
                      </button>

                      <button
                        className={`btn btn-sm ${
                          wishlist.includes(p.id)
                            ? "btn-danger"
                            : "btn-outline-danger"
                        }`}
                        onClick={(e) => handleWishList(e, p.id, p.title)}
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
