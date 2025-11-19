import { useUserContext } from "../contexts/userContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { user, saveUser, logout } = useUserContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    gender: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        gender: user.gender || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSelectAddress = (addressId) => {
    localStorage.setItem("addressId", addressId);
    setSuccess("Address selected!");
    setTimeout(() => setSuccess(null), 1200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "https://my-ecommerce-eta-ruby.vercel.app/api/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();

      saveUser(data.user);
      localStorage.setItem("userId", data.user._id);
      setSuccess("Profile created!");
    } catch (err) {
      setError("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userId");
    localStorage.removeItem("addressId");
    navigate("/login");
  };

  return (
    <div className="container py-3">
      <div className="card shadow-sm p-3">

        {user ? (
          <>
            <h4 className="fw-bold mb-3">My Profile</h4>

            {/* USER INFO */}
            <div className="card p-3 mb-3 shadow-sm">
              <strong>{user.name} {user.surname}</strong>
              <p className="mb-1">Gender: {user.gender}</p>
              <p className="mb-1">Email: {user.email}</p>
              <p className="mb-0">Phone: {user.phone}</p>
            </div>

            {/* ADDRESS LIST */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="fw-bold">My Addresses</h5>
              <div className="d-flex gap-2">
                <Link className="btn btn-sm btn-primary" to="/address">➕ Add</Link>
                <button className="btn btn-sm btn-danger" onClick={handleLogout}>Logout</button>
              </div>
            </div>

            <div>
              {user.addresses?.map((address) => {
                const isSelected = localStorage.getItem("addressId") === address._id;
                return (
                  <div
                    key={address._id}
                    className={`card p-3 mb-2 shadow-sm ${
                      isSelected ? "border border-success" : "border"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSelectAddress(address._id)}
                  >
                    <div className="d-flex align-items-start">
                      <input
                        type="radio"
                        className="me-3 mt-1"
                        name="address"
                        checked={isSelected}
                        onChange={() => handleSelectAddress(address._id)}
                        onClick={(e) => e.stopPropagation()}
                      />

                      <div className="flex-grow-1">
                        <strong className="d-block">{address.addressType}</strong>

                        <p className="mb-1">{address.area}</p>
                        <p className="mb-1">{address.city}, {address.state} - {address.pincode}</p>
                        {address.landmark && <p className="mb-1">Landmark: {address.landmark}</p>}
                        {address.alternatePhone && <p className="mb-1">Alt Phone: {address.alternatePhone}</p>}

                        <Link
                          to={`/address?id=${address._id}`}
                          className="btn btn-sm btn-outline-primary mt-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Edit
                        </Link>

                      </div>
                    </div>

                    <small className="text-muted">
                      {isSelected ? "✔ Selected for orders" : "Tap to select"}
                    </small>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* USER CREATION FORM */
          <form onSubmit={handleSubmit}>
            <h4 className="fw-bold mb-3">Create Profile</h4>

            <input className="form-control mb-2" placeholder="First Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />

            <input className="form-control mb-2" placeholder="Last Name"
              value={formData.surname}
              onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))} />

            <label className="fw-semibold">Gender</label>
            <div className="mb-2">
              <label className="me-3">
                <input type="radio" name="gender" value="male"
                  checked={formData.gender === "male"}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))} /> Male
              </label>

              <label>
                <input type="radio" name="gender" value="female"
                  checked={formData.gender === "female"}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))} /> Female
              </label>
            </div>

            <input className="form-control mb-2" placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} />

            <input className="form-control mb-3" placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} />

            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Saving..." : "Create Profile"}
            </button>

            {success && <p className="text-success mt-2">{success}</p>}
            {error && <p className="text-danger mt-2">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
