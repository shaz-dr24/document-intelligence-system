import { useState, useRef, useEffect } from "react";
import { askQuestion } from "../services/api";
import "./AskQuestion.css";

const SUGGESTIONS = [
  "Summarise this document",
  "What are the key dates?",
  "Who are the parties involved?",
  "What actions are required?",
];

const ChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const FileIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

export default function AskQuestion({ selectedDoc, onClear }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Reset conversation when doc changes
  useEffect(() => {
    setMessages([]);
    setError("");
    setQuestion("");
  }, [selectedDoc?.id]);

  const send = async () => {
    if (!question.trim() || !selectedDoc || loading) return;
    const q = question.trim();
    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);
    setError("");

    try {
      const data = await askQuestion(q, selectedDoc.id);
      setMessages((m) => [...m, { role: "ai", text: data.answer }]);
    } catch (e) {
      setError(e.message || "Failed to get answer. Please try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleSuggest = (s) => {
    setQuestion(s);
    inputRef.current?.focus();
  };

  if (!selectedDoc) {
    return (
      <div className="ask-panel">
        <div className="no-doc">
          <div className="no-doc-inner">
            <div className="no-doc-icon"><ChatIcon /></div>
            <h3>No document selected</h3>
            <p>Head over to Documents and click "Ask AI" on any completed document, or pick one from the dropdown above.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ask-panel animate-in">
      {/* Document banner */}
      <div className="ask-doc-banner">
        <div className="ask-doc-info">
          <FileIcon />
          <span className="ask-doc-name">{selectedDoc.filename}</span>
          {selectedDoc.doc_type && (
            <span className="badge badge-info">{selectedDoc.doc_type}</span>
          )}
          {selectedDoc.department && (
            <span className="badge badge-purple">{selectedDoc.department}</span>
          )}
        </div>
        <button className="btn btn-ghost btn-sm clear-doc-btn" onClick={onClear}>
          ✕ Clear
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <div className="chat-empty-icon"><ChatIcon /></div>
            <h4>Ask anything about this document</h4>
            <p>I've read and indexed it — ask questions in plain English.</p>
            <div className="suggested-questions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="suggest-chip"
                  onClick={() => handleSuggest(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`chat-msg chat-msg--${m.role}`}>
            <div className="msg-avatar">
              {m.role === "user" ? "U" : "AI"}
            </div>
            <div className="msg-bubble">{m.text}</div>
          </div>
        ))}

        {loading && (
          <div className="chat-msg chat-msg--ai">
            <div className="msg-avatar">AI</div>
            <div className="msg-bubble typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <p className="ask-error">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}

      {/* Input */}
      <div className="chat-input-row">
        <textarea
          ref={inputRef}
          className="chat-input"
          rows={2}
          placeholder="Ask a question about this document… (Enter to send)"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={onKey}
          disabled={loading}
        />
        <button
          className="btn btn-primary send-btn"
          onClick={send}
          disabled={!question.trim() || loading}
          aria-label="Send message"
        >
          {loading ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <SendIcon />}
        </button>
      </div>
    </div>
  );
}