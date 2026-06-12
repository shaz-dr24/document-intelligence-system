import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./pages/UploadPage.css";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import DocumentsPage from "./pages/DocumentsPage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/upload"    element={<UploadPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/chat"      element={<ChatPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}