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
        <main className="conatiner-fluid py-3">
        <div className="p-5 my-2 row">
            <div className="col-lg-3 g-1">
                <div className="d-flex flex-row my-2">
                <span ><h3> Filters </h3></span>
                <span className="mx-auto" onClick={() => setFilterData({
                    price: [], category: [], rating: [], sort: ""
                    })} style={{cursor: "pointer"}}><h3> Clear </h3></span>
                </div>

                <div className="d-flex flex-column my-2">
                    <h4>Prices</h4>
                    {[250, 500, 1000, 2000, 200000].map((val, i) => (
                    <label key={i} htmlFor={val} className="form-check-label">
                        <input
                        name="price"
                        type="checkbox"
                        className="form-check-input"
                        id={val}
                        value={val}
                        onChange={handleChange}
                        checked={filterData.price.includes(val)}
                        /> {" "}
                         {val=== 200000 ? "All" : "₹" + val + " and below"} 
                    </label>
                    ))}                    
                </div>

                <div className="d-flex flex-column my-2">
                    <h4>Category</h4>
                    
                    {["Men's Fashion", "Women's Fashion", "Accessories","Footwear","Kids"].map((cat, i) => (
              <label key={i} htmlFor={`cat-${cat}`} className="form-check-label">
                <input
                  name="category"
                  type="checkbox"
                  className="form-check-input"
                  id={`cat-${cat}`}
                  value={cat}
                  onChange={handleChange}
                  checked={filterData.category.includes(cat)} 
                /> {" "}
                {cat }
              </label>
            ))}
                </div>
                <div className="d-flex flex-column my-2">
                    <h4>Ratings</h4>
                      {[4, 3, 2, 1].map((rate, i) => (
              <label key={i} htmlFor={`rate-${rate}`} className="form-check-label">
                <input
                  name="rating"
                  type="checkbox"
                  className="form-check-input"
                  id={`rate-${rate}`}
                  value={rate}
                  onChange={handleChange}
                  checked={filterData.rating.includes(rate)} 
                /> {" "}
                {rate} stars and above
              </label>
            ))}
                </div>
                <div className="d-flex flex-column my-2">
                    <label htmlFor="sort" className="form-check-label">Sort By:</label>
                   <select 
                   name="" 
                   id="sort" 
                   className="form-select"
                   value={filterData.sort} 
                   onChange={(e) =>
                        setFilterData((prev) => ({ ...prev, sort: e.target.value }))
                    }>
                    <option value="">Relevance</option>
                    <option value="low-to-high">Price low to high</option>
                    <option value="high-to-low">Price high to low</option>
                    <option value="rating">Avg. Customer Review</option>
                    <option value="new">Newest Arrivals</option>
                    <option value="best">Best Seller</option>
                   </select>
                  
                </div>
            </div>
            
            <div className="my-2 col-lg-9 row">
            { locallyFiltered.map((item, index)=>(
                <Link to={`/product-detail/${item.id}`} key={index} className="card col-md-4 col-sm-6 text-decoration-none">
                    <div className="card-img">
                        <img src={item.images?.[0] || "https://placehold.co/400x400?text=No+Image"} alt={`${item.title}`} className="img-fluid" />
                    </div>
                    <div className="card-body">
                        <p className="card-title">{item.title}</p>
                        <p>Category: {item.category}</p>
                        <p>Price: {item.price}</p>
                        <p>Ratings: {item.rating}</p>
                        <p className={parseInt(item.stock) < 5 ? "text-danger": "" }>Stock: {item.stock}</p>
                        <button className="btn btn-secondary btn-sm">{ `${item.price > 250 ? "Free Delivery" : "Paid Delivery"}`}</button>
                        <button className="btn btn-primary btn-sm" onClick={(e)=>handleWishList(e, item.id)}>Add to Wish-List</button>
                        <button className="btn btn-warning btn-sm" onClick={(e)=>handleCart(e, item.id)}>Add to Cart</button>
                    </div>
                </Link>
            ))}
            </div>
        </div>
        </main>
    )
}