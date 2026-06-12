import { useState } from "react";
import "./DocumentTable.css";

const STATUS_BADGE = {
  COMPLETED: "badge badge-success",
  FAILED:    "badge badge-danger",
  PROCESSING:"badge badge-warning",
};

const STATUS_DOT = {
  COMPLETED: "dot-success",
  FAILED:    "dot-danger",
  PROCESSING:"dot-warning",
};

function ConfidenceBar({ score }) {
  if (score == null) return <span style={{ color: "var(--text-disabled)" }}>—</span>;
  const cls =
    score >= 80 ? "conf-bar--high" :
    score >= 50 ? "conf-bar--medium" :
                  "conf-bar--low";
  return (
    <div className="confidence-wrap">
      <div className="conf-track">
        <div className={`conf-bar ${cls}`} style={{ width: `${score}%` }} />
      </div>
      <span className="conf-num">{score}%</span>
    </div>
  );
}

const FileIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);

export default function DocumentTable({ documents = [], onSelectDoc }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...documents].sort((a, b) => {
    let av = a[sortKey] ?? "";
    let bv = b[sortKey] ?? "";
    if (sortKey === "created_at") {
      av = new Date(av).getTime() || 0;
      bv = new Date(bv).getTime() || 0;
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const filtered = sorted.filter((d) => {
    const matchStatus = filter === "ALL" || d.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      d.filename?.toLowerCase().includes(q) ||
      d.doc_type?.toLowerCase().includes(q) ||
      d.department?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const SortIcon = ({ col }) => (
    <span style={{ marginLeft: 4, opacity: sortKey === col ? 1 : 0.3, fontSize: "0.65rem" }}>
      {sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <div className="doc-table-wrapper card animate-in">
      {/* Toolbar */}
      <div className="doc-table-toolbar">
        <div className="toolbar-left">
          <div className="doc-search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Search by name, type, department…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="toolbar-right">
          <div className="doc-filters">
            {["ALL", "COMPLETED", "PROCESSING", "FAILED"].map((s) => (
              <button
                key={s}
                className={`filter-btn${filter === s ? " active" : ""}`}
                onClick={() => setFilter(s)}
              >
                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="table-empty">
          <div className="table-empty-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <p>No documents found</p>
          <small>{search ? `No results for "${search}"` : "Upload a document to get started"}</small>
        </div>
      ) : (
        <>
          <div className="doc-table-scroll">
            <table className="doc-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("filename")} style={{ cursor: "pointer" }}>
                    Filename <SortIcon col="filename" />
                  </th>
                  <th>Type</th>
                  <th onClick={() => handleSort("department")} style={{ cursor: "pointer" }}>
                    Department <SortIcon col="department" />
                  </th>
                  <th onClick={() => handleSort("confidence_score")} style={{ cursor: "pointer" }}>
                    Confidence <SortIcon col="confidence_score" />
                  </th>
                  <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                    Status <SortIcon col="status" />
                  </th>
                  <th onClick={() => handleSort("created_at")} style={{ cursor: "pointer" }}>
                    Date <SortIcon col="created_at" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="doc-row">
                    <td>
                      <div className="doc-filename">
                        <div className="file-icon"><FileIcon /></div>
                        <span className="file-name-text" title={d.filename}>{d.filename}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{d.doc_type || "—"}</span>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>
                      {d.department || <span style={{ color: "var(--text-disabled)" }}>—</span>}
                    </td>
                    <td className="confidence-cell">
                      <ConfidenceBar score={d.confidence_score} />
                    </td>
                    <td>
                      <span className={STATUS_BADGE[d.status] || "badge badge-neutral"}>
                        <span className={`dot ${STATUS_DOT[d.status] || ""}`} />
                        {d.status}
                      </span>
                    </td>
                    <td className="doc-date">
                      {d.created_at
                        ? new Date(d.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td>
                      {d.status === "COMPLETED" && onSelectDoc && (
                        <button
                          className="btn btn-ghost btn-sm ask-btn"
                          onClick={() => onSelectDoc(d)}
                        >
                          <SparkleIcon />
                          Ask AI
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row-count">
            Showing {filtered.length} of {documents.length} documents
          </div>
        </>
      )}
    </div>
  );
}