import { useState } from "react";
import axios from "axios";

export default function UpdateSectionImage({ section }) {
  const [image, setImage] = useState(section.images?.[0] || "");
  const [saving, setSaving] = useState(false);

  async function save() {
    try {
      setSaving(true);

      await axios.post(`/sections/${section._id}/image`, { image });

      alert("Section image updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update image.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-3 my-2">
      <h5>{section.name}</h5>

      <img
        src={image || "https://placehold.co/200?text=No+Image"}
        width="150"
        className="rounded mb-2 border"
      />

      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="form-control mb-2"
        placeholder="Paste image URL"
      />

      <button onClick={save} disabled={saving} className="btn btn-primary w-100">
        {saving ? "Saving..." : "Save Image"}
      </button>
    </div>
  );
}
