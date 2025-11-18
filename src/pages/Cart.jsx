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
    <div className="container bg-light py-4 my-3 rounded shadow-sm">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />

      <h2 className="mb-4">🛒 Your Cart</h2>

      <div className="row g-4">

        {/* LEFT SIDE */}
        <div className="col-lg-8">
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <h5>Your cart is empty.</h5>
              <p className="text-muted">Add some items to get started!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="card mb-3 shadow-sm border-0 p-3 d-flex flex-row align-items-center"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="rounded me-3 border"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />

                <div className="flex-grow-1">
                  <h6 className="mb-1">{item.title}</h6>
                  <p className="text-muted small mb-1">₹{item.price}</p>

                  {/* Size */}
                  <p className="text-muted small mb-1">
                    <strong>Size:</strong> {item.size}
                  </p>

                  {/* Quantity */}
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

                  {/* Remove */}
                  <div>
                    <button
                      onClick={() =>
                        handleRemove(item.productId, item.size, item.title)
                      }
                      className="btn btn-sm btn-outline-danger"
                    >
                      Remove
                    </button>{" "}
                    <button
                      onClick={() =>{
                        toggleWishList(item.productId);
                        handleRemove(item.productId, item.size, item.title);
                      }
                    }
                      className="btn btn-sm btn-outline-warning"
                    >
                      ❤️ Move to WishList
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT SIDE SUMMARY */}
        {cartItems.length > 0 && (
          <div className="col-lg-4">
            <div className="card p-3 shadow-sm border-0">
              <h5>Price Details</h5>
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
