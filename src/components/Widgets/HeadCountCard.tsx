
interface HeadCountCardProps {
  title: string;
  value: number;
  description?: string;
  loading?: boolean;
}

export function HeadCountCard({
  title,
  value,
  description,
  loading = false,
}: HeadCountCardProps) {
  if (loading) {
    return (
      <div
        className="dashboard-card"
        style={{
          padding: "1rem",
          backgroundColor: "#ffffff",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="dashboard-card"
      style={{
        padding: "1rem",
        backgroundColor: "#ffffff",
      }}
    >
      <p
        className="card-title"
        style={{
          margin: 0,
        }}
      >
        {title}
      </p>

      <h2
        className="card-value"
        style={{
          margin: "12px 0",
        }}
      >
        {value.toLocaleString()}
      </h2>

      {description && (
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#6b7280",
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export default HeadCountCard;
