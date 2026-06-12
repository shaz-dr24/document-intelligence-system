import "./DashboardCards.css";

const CARDS = (total, completed, processing, failed, topDept) => [
  {
    label: "Total Documents",
    value: total,
    color: "blue",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
  },
  {
    label: "Completed",
    value: completed,
    color: "green",
    trend: total > 0 ? `${Math.round((completed / total) * 100)}%` : null,
    trendDir: "up",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  {
    label: "Processing",
    value: processing,
    color: "yellow",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
    ),
  },
  {
    label: "Failed",
    value: failed,
    color: "red",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
  },
  {
    label: "Top Department",
    value: topDept,
    color: "purple",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

export default function DashboardCards({ documents = [] }) {
  const total     = documents.length;
  const completed = documents.filter((d) => d.status === "COMPLETED").length;
  const failed    = documents.filter((d) => d.status === "FAILED").length;
  const processing = documents.filter((d) => d.status === "PROCESSING").length;

  const deptCount = documents.reduce((acc, d) => {
    if (d.department) acc[d.department] = (acc[d.department] || 0) + 1;
    return acc;
  }, {});
  const topDept = Object.entries(deptCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const cards = CARDS(total, completed, processing, failed, topDept);

  return (
    <div className="dashboard-cards">
      {cards.map((c, i) => (
        <div
          key={c.label}
          className={`stat-card stat-card--${c.color} animate-in animate-in-delay-${i + 1}`}
        >
          <div className="stat-icon">{c.icon}</div>
          {c.trend && (
            <span className={`stat-trend stat-trend--${c.trendDir}`}>
              {c.trendDir === "up" ? "↑" : "↓"} {c.trend}
            </span>
          )}
          <div className="stat-body">
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}