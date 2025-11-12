import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_BASE_URI || "https://my-ecommerce-eta-ruby.vercel.app";

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/products`);
        if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
        const json = await res.json();
        setProducts(json.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_BASE]);

  return (
    <div className="container py-5">
      <h2 className="mb-4">🧑‍💼 Admin Dashboard</h2>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>All Products ({products.length})</h4>
            <Link to="/admin/create-product" className="btn btn-success">
              ➕ Create New Product
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle shadow-sm">
              <thead className="table-light">
                <tr>
                  <th scope="col">Image</th>
                  <th scope="col">Title</th>
                  <th scope="col">Category</th>
                  <th scope="col">Price (₹)</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Section</th>
                  <th scope="col">Type</th>
                  <th scope="col" style={{ width: "100px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td style={{ width: "80px" }}>
                      <img
                        src={p.images?.[0] || "https://placehold.co/80x80?text=No+Image"}
                        alt={p.title}
                        className="img-fluid rounded"
                      />
                    </td>
                    <td>{p.title}</td>
                    <td>{p.category}</td>
                    <td>{p.price}</td>
                    <td>{p.stock}</td>
                    <td>{p.section?.name || "-"}</td>
                    <td>{p.types?.name || "-"}</td>
                    <td>
                      <Link
                        to={`/admin/edit-product/${p._id}`}
                        className="btn btn-sm btn-outline-primary"
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
            <div className="text-center mt-5 text-muted">
              <p>No products found. Try adding some!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
