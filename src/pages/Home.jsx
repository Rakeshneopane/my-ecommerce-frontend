// src/pages/Home.jsx
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

  return (
    <div className="container py-4">

      {/* SECTIONS GRID */}
      <h5 className="fw-bold mb-3">Shop by Section</h5>
      <div className="row g-3 mb-4">
        {sections.map((sec) => (
          <div className="col-6 col-md-3 col-lg-2" key={sec}>
            <Link to={`/products?section=${encodeURIComponent(sec)}`} className="text-decoration-none text-dark">
              <div className="card border-0 shadow-sm h-100">
                <div className="ratio ratio-1x1">
                  <img
                    src={getSectionImage(sec)}
                    alt={sec}
                    className="img-fluid rounded object-fit-cover"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="card-body p-2 text-center">
                  <small className="fw-semibold">{sec}</small>
                </div>
              </div>
            </Link>
          </div>
        ))}
        {sections.length === 0 && (
          <div className="col-12">
            <p className="text-muted">No sections available yet.</p>
          </div>
        )}
      </div>

      {/* CAROUSEL */}
      <div id="mainCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
        <div className="carousel-inner rounded-4 shadow" style={{ overflow: "hidden" }}>
          {carouselImages.map((url, i) => (
            <div className={`carousel-item ${i === 0 ? "active" : ""}`} key={i}>
              <Link to={`/products`} className="text-decoration-none text-dark">
              <img
                src={url}
                className="d-block w-100"
                alt={`slide-${i}`}
                style={{ height: "420px", objectFit: "cover" }}
              />
              </Link>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* TYPES HORIZONTAL SCROLL */}
      <h5 className="fw-bold mb-2">Browse by Type</h5>
      <div className="d-flex overflow-auto gap-3 py-2 mb-4" style={{ paddingBottom: 6 }}>
        {types.map((t) => (
          <Link
            key={t.name}
            to={`/products?type=${encodeURIComponent(t.name)}`}
            className="text-decoration-none text-center"
            style={{ width: 100, flex: "0 0 auto" }}
          >
            <div className="card border-0 shadow-sm">
              <div className="ratio ratio-1x1">
                <img
                  src={getTypeImage(t.name)}
                  alt={t.name}
                  className="img-fluid rounded object-fit-cover"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <small className="text-dark d-block mt-1 fw-semibold text-center" style={{ whiteSpace: "nowrap" }}>
              {t.name}
            </small>
          </Link>
        ))}

        {types.length === 0 && (
          <div className="text-muted">No types to show.</div>
        )}
      </div>

      {/* SUMMER / WINTER COLLECTIONS */}
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="card border-0 rounded shadow-sm overflow-hidden">
            <Link to={`/products`} className="text-decoration-none text-dark">
            <img
              src="https://img.freepik.com/premium-psd/summer-banner-design_656675-164.jpg"
              alt="summer"
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
          <div className="card border-0 rounded shadow-sm overflow-hidden">
            <Link to={`/products`} className="text-decoration-none text-dark">
            <img
              src="https://img.freepik.com/premium-psd/winter-clothes-sale-social-media-design-instagram-facebook_496781-634.jpg"
              alt="winter"
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
