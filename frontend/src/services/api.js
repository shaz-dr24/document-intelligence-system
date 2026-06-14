const BASE_URL = import.meta.env.VITE_API_URL || "https://document-intelligence-system-production.up.railway.app";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const uploadDocument = async (file) => {
  const form = new FormData();
  form.append("file", file);
  return request("/upload", { method: "POST", body: form });
};

export const getDocuments = () => request("/documents");

export const askQuestion = (question, document_id) =>
  request(`/ask?question=${encodeURIComponent(question)}&document_id=${document_id}`, {
    method: "POST",
  });

export const checkEmail = () => request("/check-email");

export const getDashboard = () => request("/dashboard");

export const downloadDocument = async (id, filename) => {
  const res = await fetch(`${BASE_URL}/documents/${id}/download`);
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "document";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};