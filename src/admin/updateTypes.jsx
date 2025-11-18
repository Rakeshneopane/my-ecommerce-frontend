import { useState, useEffect } from "react";

export default function UpdateTypes() {
  const API = import.meta.env.VITE_BASE_URI;

  const [sections, setSections] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeSection, setNewTypeSection] = useState("");  // <-- FIXED

  // Fetch sections + types
  async function loadData() {
    try {
      setLoading(true);

      const secRes = await fetch(`${API}/sections`);
      const typeRes = await fetch(`${API}/types`);

      const secData = await secRes.json();
      const typeData = await typeRes.json();

      setSections(secData.sections || []);
      setTypes(typeData.types || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load types");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Update type image
  async function updateTypeImage(typeId, image) {
    try {
      await fetch(`${API}/types/${typeId}/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      alert("Type image updated!");
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to update type image");
    }
  }

  // Create new type
  async function createType() {
    if (!newTypeName.trim()) return alert("Name is required");
    if (!newTypeSection) return alert("Select a section");

    try {
      await fetch(`${API}/types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTypeName,
          section: newTypeSection,
          images: [""],
        }),
      });

      alert("Type created!");
      setNewTypeName("");
      setNewTypeSection("");
      loadData();
    } catch (err) {
      console.error(err);
      alert("Create failed");
    }
  }

  if (loading) return <p>Loading types…</p>;

  return (
    <div className="container my-4">
      <h2>Manage Types</h2>

      {/* Create type */}
      <div className="card p-3 mb-4">
        <h5>Create New Type</h5>

        <input
          className="form-control my-2"
          placeholder="Type name"
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
        />

        <select
          className="form-control my-2"
          value={newTypeSection}
          onChange={(e) => setNewTypeSection(e.target.value)}
        >
          <option value="">Select Section</option>
          {sections.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <button className="btn btn-primary" onClick={createType}>
          Create Type
        </button>
      </div>

      {/* List types grouped by section */}
      {sections.map((sec) => {
        const filtered = types.filter(
          (t) => t.section === sec._id || t.section?._id === sec._id
        );

        return (
          <div key={sec._id} className="mb-4">
            <h4>{sec.name}</h4>
            <div className="row">
              {filtered.map((t) => (
                <div key={t._id} className="col-md-4 mb-3">
                  <div className="card p-3">
                    <h6>{t.name}</h6>

                    <img
                      src={t.images?.[0] || "https://placehold.co/200x200"}
                      className="img-fluid border rounded mb-2"
                    />

                    <input
                      className="form-control mb-2"
                      placeholder="New image URL"
                      id={`type-img-${t._id}`}
                    />

                    <button
                      className="btn btn-success"
                      onClick={() =>
                        updateTypeImage(
                          t._id,
                          document.getElementById(`type-img-${t._id}`).value
                        )
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
      })}
    </div>
  );
}
