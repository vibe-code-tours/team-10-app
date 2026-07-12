export default function ProductDetailLoading() {
  return (
    <div className="container section">
      <div
        style={{
          height: "16px",
          width: "240px",
          borderRadius: "var(--radius-sm)",
          background: "var(--color-bg-secondary)",
          marginBottom: "var(--space-xl)",
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "var(--space-2xl)",
        }}
      >
        <div
          className="card"
          style={{
            aspectRatio: "1",
            background: "var(--color-bg-secondary)",
          }}
        />
        <div>
          <div
            style={{
              height: "32px",
              width: "80%",
              borderRadius: "var(--radius-sm)",
              background: "var(--color-bg-secondary)",
              marginBottom: "var(--space-md)",
            }}
          />
          <div
            style={{
              height: "40px",
              width: "140px",
              borderRadius: "var(--radius-sm)",
              background: "var(--color-bg-secondary)",
              marginBottom: "var(--space-lg)",
            }}
          />
          <div
            style={{
              height: "44px",
              width: "200px",
              borderRadius: "var(--radius-md)",
              background: "var(--color-bg-secondary)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
