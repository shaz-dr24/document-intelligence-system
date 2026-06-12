import { useState, useRef } from "react";
import { uploadDocument } from "../services/api";
import ProgressBar from "./ProgressBar";
import "./UploadForm.css";

const ACCEPTED = ".pdf,.txt,.jpg,.jpeg,.png";

const UploadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function UploadForm({ onSuccess }) {
  const [file, setFile]         = useState(null);
  const [drag, setDrag]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState("");
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setResult(null);
    setError("");
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const onSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(10);
    setError("");
    setResult(null);

    const interval = setInterval(() => {
      setProgress((p) => (p < 80 ? p + 7 : p));
    }, 280);

    try {
      const data = await uploadDocument(file);
      clearInterval(interval);
      setProgress(100);
      setResult(data);
      onSuccess?.();
    } catch (e) {
      clearInterval(interval);
      setError(e.message || "Upload failed. Please try again.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError("");
    setProgress(0);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="upload-form card animate-in">
      <div className="upload-form-header">
        <h2 className="upload-title">Upload Document</h2>
        <p className="upload-subtitle">Supports PDF, TXT, JPG, PNG — auto-classified and routed by AI</p>
      </div>

      {!result ? (
        <>
          <div
            className={`drop-zone${drag ? " dragging" : ""}${file ? " has-file" : ""}`}
            onClick={() => !file && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && !file && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED}
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {file ? (
              <div className="file-preview">
                <div className="file-preview-icon"><FileIcon /></div>
                <div className="file-preview-info">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{formatSize(file.size)}</p>
                </div>
                <button
                  className="btn btn-ghost clear-btn"
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  aria-label="Remove file"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="drop-idle">
                <div className="drop-icon"><UploadIcon /></div>
                <p className="drop-label">Drag & drop or <span>browse files</span></p>
                <p className="drop-hint">PDF · TXT · JPG · PNG</p>
              </div>
            )}
          </div>

          {loading && (
            <div className="upload-progress">
              <ProgressBar value={progress} label="Uploading & processing…" color="indigo" />
            </div>
          )}

          {error && (
            <p className="upload-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </p>
          )}

          <button
            className="btn btn-primary upload-submit"
            onClick={onSubmit}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Processing document…
              </>
            ) : (
              <>
                <UploadIcon />
                Upload & Process
              </>
            )}
          </button>
        </>
      ) : (
        <div className="upload-success">
          <div className="success-icon"><CheckIcon /></div>
          <h3>Document Queued</h3>
          <p>Your document is being processed through the intelligence pipeline.</p>
          <div className="success-meta">
            <div className="meta-row">
              <b>Document ID</b>
              <code>{result.document_id}</code>
            </div>
            {result.status && (
              <div className="meta-row">
                <b>Status</b>
                <span className="badge badge-warning">
                  <span className="dot dot-warning" />
                  {result.status}
                </span>
              </div>
            )}
          </div>
          <button className="btn btn-ghost" onClick={reset} style={{ marginTop: "0.5rem" }}>
            Upload another document
          </button>
        </div>
      )}
    </div>
  );
}