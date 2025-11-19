import { useState } from "react";
import { useProductContext } from "../contexts/productContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const {
    cartItems,
    removeCartItem,
    changeCartQuantity,
    toggleWishList,
    clearCart
  } = useProductContext();

  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ------------------------
  // PLACE ORDER
  // ------------------------
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
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
        })),
        address: addressId,
        payment: {
          method: "cod",
          status: "pending",
        },
      };

      const response = await fetch(
        "https://my-ecommerce-eta-ruby.vercel.app/api/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) throw new Error(`Failed to place order (${response.status})`);

      setOrderStatus("success");
      toast.success("🎉 Order placed successfully!");
      clearCart();                    
      localStorage.removeItem("cartItems"); 
    } catch (err) {
      console.error("Order error:", err);
      setOrderStatus("error");
      toast.error("❌ Failed to place order. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  // ------------------------
  // REMOVE ITEM
  // ------------------------
  const handleRemove = (productId, size, title) => {
    removeCartItem(productId, size);
    toast.info(`🗑️ Removed ${title} (${size})`);
  };

  return (
  <div className="container py-3">
    <ToastContainer position="top-center" autoClose={2000} hideProgressBar />

    <h3 className="mb-3 text-center">🛒 Your Cart</h3>

    <div className="row g-3">

      {/* LEFT SECTION — CART ITEMS */}
      <div className="col-12 col-lg-8">

        {cartItems.length === 0 ? (
          <div className="text-center py-5 bg-light rounded shadow-sm">
            <h5>Your cart is empty</h5>
            <p className="text-muted">Add products to proceed</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="card border-0 shadow-sm p-3 mb-3"
            >
              <div className="d-flex gap-3 align-items-center">

                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="rounded"
                  style={{ width: "90px", height: "90px", objectFit: "cover" }}
                />

                {/* PRODUCT INFO */}
                <div className="flex-grow-1">
                  <h6 className="mb-1">{item.title}</h6>
                  <p className="text-muted small mb-1">₹{item.price}</p>

                  <p className="text-muted small mb-1">
                    <strong>Size:</strong> {item.size}
                  </p>

                  {/* QUANTITY BUTTONS */}
                  <div className="d-flex align-items-center mb-2">
                    <strong className="me-2">Qty:</strong>

                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        changeCartQuantity(item.productId, item.size, -1)
                      }
                    >
                      -
                    </button>

                    <span className="mx-2">{item.quantity}</span>

                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        changeCartQuantity(item.productId, item.size, 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-danger w-50"
                      onClick={() =>
                        handleRemove(item.productId, item.size, item.title)
                      }
                    >
                      Remove
                    </button>

                    <button
                      className="btn btn-sm btn-outline-warning w-50"
                      onClick={() => {
                        toggleWishList(item.productId);
                        handleRemove(item.productId, item.size, item.title);
                      }}
                    >
                      ❤️ Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* RIGHT SECTION — SUMMARY */}
      {cartItems.length > 0 && (
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm p-3 border-0">

            <h5 className="text-center">Price Details</h5>
            <hr />

            <p className="d-flex justify-content-between mb-1">
              <span>Items:</span> <strong>{totalItems}</strong>
            </p>

            <p className="d-flex justify-content-between mb-1">
              <span>Total Price:</span> <strong>₹{totalPrice}</strong>
            </p>

            <p className="d-flex justify-content-between mb-1">
              <span>Delivery:</span> <span className="text-success">Free</span>
            </p>

            <hr />

            <h6 className="d-flex justify-content-between">
              <span>Total Amount:</span> <strong>₹{totalPrice}</strong>
            </h6>

            <button
              className="btn btn-primary mt-3 w-100 py-2"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            {orderStatus === "success" && (
              <p className="text-success mt-2 text-center fw-semibold">
                ✅ Order placed!
              </p>
            )}

            {orderStatus === "error" && (
              <p className="text-danger mt-2 text-center fw-semibold">
                ❌ Order failed.
              </p>
            )}

          </div>
        </div>
      )}
    </div>
  </div>
);

}
