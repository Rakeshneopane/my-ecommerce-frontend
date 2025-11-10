import { useState } from "react";
import { useProductContext } from "../contexts/productContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const { products, toggleWishList, toggleCart, changeQuantity } = useProductContext();
  const cartItems = products.filter((p) => p.isInCart);
  const totalItems = cartItems.reduce((sum, p) => sum + (p.quantity || 1), 0);
  const totalPrice = cartItems.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0);

  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);

  async function handlePlaceOrder() {
    const userId = localStorage.getItem("userId");
    const addressId = localStorage.getItem("addressId");

    if (!userId || !addressId) {
      toast.warn("⚠️ Please create a user and add an address before placing an order.");
      return;
    }

    if (cartItems.length === 0) {
      toast.info("🛒 Your cart is empty!");
      return;
    }

    setLoading(true);
    setOrderStatus(null);

    try {
      const orderData = {
        user: userId,
        item: cartItems.map((item) => ({
          _id: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity || 1,
          size: item.selectedSize || item.size || "Not selected",
        })),
        address: addressId,
        payment: {
          method: "cod",
          status: "pending",
        },
      };

      console.log("Sending orderData:", orderData);

      const response = await fetch("https://my-ecommerce-eta-ruby.vercel.app/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error(`Failed to place order (${response.status})`);

      const result = await response.json();
      console.log("Order placed:", result);

      setOrderStatus("success");
      toast.success("🎉 Order placed successfully!");

      // Empty the cart after successful order
      cartItems.forEach((item) => toggleCart(item.id));
    } catch (err) {
      console.error("Order placement error:", err);
      setOrderStatus("error");
      toast.error("❌ Failed to place order. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const handleRemove = (id, title) => {
    toggleCart(id);
    toast.info(`🗑️ Removed ${title} from cart`);
  };

  const handleMoveToWishlist = (id, title) => {
    toggleWishList(id);
    toast.success(`❤️ Moved ${title} to wishlist`);
  };

  return (
    <div className="container bg-light py-4 my-3 rounded shadow-sm">
      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />

      <h2 className="mb-4">🛒 Your Cart</h2>
      <div className="row g-4">
        {/* LEFT SIDE - Cart Items */}
        <div className="col-lg-8">
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <h5>Your cart is empty.</h5>
              <p className="text-muted">Add some items to get started!</p>
            </div>
          ) : (
            cartItems.map((product) => (
              <div
                key={product.id}
                className="card mb-3 shadow-sm border-0 p-3 d-flex flex-row align-items-center"
              >
                <img
                  src={product.images?.[0] || "https://placehold.co/100x100?text=No+Image"}
                  alt={product.title}
                  className="rounded me-3 border"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />

                <div className="flex-grow-1">
                  <h6 className="mb-1">{product.title}</h6>
                  <p className="text-muted small mb-1">₹{product.price}</p>

                  {/* Size Display (reliable) */}
                  <p className="text-muted small mb-1">
                    <strong>Size:</strong> {product.selectedSize || product.size || "Not selected"}
                  </p>

                  {/* Quantity controls */}
                  <div className="d-flex align-items-center mb-2">
                    <strong className="me-2">Qty:</strong>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => changeQuantity(product.id, -1)}
                    >
                      -
                    </button>
                    <span className="mx-2">{product.quantity || 1}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => changeQuantity(product.id, 1)}
                    >
                      +
                    </button>
                  </div>

                  {/* Cart + Wishlist actions */}
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => handleRemove(product.id, product.title)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleMoveToWishlist(product.id, product.title)}
                      className="btn btn-sm btn-outline-warning"
                    >
                      ❤️ Move to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT SIDE - Price Summary */}
        {cartItems.length > 0 && (
          <div className="col-lg-4">
            <div className="card p-3 shadow-sm border-0">
              <h5>Price Details</h5>
              <hr />
              <p className="d-flex justify-content-between mb-1">
                <span>Items in Cart:</span> <strong>{totalItems}</strong>
              </p>
              <p className="d-flex justify-content-between mb-1">
                <span>Total Price:</span> <strong>₹{totalPrice}</strong>
              </p>
              <p className="d-flex justify-content-between mb-1">
                <span>Discount:</span> <span className="text-success">₹0</span>
              </p>
              <p className="d-flex justify-content-between mb-1">
                <span>Delivery:</span> <span className="text-success">Free</span>
              </p>
              <hr />
              <h6 className="d-flex justify-content-between">
                <span>Total Amount:</span> <strong>₹{totalPrice}</strong>
              </h6>

              <button
                className="btn btn-primary mt-3 w-100"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              {orderStatus === "success" && (
                <p className="text-success mt-2 text-center fw-semibold">
                  ✅ Order placed successfully!
                </p>
              )}
              {orderStatus === "error" && (
                <p className="text-danger mt-2 text-center fw-semibold">
                  ❌ Error placing order.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
