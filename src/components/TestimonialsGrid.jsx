import { useEffect, useState } from "react";

/**
 * TestimonialsGrid
 * - fit: "contain" (default, best for screenshots) or "cover" (square crops)
 * - minCol: minimum column width in the grid
 * - allowZoom: click image to open fullscreen/lightbox
 */
export default function TestimonialsGrid({
  images = [],
  fit = "contain",
  minCol = 360,
  allowZoom = true,
}) {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpenIndex(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!images.length) return null;

  const gridStyle = {
    listStyle: "none",
    margin: "12px",
    padding: "12px",
    display: "grid",
    gap: 12,
    gridTemplateColumns: `repeat(auto-fill, minmax(${minCol}px, 1fr))`,
  };

  const imgStyle =
    fit === "cover"
      ? { width: "100%", height: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 10 }
      : { width: "100%", height: "auto", display: "block", borderRadius: 10 }; // no cropping

  return (
    <>
      <ul aria-label="Testimonials photos" style={gridStyle}>
        {images.map((img, i) => (
          <li
            key={i}
            style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 6, background: "#fff" }}
          >
            <img
              src={img.src}
              alt={img.alt || ""}
              style={imgStyle}
              loading={i > 1 ? "lazy" : "eager"}
              onClick={allowZoom ? () => setOpenIndex(i) : undefined}
              title={allowZoom ? "Click to enlarge" : undefined}
            />
          </li>
        ))}
      </ul>

      {allowZoom && openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenIndex(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.65)",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            cursor: "zoom-out",
            padding: 12,
          }}
        >
          <img
            src={images[openIndex].src}
            alt={images[openIndex].alt || ""}
            style={{
              maxWidth: "95vw",
              maxHeight: "95vh",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              borderRadius: 12,
              boxShadow: "0 10px 40px rgba(0,0,0,.5)",
              background: "#fff",
            }}
          />
          <button
            aria-label="Close"
            onClick={() => setOpenIndex(null)}
            style={{
              position: "fixed",
              top: 12,
              right: 12,
              fontSize: 24,
              width: 44,
              height: 44,
              lineHeight: "44px",
              textAlign: "center",
              borderRadius: 999,
              border: "none",
              background: "rgba(255,255,255,.92)",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
