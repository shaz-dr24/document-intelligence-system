import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDocuments } from "../services/api";
import DocumentTable from "../components/DocumentTable";
import "./DocumentsPage.css";

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

export default function DocumentsPage() {
  const [docs, setDocs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setDocs(data);
      setLastUpdated(new Date());
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    load();
    // Auto-refresh every 15s if any docs are PROCESSING
    const interval = setInterval(() => {
      if (docs.some((d) => d.status === "PROCESSING")) load();
    }, 15000);
    return () => clearInterval(interval);
  }, [docs.length]);

  const handleSelectDoc = (doc) => {
    sessionStorage.setItem("selectedDoc", JSON.stringify(doc));
    navigate("/chat");
  };

  const completedCount  = docs.filter((d) => d.status === "COMPLETED").length;
  const processingCount = docs.filter((d) => d.status === "PROCESSING").length;

  return (
    <div>
      {/* Header */}
      <div className="page-header docs-header animate-in">
        <div>
          <div className="page-eyebrow">Library</div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">
            {docs.length === 0
              ? "No documents yet — upload one to get started"
              : `${docs.length} document${docs.length !== 1 ? "s" : ""} · ${completedCount} completed${processingCount > 0 ? ` · ${processingCount} processing` : ""}`}
          </p>
        </div>
        <div className="docs-actions">
          {lastUpdated && (
            <span className="last-updated">
              Updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button className="btn btn-ghost" onClick={load} disabled={loading}>
            <RefreshIcon />
            {loading ? "Loading…" : "Refresh"}
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/upload")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Upload New
          </button>
        </div>
      </div>

      {/* Processing banner */}
      {processingCount > 0 && (
        <div className="processing-banner animate-in">
          <span className="dot dot-warning" />
          <span>
            <strong>{processingCount}</strong> document{processingCount !== 1 ? "s are" : " is"} processing — auto-refreshing every 15 seconds
          </span>
          <span className="spinner spinner-dark" style={{ width: 12, height: 12, borderWidth: 2, marginLeft: "auto" }} />
        </div>
      )}

      {loading && docs.length === 0 ? (
        <div className="docs-loading animate-in">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 52 }} />
          ))}
        </div>
      ) : (
        <div className="animate-in animate-in-delay-1">
          <DocumentTable documents={docs} onSelectDoc={handleSelectDoc} />
        </div>
      )}
    </div>
  );
}