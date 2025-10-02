function toHuman(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function ScheduleList({ items = [] }) {
  return (
    <ul
      aria-label="Bell schedule"
      style={{ listStyle: "none", margin: 0, padding: 0, border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}
    >
      {items.map((it, i) => (
        <li
          key={`${it.label}-${i}`}
          style={{
            display: "grid",
            gridTemplateColumns: "160px 1fr",
            gap: 16,
            padding: "12px 16px",
            borderBottom: i === items.length - 1 ? "0" : "1px dashed #e5e7eb",
          }}
        >
          <div style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
            <time dateTime={it.start}>{toHuman(it.start)}</time>
            {it.end ? <> – <time dateTime={it.end}>{toHuman(it.end)}</time></> : null}
          </div>
          <div>{it.label}</div>
        </li>
      ))}
    </ul>
  );
}
