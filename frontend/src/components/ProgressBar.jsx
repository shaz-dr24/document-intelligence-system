import "./ProgressBar.css";

export default function ProgressBar({ value = 0, max = 100, label, color = "indigo" }) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  return (
    <div className="progress-wrap">
      {label && (
        <div className="progress-meta">
          <span className="progress-label">{label}</span>
          <span className="progress-pct">{pct}%</span>
        </div>
      )}
      <div className="progress-track">
        <div
          className={`progress-bar progress-bar--${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}