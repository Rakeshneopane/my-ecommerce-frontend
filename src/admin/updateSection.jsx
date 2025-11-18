import { useState, useEffect } from "react";

export default function UpdateSection() {
  const API = import.meta.env.VITE_BASE_URI;

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSectionName, setNewSectionName] = useState("");

  // Load all sections
  async function loadSections() {
    try {
      setLoading(true);

      const res = await fetch(`${API}/sections`);
      const data = await res.json();

      setSections(data.sections || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSections();
  }, []);

  // Update section image
  async function updateImage(id, image) {
    try {
      if (!image) return alert("Enter an image URL!");

      await fetch(`${API}/sections/${id}/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      alert("Image updated!");
      loadSections();
    } catch (err) {
      console.error(err);
      alert("Failed to update image");
    }
  }

  // Create a new section
  async function createSection() {
    if (!newSectionName.trim()) return alert("Name required");

    try {
      await fetch(`${API}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSectionName,
          images: [""],
        }),
      });

      alert("Section created!");
      setNewSectionName("");
      loadSections();
    } catch (err) {
      console.error(err);
      alert("Failed to create section");
    }
  }

  if (loading) return <p>Loading sections…</p>;

  return (
    <div className="container my-4">
      <h2>Manage Sections</h2>

      {/* Create new section */}
      <div className="card p-3 my-3">
        <h5>Create Section</h5>
        <input
          className="form-control my-2"
          placeholder="Section name"
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={createSection}>
          Create
        </button>
      </div>

      {/* List sections */}
      <div className="row">
        {sections.map((sec) => (
          <div key={sec._id} className="col-md-4 my-2">
            <div className="card p-3">
              <h5>{sec.name}</h5>

              <img
                src={sec.images?.[0] || "https://placehold.co/200x200?text=No+Image"}
                className="img-fluid rounded border mb-2"
              />

              <input
                id={`img-${sec._id}`}
                className="form-control mb-2"
                placeholder="Image URL"
              />

              <button
                className="btn btn-success"
                onClick={() =>
                  updateImage(sec._id, document.getElementById(`img-${sec._id}`).value)
                }
              >
                Save Image
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
