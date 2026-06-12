import { useEffect, useState } from "react";
import { getDocuments, checkEmail } from "../services/api";
import DashboardCards from "../components/DashboardCards";
import ProgressBar from "../components/ProgressBar";
import "./Dashboard.css";

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const BarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const TagIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default function Dashboard() {
  const [docs, setDocs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [emailMsg, setEmailMsg] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await getDocuments();
      setDocs(data);
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const triggerEmail = async () => {
    setEmailMsg("Checking email inbox…");
    try {
      const r = await checkEmail();
      setEmailMsg(`✓ Task queued: ${r.task_id}`);
    } catch (e) {
      setEmailMsg("Failed: " + e.message);
    }
    setTimeout(() => setEmailMsg(""), 5000);
  };

  const byDept = docs.reduce((a, d) => {
    if (d.department) a[d.department] = (a[d.department] || 0) + 1;
    return a;
  }, {});

  const byType = docs.reduce((a, d) => {
    if (d.doc_type) a[d.doc_type] = (a[d.doc_type] || 0) + 1;
    return a;
  }, {});

  const maxDept = Math.max(1, ...Object.values(byDept));
  const recent = [...docs]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 6);

  const dotClass = {
    COMPLETED: "dot-success",
    FAILED:    "dot-danger",
    PROCESSING:"dot-warning",
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header dash-header animate-in">
        <div>
          <div className="page-eyebrow">Overview</div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Document processing overview and analytics</p>
        </div>
        <div className="dash-actions">
          <button
            className="btn btn-ghost"
            onClick={() => load(true)}
            disabled={refreshing}
          >
            <RefreshIcon />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <button className="btn btn-primary" onClick={triggerEmail}>
            <MailIcon />
            Check Email
          </button>
        </div>
      </div>

      {emailMsg && (
        <div className="email-toast">
          <span style={{ width: 8, height: 8, background: "var(--accent)", borderRadius: "50%", display: "inline-block", flexShrink: 0 }} />
          {emailMsg}
        </div>
      )}

      {loading ? (
        <div className="loading-grid">
          <div className="skeleton-cards">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton skeleton-h" />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: "1.25rem", marginTop: "1rem" }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton skeleton-block" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <DashboardCards documents={docs} />

          <div className="dash-bottom">
            {/* By Department */}
            <div className="card dash-breakdown animate-in animate-in-delay-1">
              <h3 className="card-title">
                <span className="card-title-icon"><BarIcon /></span>
                By Department
              </h3>
              {Object.keys(byDept).length === 0 ? (
                <p className="no-data">No data yet</p>
              ) : (
                <div className="bar-list">
                  {Object.entries(byDept)
                    .sort((a, b) => b[1] - a[1])
                    .map(([dept, count]) => (
                      <ProgressBar
                        key={dept}
                        label={dept}
                        value={count}
                        max={maxDept}
                        color="indigo"
                      />
                    ))}
                </div>
              )}
            </div>

            {/* Document Types */}
            <div className="card dash-breakdown animate-in animate-in-delay-2">
              <h3 className="card-title">
                <span className="card-title-icon"><TagIcon /></span>
                Document Types
              </h3>
              {Object.keys(byType).length === 0 ? (
                <p className="no-data">No data yet</p>
              ) : (
                <div className="type-chips">
                  {Object.entries(byType)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => (
                      <div key={type} className="type-chip">
                        <span>{type}</span>
                        <strong>{count}</strong>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="card dash-recent animate-in animate-in-delay-3">
              <h3 className="card-title">
                <span className="card-title-icon"><ClockIcon /></span>
                Recent Activity
              </h3>
              {recent.length === 0 ? (
                <p className="no-data">No documents yet</p>
              ) : (
                <ul className="activity-list">
                  {recent.map((d) => (
                    <li key={d.id} className="activity-item">
                      <div className={`activity-dot ${dotClass[d.status] || ""}`} />
                      <div className="activity-body">
                        <p className="activity-name">{d.filename}</p>
                        <p className="activity-meta">
                          <span>{d.doc_type || "Unknown"}</span>
                          <span className="activity-arrow">→</span>
                          <span>{d.department || "Pending routing"}</span>
                        </p>
                      </div>
                      <span className="activity-time">
                        {d.created_at
                          ? new Date(d.created_at).toLocaleDateString("en-IN", {
                              day: "2-digit", month: "short",
                            })
                          : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}