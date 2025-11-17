import { useState } from "react";
import { useUserContext } from "../contexts/userContext";

export default function Login() {
  const { saveUser } = useUserContext();

  const [email, setEmail] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        "https://my-ecommerce-eta-ruby.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Login failed");
      }

      saveUser(data.user);
      localStorage.setItem("userId", data.user._id);

      setSuccess("Login successful!");
    } catch (err) {
      setError(err.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container card p-3 my-4">

      <h4 className="mb-3">User Login</h4>

      <form onSubmit={handleLogin} className="form">
        <label className="form-label">
          <p>Email Address</p>
        </label>

        <input
          type="email"
          className="form-control"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {success && <p className="text-success mt-3">{success}</p>}
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}
