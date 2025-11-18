import { useState, useEffect } from "react";
import { useProductContext } from "../contexts/productContext";
import { useParams, Link, useNavigate  } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetails() {
  const {
    products,
    wishlist,
    addToCart,
    toggleWishList,
  } = useProductContext();

  const { productId } = useParams();
  const navigate = useNavigate();

  // Single product
  const product = products?.find((p) => p.id?.toString() === productId);

  // Local states
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState(product?.images?.[0]);

  // Freeze related items
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    // Reset when switching to a NEW product
    setSelectedSize(null);
    setQty(1);
    setMainImage(product?.images?.[0]);

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Generate a consistent 4-item random related list
    const r = products
      .filter((p) => p.id !== product.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    setRelatedItems(r);

  }, [productId]);

  if (!product) return <p>Loading...</p>;

  const SIZE_MAP = {
    Apparel: ["S", "M", "L", "XL", "XXL"],
    Footwear: ["40", "41", "42", "43", "44"],
    Electronics: ["8GB RAM", "16GB RAM", "32GB RAM"],
    Eyewear: ["140", "145", "150","155"],
    Toys: ["S", "M"],
    default: [] // electronics & others
  };
const sizes = SIZE_MAP[product.category] || SIZE_MAP.Apparel;


  // -------------------
  // WISHLIST
  // -------------------
  const handleWishList = (e, productId, title) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishList(productId);
    toast.info(
      `❤️ ${title} ${product.isOnWishList ? "removed from" : "added to"} wishlist`
    );
  };

  // -------------------
  // ADD TO CART
  // -------------------
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedSize) {
      toast.warning("⚠️ Please select a size.");
      return;
    }

    addToCart(product, selectedSize, qty); 
    toast.success(`🛒 ${product.title} added to cart`);
  };

  // -------------------
  // BUY NOW
  // -------------------
  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedSize) {
      toast.warning("⚠️ Please select a size first.");
      return;
    }

    addToCart(product, selectedSize, qty);

    navigate("/cart");
  };

  return (
    <div className="container bg-light py-4 my-3 rounded shadow-sm">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />

      <div className="row align-items-start">

        {/* LEFT SIDE */}
        <div className="col-md-5 text-center">
          <img
            src={mainImage || "https://placehold.co/400x400?text=No+Image"}
            alt={product.title}
            className="img-fluid my-3 rounded border shadow-sm"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />

          {/* Thumbnail Gallery */}
          <div className="d-flex justify-content-center flex-wrap gap-2 mt-2">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumb"
                className={`border rounded ${
                  mainImage === img ? "border-primary" : ""
                }`}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-center gap-3 mt-3">
            <button
              className="btn btn-primary px-4"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>

            <button
              className="btn btn-outline-warning px-4"
              onClick={handleAddToCart}
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-7">
          <h2>{product.title}</h2>
          <p><strong>Rating:</strong> ⭐ {product.rating}</p>
          <p><strong>Price:</strong> ₹{product.price}</p>
          <p><strong>Discount:</strong> 10% off</p>

          {/* Quantity */}
          <div className="my-3">
            <strong>Quantity: </strong>
            <button
              className="btn btn-sm btn-outline-secondary mx-2"
              onClick={() => setQty((q) => (q > 1 ? q - 1 : 1))}
            >
              -
            </button>
            <span>{qty}</span>
            <button
              className="btn btn-sm btn-outline-secondary mx-2"
              onClick={() => setQty((q) => q + 1)}
            >
              +
            </button>
          </div>

          {/* Size Selection */}
          {sizes.length > 0 && ( 
          <div className="my-3">
            <strong>Size: </strong>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`btn btn-sm ${
                    selectedSize === size
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
              )}
          <hr />
          <h5>Description:</h5>
          <ul>
            <li>Stylish and comfortable</li>
            <li>All-weather design</li>
            <li>Unparalleled essential</li>
          </ul>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <hr className="my-4" />
      <p className="fs-5 mb-3">You may also like</p>

      <div className="row">
        {relatedItems.map((p) => (
          <div
            key={p.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 my-2 d-flex justify-content-center"
          >
            <div className="card shadow-sm border-0" style={{ width: "100%", maxWidth: "250px" }}>
            <Link
              to={`/product-detail/${p.id}`}
              className="card text-decoration-none text-dark shadow-sm border-0"
              style={{ width: "100%", maxWidth: "250px" }}
            >
              <img
                src={p.images?.[0] || "https://placehold.co/250"}
                alt={p.title}
                className="card-img-top rounded-top"
                style={{ objectFit: "cover", height: "200px" }}
              />
            </Link>
            
                <div className="card-body text-center">
                  <h6 className="card-title">{p.title}</h6>
                  <p className="text-muted mb-1">₹{p.price}</p>
                  <div className="d-flex justify-content-center gap-2">

                    {/* Add to cart (default size) */}
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(p, "Default", 1);
                        toast.success(`🛒 Added ${p.title} to cart`);
                      }}
                    >
                      🛒
                    </button>

                    {/* Wishlist */}
                    <button
                      className={`btn btn-sm ${
                        wishlist.includes(p.id) ? "btn-danger" : "btn-outline-danger"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishList(p.id);
                        const isNowIn = !wishlist.includes(p.id);
                        toast.info(`❤️ ${p.title} ${isNowIn ? "added" : "removed"} from wishlist`);
                      }}
                    >
                      ❤️
                    </button>

                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
