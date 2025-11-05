import { useState } from "react";
import { useProductContext } from "../contexts/productContext";

export default function Cart() {
  const { products, toggleWishList, toggleCart, changeQuantity } = useProductContext();
  const cartItems = products.filter(p => p.isInCart);
  const totalPrice = cartItems.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0);

  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);

  async function handlePlaceOrder() {
  
  const userId = localStorage.getItem("userId");
  const addressId = localStorage.getItem("addressId");

  if(!userId || !addressId){
    alert("Please create a user and add an address before placing an order.");
    return;
  }

  if (cartItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  setLoading(true);
  setOrderStatus(null);

  try {
    const orderData = {
      user: userId,
      item: cartItems.map(item => ({
        _id: item._id, 
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      address: addressId,
      payment: {
        method: "cod",
        status: "pending"
      }
    };

    console.log("Sending orderData:", orderData);
    const response = await fetch("https://my-ecommerce-eta-ruby.vercel.app/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`Failed to place order (${response.status})`);
    }

    const result = await response.json();
    console.log("Order placed:", result);

    setOrderStatus("success");
    alert("Order placed successfully!");

    cartItems.forEach(item => toggleCart(item.id));

  } catch (err) {
    console.error("Order placement error:", err);
    setOrderStatus("error");
    alert("Failed to place order. Please try again later.");

  } finally {
    setLoading(false);
  }
}


  return (
    <div className="container py-4">
      <div className="row">

        
        {cartItems.map(product => (
          <div key={product.id} className="col-6 mb-4">
            <div className="card p-3">
              <img
                src={product.images?.[0]}
                alt={product.title}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <h5 className="mt-2">{product.title}</h5>
              <p>₹{product.price}</p>
              <div>
                Quantity:
                <button onClick={() => changeQuantity(product.id, -1)}>-</button>
                <span className="mx-2">{product.quantity || 1}</span>
                <button onClick={() => changeQuantity(product.id, 1)}>+</button>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => toggleCart(product.id)}
                  className="btn btn-outline-danger btn-sm me-2"
                >
                  Remove from Cart
                </button>
                <button
                  onClick={() => toggleWishList(product.id)}
                  className="btn btn-outline-warning btn-sm"
                >
                  Move to Wish List
                </button>
              </div>
            </div>
          </div>
        ))}

        
        {cartItems.length > 0 && (
          <div className="col-6 card p-3 mt-4">
            <h4>Price Details</h4>
            <hr />
            <p>Total Price: ₹{totalPrice}</p>
            <p>Discount: ₹0</p>
            <p>Delivery: Free</p>
            <hr />
            <h5>Total Amount: ₹{totalPrice}</h5>
            <button
              className="btn btn-primary mt-3"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
            {orderStatus === "success" && (
              <p className="text-success mt-2">Order placed successfully!</p>
            )}
            {orderStatus === "error" && (
              <p className="text-danger mt-2">Error placing order.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
