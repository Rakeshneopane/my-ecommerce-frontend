import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function CreateProduct() {
  const { productId } = useParams(); // for edit mode
  const isEdit = Boolean(productId);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    rating: "",
    sellerId: "",
    stock: "",
    section: "",
    types: "",
    images: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 🧩 new states
  const [addedCount, setAddedCount] = useState(0);
  const [recentlyAdded, setRecentlyAdded] = useState([]);

  console.log("Backend URL:", import.meta.env.VITE_BASE_URI);
  
  // Fetch existing product if editing
  useEffect(() => {
    let mounted = true;
    const loadProduct = async () => {
      if (!isEdit) return;
      setFetching(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URI}/api/products/${productId}`
        );
        if (!res.ok) throw new Error(`Failed to fetch product (${res.status})`);
        const json = await res.json();
        const p = json.data;
        if (!mounted) return;

        setFormData({
          title: p.title || "",
          price: p.price != null ? String(p.price) : "",
          category: p.category || "",
          rating: p.rating != null ? String(p.rating) : "",
          sellerId: p.sellerId || "",
          stock: p.stock != null ? String(p.stock) : "",
          section: p.section?.name || "",
          types: p.types?.name || "",
          images: Array.isArray(p.images) ? p.images.join(", ") : "",
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load product.");
      } finally {
        if (mounted) setFetching(false);
      }
    };

    loadProduct();
    return () => {
      mounted = false;
    };
  }, [isEdit, productId]);

  // 🧩 handleSubmit updated
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      title: formData.title,
      price: Number(formData.price),
      category: formData.category,
      rating: Number(formData.rating),
      sellerId: formData.sellerId,
      stock: Number(formData.stock),
      section: { name: formData.section },
      types: { name: formData.types },
      images:
        formData.images
          .split(",")
          .map((img) => img.trim())
          .filter((img) => img !== "") || [],
    };

    try {
      const url = isEdit
        ? `${import.meta.env.VITE_BASE_URI}/api/products/${productId}`
        : `${import.meta.env.VITE_BASE_URI}/api/create-products`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => null);
        throw new Error(`Server responded ${response.status} ${text || ""}`);
      }

      const data = await response.json();
      console.log("Server response:", data);

      const newProducts = data.products?.map((p) => p.product) || [];

      // increment counter
      setAddedCount((prev) => prev + newProducts.length);

      // store them for display
      setRecentlyAdded((prev) => [...prev, ...newProducts]);

      if (isEdit) {
        setSuccess("✅ Product updated successfully.");
        } else {
          setAddedCount((prev) => prev + newProducts.length);
          setRecentlyAdded((prev) => [...prev, ...newProducts]);
          setSuccess(`✅ Added ${addedCount + newProducts.length} product(s) so far.`);
      }

      // clear form for next entry
      setFormData({
        title: "",
        price: "",
        category: "",
        rating: "",
        sellerId: "",
        stock: "",
        section: "",
        types: "",
        images: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">
        {isEdit ? "Update Product" : "Create New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
        {fetching && <p>Loading product data...</p>}
        

        {/* Product Form */}
        <div className="mb-3">
          <label className="form-label">Product Title</label>
          <input
            type="text"
            className="form-control"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Section</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Men, Women, Electronics"
            value={formData.section}
            onChange={(e) => setFormData((prev) => ({ ...prev, section: e.target.value }))}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Shoes, Mobile, Jacket"
            value={formData.types}
            onChange={(e) => setFormData((prev) => ({ ...prev, types: e.target.value }))}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Seller ID</label>
          <input
            type="text"
            className="form-control"
            value={formData.sellerId}
            onChange={(e) => setFormData((prev) => ({ ...prev, sellerId: e.target.value }))}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input
            type="number"
            className="form-control"
            value={formData.stock}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Rating</label>
          <input
            type="number"
            className="form-control"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Images (comma-separated URLs)</label>
          <input
            type="text"
            className="form-control"
            placeholder="https://img1.com, https://img2.com"
            value={formData.images}
            onChange={(e) => setFormData((prev) => ({ ...prev, images: e.target.value }))}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100 mt-3 mb-2" disabled={loading}>
          {loading
            ? isEdit
              ? "Updating..."
              : "Submitting..."
            : isEdit
            ? "Update Product"
            : "Create Product"}
        </button>
        {error && <div className="alert alert-danger mx-2">{error}</div>}
        {success && <div className="alert alert-success mx-2">{success}</div>}
      </form>

      {/* 🧩 Summary & recently added list */}
      {addedCount > 0 && (
        <div className="mt-4">
          <p className="fw-semibold text-success">
            ✅ Total products added in this session: {addedCount}
          </p>

          {recentlyAdded.length > 0 && (
            <div className="row">
              {recentlyAdded.map((p, i) => (
                <div key={i} className="col-md-4 mb-3">
                  <div className="card shadow-sm">
                    {p.images?.[0] && (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="card-img-top"
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body">
                      <h6 className="card-title">{p.title}</h6>
                      <p className="mb-0">₹{p.price}</p>
                      <small className="text-muted">{p.category}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
