import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function CreateProduct() {
  const { productId } = useParams();
  const isEdit = Boolean(productId);

  const API = import.meta.env.VITE_BASE_URI;

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

  const [sections, setSections] = useState([]);
  const [types, setTypes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Load Sections + Types
  useEffect(() => {
    async function loadLists() {
      const secRes = await fetch(`${API}/sections`);
      const typeRes = await fetch(`${API}/types`);

      const secData = await secRes.json();
      const typeData = await typeRes.json();

      setSections(secData.sections || []);
      setTypes(typeData.types || []);
    }

    loadLists();
  }, [API]);

  // Load product if editing
  useEffect(() => {
    if (!isEdit) return;

    async function loadProduct() {
      setFetching(true);

      try {
        const res = await fetch(`${API}/api/products/${productId}`);
        const json = await res.json();
        const p = json.data;

        setFormData({
          title: p.title,
          price: p.price,
          category: p.category,
          rating: p.rating,
          sellerId: p.sellerId,
          stock: p.stock,
          section: p.section?._id || "",
          types: p.types?._id || "",
          images: p.images?.join(", ") || "",
        });
      } finally {
        setFetching(false);
      }
    }

    loadProduct();
  }, [API, isEdit, productId]);

  // FILTER TYPES based on section selection
  const filteredTypes = formData.section
    ? types.filter((t) => t.section === formData.section || t.section?._id === formData.section)
    : [];

  // SUBMIT
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: formData.title,
      price: Number(formData.price),
      category: formData.category,
      rating: Number(formData.rating),
      sellerId: formData.sellerId,
      stock: Number(formData.stock),
      section: formData.section, // <-- ID
      types: formData.types,     // <-- ID
      images: formData.images
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i !== ""),
    };

    try {
      const url = isEdit
        ? `${API}/api/products/${productId}`
        : `${API}/api/create-products`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        alert("Error: " + json.error);
      } else {
        alert(isEdit ? "Product updated!" : "Product created!");
      }

      if (!isEdit) {
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
      }
    } catch (err) {
      alert("Failed to submit.");
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="container my-4">
      <h2>{isEdit ? "Edit Product" : "Create Product"}</h2>

      {fetching && <p>Loading product…</p>}

      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light mt-3">

        {/* TITLE */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        {/* PRICE */}
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input type="number"
            className="form-control"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        {/* CATEGORY */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input className="form-control"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </div>

        {/* SECTION (dropdown) */}
        <div className="mb-3">
          <label className="form-label">Section</label>
          <select className="form-control"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value, types: "" })}
            required
          >
            <option value="">Select Section</option>
            {sections.map((sec) => (
              <option key={sec._id} value={sec._id}>
                {sec.name}
              </option>
            ))}
          </select>
        </div>

        {/* TYPES (filtered dropdown) */}
        <div className="mb-3">
          <label className="form-label">Type</label>
          <select className="form-control"
            value={formData.types}
            onChange={(e) => setFormData({ ...formData, types: e.target.value })}
            required
          >
            <option value="">Select Type</option>
            {filteredTypes.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* SELLER */}
        <div className="mb-3">
          <label className="form-label">Seller ID</label>
          <input className="form-control"
            value={formData.sellerId}
            onChange={(e) => setFormData({ ...formData, sellerId: e.target.value })}
            required
          />
        </div>

        {/* STOCK */}
        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input type="number"
            className="form-control"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
          />
        </div>

        {/* RATING */}
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <input type="number" step="0.1" max="5" min="0"
            className="form-control"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            required
          />
        </div>

        {/* IMAGES */}
        <div className="mb-3">
          <label className="form-label">Images (comma separated)</label>
          <input className="form-control"
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            required
          />
        </div>

        <button className="btn btn-success w-100" type="submit" disabled={loading}>
          {loading ? "Saving…" : isEdit ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
}
