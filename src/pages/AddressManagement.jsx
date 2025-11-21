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

  // -------------------------
  // PREFILL IF EDITING
  // -------------------------
  useEffect(() => {
    if (editId && user?.addresses) {
      const found = user.addresses.find((a) => a._id === editId);
      if (found) {
        setAddressData({
          area: found.area || "",
          city: found.city || "",
          state: found.state || "",
          pincode: found.pincode || "",
          landmark: found.landmark || "",
          alternatePhone: found.alternatePhone || "",
          addressType: found.addressType || "",
        });
      }
    }
  }, [editId, user]);

  const handleChange = (field, value) => {
    setAddressData((prev) => ({ ...prev, [field]: value }));
  };

  // -------------------------
  // DELETE ADDRESS
  // -------------------------
  const handleDelete = async () => {
   
    try {
      const url = `https://my-ecommerce-eta-ruby.vercel.app/api/users/${user._id}/addresses/${editId}`;

      const res = await fetch(url, { method: "DELETE" });

      if (!res.ok) throw new Error("Delete failed");

      const updated = user.addresses.filter((a) => a._id !== editId);

      saveUser({ ...user, addresses: updated });

      if (localStorage.getItem("addressId") === editId) {
        localStorage.removeItem("addressId");
      }

      navigate("/user");
    } catch (err) {  
      alert("Failed to delete address");
    }
  };

  // -------------------------
  // SUBMIT FORM (ADD / UPDATE)
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user?._id) {
      setError("Create a user first.");
      setLoading(false);
      return;
    }

    try {
      const url = editId
        ? `https://my-ecommerce-eta-ruby.vercel.app/api/users/${user._id}/addresses/${editId}`
        : `https://my-ecommerce-eta-ruby.vercel.app/api/users/${user._id}/addresses`;

      const method = "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      if (!res.ok) throw new Error("Save failed");

      const data = await res.json();

      let updatedAddresses = [...(user.addresses || [])];

      if (editId) {
        updatedAddresses = updatedAddresses.map((a) =>
          a._id === editId ? data.address : a
        );
      } else {
        updatedAddresses.push(data.address);
      }

      saveUser({ ...user, addresses: updatedAddresses });

      localStorage.setItem("addressId", data.address._id);

      navigate("/user");
    } catch (err) {
      setError("Failed to save address.");
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
            onChange={(e) => handleChange("area", e.target.value)}
            required
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
            required
            onChange={(e) => handleChange("state", e.target.value)}
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
            className="form-control mb-3"
            placeholder="Alternate Phone (optional)"
            value={addressData.alternatePhone}
            onChange={(e) =>
              handleChange("alternatePhone", e.target.value)
            }
          />

          {/* ADDRESS TYPE */}
          <div className="mb-3">
            <label className="me-3">
              <input
                type="radio"
                name="addressType"
                value="Home"
                checked={addressData.addressType === "Home"}
                onChange={(e) => handleChange("addressType", e.target.value)}
                required
              />{" "}
              Home
            </label>

            <label>
              <input
                type="radio"
                name="addressType"
                value="Work"
                checked={addressData.addressType === "Work"}
                onChange={(e) => handleChange("addressType", e.target.value)}
              />{" "}
              Work
            </label>
          </div>
            <div className="d-flex flex-column gap-2 mt-3">
                <button
                    className="btn btn-primary btn-sm"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Saving..." : editId ? "Update Address" : "Save Address"}
                </button>
                <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate("/user")}
                >
                    Cancel
                </button>

                {editId && (
                    <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={handleDelete}
                    >
                    Delete Address
                    </button>
                )}
            </div>
          {error && <p className="text-danger mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
