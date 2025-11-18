import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const API = import.meta.env.VITE_BASE_URI;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/products`);
        const json = await res.json();
        setProducts(json.data || []);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [API]);

  if (loading) return <p className="p-5">Loading products...</p>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>

        <div className="d-flex gap-2">
          <Link to="/update-sections" className="btn btn-outline-secondary">
            ⚙️ Update Sections
          </Link>

          <Link to="/update-types" className="btn btn-outline-secondary">
            🧩 Update Types
          </Link>

          <Link to="/admin/create-product" className="btn btn-success">
            ➕ Create Product
          </Link>
        </div>
      </div>

      <div className="table-responsive shadow-sm">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Product</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Section</th>
              <th>Section Img</th>
              <th>Type</th>
              <th>Type Img</th>
              <th style={{ width: "100px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <img
                    src={p.images?.[0] || "https://placehold.co/60x60"}
                    className="rounded"
                    width="60"
                  />
                </td>

                <td>{p.title}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>

                {/* Section */}
                <td>{p.section?.name || "-"}</td>
                <td>
                  <img
                    src={p.section?.images?.[0] || "https://placehold.co/50x50"}
                    width="50"
                    className="rounded"
                  />
                </td>

                {/* Types */}
                <td>{p.types?.name || "-"}</td>
                <td>
                  <img
                    src={p.types?.images?.[0] || "https://placehold.co/50x50"}
                    width="50"
                    className="rounded"
                  />
                </td>

                <td>
                  <Link
                    to={`/admin/edit-product/${p._id}`}
                    className="btn btn-sm btn-outline-primary w-100"
                  >
                    ✏️ Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <p className="text-center mt-5 text-muted">No products found.</p>
      )}
    </div>
  );
}
