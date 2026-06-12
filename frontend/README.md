# DocIntel — Frontend

React + Vite frontend for the Document Intelligence System.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Runs on **http://localhost:5173** — proxies all API calls to `http://localhost:8000`.

## Pages

| Route        | Description                                       |
|--------------|---------------------------------------------------|
| `/`          | Dashboard with stats, department chart, activity  |
| `/upload`    | Upload a document; shows pipeline explanation     |
| `/documents` | Browse & filter all processed documents           |
| `/chat`      | Ask questions about any completed document (RAG)  |

## Environment

Create a `.env` in `frontend/` to override the API base URL:

```
VITE_API_URL=http://localhost:8000
```

## Structure

```
src/
  components/
    Navbar.jsx / .css         — Sidebar navigation
    DashboardCards.jsx / .css — Stat cards grid
    DocumentTable.jsx / .css  — Searchable, filterable table
    UploadForm.jsx / .css     — Drag-and-drop uploader
    AskQuestion.jsx / .css    — Chat interface for RAG Q&A
    ProgressBar.jsx / .css    — Reusable progress bar
  pages/
    Dashboard.jsx / .css
    UploadPage.jsx / .css
    DocumentsPage.jsx
    ChatPage.jsx
  services/
    api.js                    — All fetch calls to FastAPI
  App.jsx / App.css           — Root + design system tokens
  main.jsx / index.css
```