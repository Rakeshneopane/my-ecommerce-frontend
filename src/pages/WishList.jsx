import { useProductContext } from "../contexts/productContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WishList() {
  const { products, toggleWishList, toggleCart } = useProductContext();
  const wishListItems = products.filter(p => p.isOnWishList);

  // handlers with toasts
  const handleRemove = (id, title) => {
    toggleWishList(id);
    toast.info(`❌ Removed "${title}" from wishlist`);
  };

  const handleAddToCart = (id, title) => {
    toggleCart(id);
    toast.success(`🛒 Added "${title}" to cart`);
  };

  return (
    <div className="container py-4">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />

      <h2 className="mb-4">My Wish List</h2>

      {wishListItems.length === 0 ? (
        <p className="text-muted">Your wishlist is empty 💔</p>
      ) : (
        <div className="row g-4">
          {wishListItems.map(product => (
            <div key={product.id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 p-3 h-100 d-flex flex-column justify-content-between">
                <div className="text-center">
                  <img
                    src={product.images?.[0] || "https://placehold.co/300x200?text=No+Image"}
                    alt={product.title}
                    className="img-fluid rounded"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>

                <div className="mt-3">
                  <h5 className="fw-bold text-truncate">{product.title}</h5>
                  <p className="text-secondary mb-1">
                    Rating: ⭐ {product.rating || "4.0"}
                  </p>
                  <p className="fw-semibold fs-5">₹{product.price}</p>
                </div>

                <div className="mt-auto d-flex justify-content-between gap-2">
                  <button
                    className="btn btn-outline-danger w-50"
                    onClick={() => handleRemove(product.id, product.title)}
                  >
                    ❤️ Remove
                  </button>
                  <button
                    className="btn btn-warning w-50"
                    onClick={() => handleAddToCart(product.id, product.title)}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
