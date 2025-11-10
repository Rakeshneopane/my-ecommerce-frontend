// import products from "../../products.json";
import { useState } from "react";
import { useProductContext } from "../contexts/productContext";
import {Link} from 'react-router-dom'

export default function Products(){

    
    const { filteredProducts, toggleWishList, toggleCart } = useProductContext();
    console.log("product: ", filteredProducts);

    const [filterData, setFilterData] = useState({
        price: [],
        category: [],
        rating: [],
        sort: ""
    });

    console.log("filteredData:",filterData);

    const maxPrice = filterData.price.length ? Math.max(...filterData.price) : Infinity;
    const locallyFiltered  = filteredProducts.filter(p => {
        const priceMatch =
            filterData.price.length === 0 ||
            p.price <= maxPrice;

        const categoryMatch =
            filterData.category.length === 0 ||
            filterData.category.includes(p.category);

        const ratingMatch =
            filterData.rating.length === 0 ||
            filterData.rating.some(r => p.rating >= r);

        return priceMatch && categoryMatch && ratingMatch;
});

    function handleChange(e){
        const { checked, value, name, type } = e.target;
        const val = name === "price" || name === "rating" ? Number(value) : value;
        
        setFilterData(prev=>{
            if (!Array.isArray(prev[name])) {
                return { ...prev, [name]: val };
                }
            return {
                ...prev,
                [name]: checked ? [...prev[name], val]
                : prev[name].filter(v => v !== val)
                }
            })
    }


   if (filterData.sort === "low-to-high") {
      locallyFiltered.sort((a, b) => a.price - b.price);
    } else if (filterData.sort === "high-to-low") {
      locallyFiltered.sort((a, b) => b.price - a.price);
    } else if (filterData.sort === "rating") {
      locallyFiltered.sort((a, b) => b.rating - a.rating);
    } else if (filterData.sort === "new") {
      locallyFiltered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filterData.sort === "best") {
      locallyFiltered.sort((a, b) => {
        if (b.rating === a.rating) return b.price - a.price;
        return b.rating - a.rating;
      });
    }

function handleWishList(e, productId){
  e.preventDefault();
  e.stopPropagation();
  toggleWishList(productId);
}

function handleCart(e, productId){
  e.preventDefault();
  e.stopPropagation();
  toggleCart(productId);
}
    
    return(
         <main className="container-fluid py-3">
      <div className="row p-4">
        {/* ---------- FILTER SECTION ---------- */}
        <aside className="col-lg-3 mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="mb-0">Filters</h3>
            <button
              className="btn btn-warning btn-sm"
              onClick={() =>
                setFilterData({ price: [], category: [], rating: [], sort: "" })
              }
            >
              Clear
            </button>
          </div>

          {/* Price */}
          <div className="mb-3">
            <h5>Price</h5>
            {[250, 500, 1000, 2000, 200000].map((val, i) => (
              <label key={i} className="form-check-label d-block mb-1">
                <input
                  name="price"
                  type="checkbox"
                  className="form-check-input me-2"
                  value={val}
                  onChange={handleChange}
                  checked={filterData.price.includes(val)}
                />
                {val === 200000 ? "All" : `₹${val} and below`}
              </label>
            ))}
          </div>

          {/* Category */}
          <div className="mb-3">
            <h5>Category</h5>
            {[
              "Men's Fashion",
              "Women's Fashion",
              "Accessories",
              "Footwear",
              "Kids",
            ].map((cat, i) => (
              <label key={i} className="form-check-label d-block mb-1">
                <input
                  name="category"
                  type="checkbox"
                  className="form-check-input me-2"
                  value={cat}
                  onChange={handleChange}
                  checked={filterData.category.includes(cat)}
                />
                {cat}
              </label>
            ))}
          </div>

          {/* Ratings */}
          <div className="mb-3">
            <h5>Ratings</h5>
            {[4, 3, 2, 1].map((rate, i) => (
              <label key={i} className="form-check-label d-block mb-1">
                <input
                  name="rating"
                  type="checkbox"
                  className="form-check-input me-2"
                  value={rate}
                  onChange={handleChange}
                  checked={filterData.rating.includes(rate)}
                />
                {rate} stars & above
              </label>
            ))}
          </div>

          {/* Sort */}
          <div className="mb-3">
            <h5>Sort By</h5>
            <select
              id="sort"
              className="form-select"
              value={filterData.sort}
              onChange={(e) =>
                setFilterData((prev) => ({
                  ...prev,
                  sort: e.target.value,
                }))
              }
            >
              <option value="">Relevance</option>
              <option value="low-to-high">Price: Low → High</option>
              <option value="high-to-low">Price: High → Low</option>
              <option value="rating">Avg. Customer Review</option>
              <option value="new">Newest Arrivals</option>
              <option value="best">Best Seller</option>
            </select>
          </div>
        </aside>

        {/* ---------- PRODUCT LIST SECTION ---------- */}
        <section className="col-lg-9">
          {locallyFiltered.length > 0 ? (
            <>
              <h5 className="mb-4">
                Products ({locallyFiltered.length})
              </h5>
              <div className="row g-3">
                {locallyFiltered.map((item, index) => (
                  <Link
                    to={`/product-detail/${item.id}`}
                    key={index}
                    className="col-12 col-sm-6 col-md-4 text-decoration-none"
                  >
                    <div className="card h-100 border-0 shadow-sm rounded hover-shadow transition-all">
                      <img
                        src={
                          item.images?.[0] ||
                          "https://placehold.co/400x400?text=No+Image"
                        }
                        alt={item.title}
                        className="card-img-top rounded-top"
                        style={{ objectFit: "cover", height: "250px" }}
                      />

                      <div className="card-body">
                        <h6 className="card-title text-dark text-truncate">
                          {item.title}
                        </h6>
                        <p className="mb-1 text-muted small">
                          {item.category}
                        </p>
                        <p className="mb-1 fw-semibold">₹{item.price}</p>
                        <p className="mb-1 small">⭐ {item.rating}</p>
                        <p
                          className={`small ${
                            parseInt(item.stock) < 5 ? "text-danger" : "text-muted"
                          }`}
                        >
                          Stock: {item.stock}
                        </p>

                        {/* Delivery Badge */}
                        <span
                          className={`badge ${
                            item.price > 250
                              ? "bg-success"
                              : "bg-danger"
                          } mb-2`}
                        >
                          {item.price > 250
                            ? "Free Delivery"
                            : "Paid Delivery"}
                        </span>

                        {/* Buttons */}
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          <button
                            className="btn btn-sm btn-outline-danger flex-fill"
                            onClick={(e) => handleWishList(e, item.id)}
                          >
                            ❤️ Wishlist
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning flex-fill"
                            onClick={(e) => handleCart(e, item.id)}
                          >
                            🛒 Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center p-5 text-muted">
              <h5>No products found.</h5>
            </div>
          )}
        </section>
      </div>
    </main>
    )
}