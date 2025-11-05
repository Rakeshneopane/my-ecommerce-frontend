import { useProductContext } from "../contexts/productContext";

export default function WishList() {
  const { products, toggleWishList, toggleCart } = useProductContext();

  const wishListItems = products.filter(p => p.isOnWishList);

  return (
    <div className="container py-2">
      <h2>My Wish List</h2>

      {wishListItems.length === 0 ? (
        <p className="text-muted">Your wishlist is empty 💔</p>
      ) : (
        <div className="row">
          {wishListItems.map(product => (
            <div key={product.id} className="col-4">
              <div className="card my-2 p-2">
                <img
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <p className="mt-2 fw-bold">{product.title}</p>
                <p>₹{product.price}</p>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => toggleWishList(product.id)}
                >
                  Remove
                </button>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => toggleCart(product.id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
