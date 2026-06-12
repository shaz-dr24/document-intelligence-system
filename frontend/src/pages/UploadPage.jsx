import UploadForm from "../components/UploadForm";
import { useNavigate } from "react-router-dom";
import "./UploadPage.css";

const PIPELINE = [
  {
    step: "01",
    label: "Extract",
    desc: "Text is pulled from the document — PDF parsing, OCR for images, or plain-text read.",
    color: "blue",
  },
  {
    step: "02",
    label: "Mask PII",
    desc: "Sensitive data like Aadhaar, PAN, phone numbers, and emails are automatically redacted.",
    color: "purple",
  },
  {
    step: "03",
    label: "Classify",
    desc: "An LLM identifies the document type with a confidence score and structured metadata.",
    color: "indigo",
  },
  {
    step: "04",
    label: "Route",
    desc: "The document is assigned to the correct department based on its type and contents.",
    color: "green",
  },
  {
    step: "05",
    label: "Embed",
    desc: "Chunks are vectorised and stored for fast semantic search and Q&A.",
    color: "amber",
  },
];

const COLOR_MAP = {
  blue:   { bg: "var(--info-bg)",    color: "var(--info)",    border: "var(--info-border)" },
  purple: { bg: "var(--purple-bg)",  color: "var(--purple)",  border: "rgba(139,92,246,0.25)" },
  indigo: { bg: "var(--accent-bg)",  color: "var(--accent)",  border: "var(--accent-border)" },
  green:  { bg: "var(--success-bg)", color: "var(--success)", border: "var(--success-border)" },
  amber:  { bg: "var(--amber-bg)",   color: "var(--amber)",   border: "rgba(245,158,11,0.25)" },
};

export default function UploadPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="page-header animate-in">
        <div className="page-eyebrow">Ingest</div>
        <h1 className="page-title">Upload Document</h1>
        <p className="page-subtitle">Process a new document through the intelligence pipeline</p>
      </div>

      <div className="upload-page-grid">
        {/* Form */}
        <div className="animate-in animate-in-delay-1">
          <UploadForm onSuccess={() => setTimeout(() => navigate("/documents"), 1600)} />
        </div>

        {/* Pipeline steps */}
        <div className="pipeline-card card animate-in animate-in-delay-2">
          <h3 className="pipeline-title">What happens next</h3>
          <p className="pipeline-subtitle">Every upload passes through five automated stages.</p>

          <div className="pipeline-steps">
            {PIPELINE.map((p, i) => {
              const c = COLOR_MAP[p.color];
              return (
                <div key={p.step} className="pipeline-step">
                  {/* Connector line */}
                  {i < PIPELINE.length - 1 && <div className="step-connector" />}

                  <div
                    className="step-num"
                    style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
                  >
                    {p.step}
                  </div>

                  <div className="step-body">
                    <span
                      className="step-label"
                      style={{ color: c.color }}
                    >
                      {p.label}
                    </span>
                    <span className="step-desc">{p.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}