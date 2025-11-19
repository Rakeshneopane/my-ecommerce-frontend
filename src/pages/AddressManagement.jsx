import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";

export default function AddressManagement() {
  const { user, saveUser } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const editId = params.get("id");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [addressData, setAddressData] = useState({
    area: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    alternatePhone: "",
    addressType: "",
  });

  // if editing, prefill
  useEffect(() => {
    if (editId && user?.addresses) {
      const found = user.addresses.find(a => a._id === editId);
      if (found) {
        setAddressData({
          area: found.area || "",
          city: found.city || "",
          state: found.state || "",
          pincode: found.pincode || "",
          landmark: found.landmark || "",
          alternatePhone: found.alternatePhone || "",
          addressType: found.addressType || found.type || "",
        });
      }
    }
  }, [editId, user]);

  const handleChange = (field, value) => {
    setAddressData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!user?._id) {
      setError("Create a user first.");
      setLoading(false);
      return;
    }

    try {
      const url = editId
        ? `https://my-ecommerce-eta-ruby.vercel.app/api/users/${user._id}/addresses/${editId}`
        : `https://my-ecommerce-eta-ruby.vercel.app/api/users/${user._id}/addresses`;

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${txt}`);
      }

      const data = await res.json();

      // Update user in context so UI refreshes
      // When editing, replace the address; when adding, append
      let updatedAddresses = Array.isArray(user?.addresses) ? [...user.addresses] : [];
      if (editId) {
        updatedAddresses = updatedAddresses.map(a => (a._id === editId ? data.address : a));
      } else {
        updatedAddresses.push(data.address);
      }

      saveUser({ ...user, addresses: updatedAddresses });
      localStorage.setItem("addressId", data.address._id);

      setSuccess(editId ? "Address updated." : "Address added.");
      setTimeout(() => {
        setSuccess(null);
        navigate("/user");
      }, 900);
    } catch (err) {
      console.error(err);
      setError("Failed to save address. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-3">
      <div className="card p-3 shadow-sm">
        <h4 className="mb-3">{editId ? "Edit Address" : "Add Address"}</h4>

        <form onSubmit={handleSubmit}>
          <textarea
            className="form-control mb-2"
            placeholder="Address (area / street)"
            value={addressData.area}
            required
            onChange={(e) => handleChange("area", e.target.value)}
          />
          <input
            className="form-control mb-2"
            placeholder="City / District"
            value={addressData.city}
            required
            onChange={(e) => handleChange("city", e.target.value)}
          />

          <select
            className="form-control mb-2"
            value={addressData.state}
            onChange={(e) => handleChange("state", e.target.value)}
            required
          >
            <option value="">Select State</option>
            <option>Assam</option>
            <option>Manipur</option>
            <option>Mizoram</option>
            <option>Meghalaya</option>
            <option>Nagaland</option>
            <option>Tripura</option>
          </select>

          <input
            className="form-control mb-2"
            placeholder="Pincode"
            value={addressData.pincode}
            required
            onChange={(e) => handleChange("pincode", e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Landmark (optional)"
            value={addressData.landmark}
            onChange={(e) => handleChange("landmark", e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Alternate phone (optional)"
            value={addressData.alternatePhone}
            onChange={(e) => handleChange("alternatePhone", e.target.value)}
          />

          <div className="mb-3">
            <label className="me-3">
              <input
                type="radio"
                name="addressType"
                value="Home"
                checked={addressData.addressType === "Home"}
                onChange={(e) => handleChange("addressType", e.target.value)}
                required
              />{" "}Home
            </label>
            <label>
              <input
                type="radio"
                name="addressType"
                value="Work"
                checked={addressData.addressType === "Work"}
                onChange={(e) => handleChange("addressType", e.target.value)}
              />{" "}Work
            </label>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary flex-fill" type="submit" disabled={loading}>
              {loading ? "Saving..." : editId ? "Update Address" : "Save Address"}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/user")}
            >
              Cancel
            </button>
          </div>

          {success && <p className="text-success mt-2">{success}</p>}
          {error && <p className="text-danger mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
