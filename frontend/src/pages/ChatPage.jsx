import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AskQuestion from "../components/AskQuestion";
import { getDocuments } from "../services/api";
import "./ChatPage.css";

export default function ChatPage() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docs, setDocs]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = sessionStorage.getItem("selectedDoc");
    if (saved) {
      try { setSelectedDoc(JSON.parse(saved)); } catch (_) {}
    }
    getDocuments()
      .then((d) => {
        setDocs(d.filter((x) => x.status === "COMPLETED"));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const clearDoc = () => {
    setSelectedDoc(null);
    sessionStorage.removeItem("selectedDoc");
  };

  const handleSelect = (e) => {
    const doc = docs.find((d) => d.id === e.target.value);
    if (doc) {
      setSelectedDoc(doc);
      sessionStorage.setItem("selectedDoc", JSON.stringify(doc));
    }
  };

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="page-header chat-header animate-in">
        <div>
          <div className="page-eyebrow">Intelligence</div>
          <h1 className="page-title">Ask AI</h1>
          <p className="page-subtitle">Ask questions about any processed document in natural language</p>
        </div>

        {/* Document picker */}
        {!selectedDoc && !loading && (
          <div className="chat-doc-picker">
            {docs.length === 0 ? (
              <button className="btn btn-primary" onClick={() => navigate("/upload")}>
                Upload a document first
              </button>
            ) : (
              <div className="picker-wrap">
                <label className="picker-label">Select document</label>
                <select defaultValue="" onChange={handleSelect} className="doc-select">
                  <option value="" disabled>Choose a completed document…</option>
                  {docs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.filename}{d.doc_type ? ` · ${d.doc_type}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      <AskQuestion selectedDoc={selectedDoc} onClear={clearDoc} />
    </div>
  );
}