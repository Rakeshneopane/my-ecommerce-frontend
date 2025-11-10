import { useState, useEffect } from "react";
import { useProductContext } from "../contexts/productContext";
import { useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetails() {
  const { products, changeQuantity, toggleWishList, toggleCart } = useProductContext();
  const { productId } = useParams();

  const product = products?.find((p) => p.id?.toString() === productId);

  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState(product?.images?.[0]);

  useEffect(() => {
    setSelectedSize(null);
    setMainImage(product?.images?.[0]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId, product]);

  if (!product) return <p>Loading...</p>;

  const sizes = ["S", "M", "L", "XL", "XXL"];

  const handleWishList = (e, productId, title) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishList(productId);
    toast.info(`❤️ ${title} ${product.isOnWishList ? "removed from" : "added to"} wishlist`);
  };

  const handleCart = (e, productId, title) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCart(productId);
    toast.success(`🛒 ${title} added to cart`);
  };

  return (
    <div className="container bg-light py-4 my-3 rounded shadow-sm">
      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />

      <div className="row align-items-start">
        {/* LEFT SIDE: Images + Buttons */}
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
                alt={`thumb-${index}`}
                className={`border rounded ${mainImage === img ? "border-primary" : ""}`}
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
            <button className="btn btn-primary px-4">Buy Now</button>
            <button
              className="btn btn-outline-warning px-4"
              onClick={(e) => handleCart(e, product.id, product.title)}
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: Details */}
        <div className="col-md-7">
          <h2>{product.title}</h2>
          <p><strong>Rating:</strong> ⭐ {product.rating}</p>
          <p><strong>Price:</strong> ₹{product.price}</p>
          <p><strong>Discount:</strong> 10% off</p>

          {/* Quantity Controller */}
          <div className="my-3">
            <strong>Quantity: </strong>
            <button
              className="btn btn-sm btn-outline-secondary mx-2"
              onClick={() => changeQuantity(product.id, -1)}
            >
              -
            </button>
            <span>{product.quantity || 1}</span>
            <button
              className="btn btn-sm btn-outline-secondary mx-2"
              onClick={() => changeQuantity(product.id, 1)}
            >
              +
            </button>
          </div>

          {/* Size Selection */}
          <div className="my-3">
            <strong>Size: </strong>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`btn btn-sm ${
                    selectedSize === size ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <hr />
          <h5>Description:</h5>
          <ul>
            <li>Stylish and comfortable</li>
            <li>All-weather design</li>
            <li>Unparalleled essential</li>
          </ul>
        </div>
      </div>

      {/* Related Products */}
      <hr className="my-4" />
      <p className="fs-5 mb-3">You may also like these</p>

      <div className="row">
        {products.map((p) => (
          <div
            key={p.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 my-2 d-flex justify-content-center"
          >
            <Link
              to={`/product-detail/${p.id}`}
              className="card text-decoration-none text-dark shadow-sm border-0"
              style={{ width: "100%", maxWidth: "250px" }}
            >
              <img
                src={p.images?.[0] || "https://placehold.co/250x250?text=No+Image"}
                alt={p.title}
                className="card-img-top rounded-top"
                style={{ objectFit: "cover", height: "200px" }}
              />
              <div className="card-body text-center">
                <h6 className="card-title mb-1">{p.title}</h6>
                <p className="text-muted small mb-2">₹{p.price}</p>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={(e) => handleCart(e, p.id, p.title)}
                  >
                    🛒
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
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
    </div>
  );
}
