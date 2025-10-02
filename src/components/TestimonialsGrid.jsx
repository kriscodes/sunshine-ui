export default function TestimonialsGrid({ images = [] }) {
  if (!images.length) return null;

  return (
    <ul
      aria-label="Testimonials photos"
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
      }}
    >
      {images.map((img, i) => (
        <li key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 6 }}>
          <img
            src={img.src}
            alt={img.alt || ""}
            style={{ width: "100%", height: "auto", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 10 }}
            loading={i > 1 ? "lazy" : "eager"}
          />
        </li>
      ))}
    </ul>
  );
}
