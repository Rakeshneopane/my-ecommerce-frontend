import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductContext } from "../contexts/productContext";

export default function Home() {
  const { sectionTypeMap } = useProductContext();

  // Sections (keys)
  const sections = Object.keys(sectionTypeMap || {});

  // Flatten all types into array { name, image } and dedupe by name
  const typesMap = {};
  sections.forEach((sec) => {
    const typesArr = sectionTypeMap[sec].types || [];
    typesArr.forEach((t) => {
      if (!typesMap[t.name]) typesMap[t.name] = t.image || "https://placehold.co/400";
    });
  });
  const types = Object.entries(typesMap).map(([name, image]) => ({ name, image }));

  // Helper fallbacks
  function getSectionImage(name) {
    return sectionTypeMap?.[name]?.image || "https://placehold.co/600x400?text=No+Image";
  }

  function getTypeImage(typeName) {
    return typesMap[typeName] || "https://placehold.co/400x400";
  }

  const carouselImages = [
    "https://marketplace.canva.com/EAFqA4K13MM/1/0/1600w/canva-69gdt76LZg0.jpg",
    "https://marketplace.canva.com/EAGr1G0eTn0/1/0/640w/canva-8_PjovReKxY.jpg",
    "https://marketplace.canva.com/EAG1qyyU8vE/1/0/1200w/canva-_oN-9X2Sn4Y.jpg",
    "https://marketplace.canva.com/EAGZdjo91A4/1/0/640w/canva-gcYvMNoXJQk.jpg"
  ];

  useEffect(() => {
    const el = document.querySelector("#mainCarousel");
    if (el && window.bootstrap) {
      new window.bootstrap.Carousel(el);
    }
  }, []);

 return (
  <div className="container py-4">

    {/* SECTIONS HORIZONTAL SCROLL */}
    <h5 className="fw-bold mb-3">Shop by Section</h5>

    <div
      className="d-flex overflow-auto gap-3 mb-4 pb-2 align-items-stretch"
      style={{ scrollbarWidth: "thin" }}
    >
      {sections.map((sec) => (
        <Link
          key={sec}
          to={`/products?section=${encodeURIComponent(sec)}`}
          className="text-decoration-none text-dark mx-auto"
          style={{ width: 120, flex: "0 0 auto" }}
        >
          <div className="card border-0 shadow-sm rounded-3 hover-shadow-sm">
            <div className="ratio ratio-1x1">
              <img
                src={getSectionImage(sec)}
                alt={sec}
                className="img-fluid rounded-3"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <small className="fw-semibold mt-2 d-block text-center">{sec}</small>
        </Link>
      ))}

      {sections.length === 0 && (
        <div className="text-muted">No sections available yet.</div>
      )}
    </div>

    {/* CAROUSEL */}
    <div
      id="mainCarousel"
      className="carousel slide mb-4 rounded-4 shadow"
      data-bs-ride="carousel"
      style={{ overflow: "hidden" }}
    >
      <div className="carousel-inner">
        {carouselImages.map((url, i) => (
          <div className={`carousel-item ${i === 0 ? "active" : ""}`} key={i}>
            <Link to="/products" className="text-decoration-none text-dark">
              <img
                src={url}
                className="d-block w-100"
                alt={`slide-${i}`}
                style={{
                  height: "420px",
                  objectFit: "cover",
                  filter: "brightness(92%)",
                }}
              />
            </Link>
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#mainCarousel"
        data-bs-slide="prev"
        style={{ width: "60px" }}
      >
        <span className="carousel-control-prev-icon bg-dark rounded-circle p-2 opacity-75"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#mainCarousel"
        data-bs-slide="next"
        style={{ width: "60px" }}
      >
        <span className="carousel-control-next-icon bg-dark rounded-circle p-2 opacity-75"></span>
      </button>
    </div>

    {/* TYPES HORIZONTAL SCROLL */}
    <h5 className="fw-bold mb-2">Browse by Type</h5>

    <div className="d-flex overflow-auto gap-3 pb-2 mb-4" style={{ scrollbarWidth: "thin" }}>
      {types.map((t) => (
        <Link
          key={t.name}
          to={`/products?type=${encodeURIComponent(t.name)}`}
          className="text-decoration-none text-center"
          style={{ width: 100, flex: "0 0 auto" }}
        >
          <div className="card border-0 shadow-sm rounded-3 hover-shadow-sm">
            <div className="ratio ratio-1x1">
              <img
                src={getTypeImage(t.name)}
                alt={t.name}
                className="img-fluid rounded-3"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          <small
            className="d-block mt-2 fw-semibold text-dark"
            style={{ whiteSpace: "nowrap" }}
          >
            {t.name}
          </small>
        </Link>
      ))}

      {types.length === 0 && <div className="text-muted">No types to show.</div>}
    </div>

    {/* SUMMER / WINTER COLLECTIONS */}
    <div className="row g-3">
      <div className="col-12 col-md-6">
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden hover-shadow-lg">
          <Link to="/products" className="text-decoration-none text-dark">
            <img
              src="https://img.freepik.com/premium-psd/summer-banner-design_656675-164.jpg"
              className="img-fluid w-100"
              style={{ height: 300, objectFit: "cover" }}
            />
            <div className="card-body text-center">
              <h6 className="mb-0">Summer Collection</h6>
            </div>
          </Link>
        </div>
      </div>

      <div className="col-12 col-md-6">
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden hover-shadow-lg">
          <Link to="/products" className="text-decoration-none text-dark">
            <img
              src="https://img.freepik.com/premium-psd/winter-clothes-sale-social-media-design-instagram-facebook_496781-634.jpg"
              className="img-fluid w-100"
              style={{ height: 300, objectFit: "cover" }}
            />
            <div className="card-body text-center">
              <h6 className="mb-0">Winter Collection</h6>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </div>
);
}
