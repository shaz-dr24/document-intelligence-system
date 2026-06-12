# AI-Powered Document Intelligence System

An end-to-end AI-based Document Intelligence Platform that automates document ingestion, extraction, classification, routing, security masking, email processing, and document question answering using Retrieval-Augmented Generation (RAG).

---

## Features

### Document Upload
- Upload PDF, TXT, JPG, JPEG, PNG documents
- Supports both scanned and digital documents

### OCR Text Extraction
- Extracts text from images
- Handles scanned documents
- Converts image content into machine-readable text

### AI Document Classification
Automatically identifies document types such as:

- Resume
- Invoice
- Passport
- PAN Card
- Bank Statement
- Contract
- Purchase Order
- Medical Report
- Other

Powered by:
- Groq LLM
- Llama 3.3 70B

---

### Intelligent Routing

Documents are automatically routed to departments:

| Document Type | Department |
|--------------|------------|
| Resume | HR |
| Invoice | Finance |
| Contract | Legal |
| Purchase Order | Procurement |
| Medical Report | Healthcare |
| Passport | Identity Verification |
| Bank Statement | Finance |

---

### PII Security Layer

Sensitive information is automatically masked before AI processing.

Examples:

```text
9876543210
→ XXXX3210

ABCDE1234F
→ XXXXX1234F

1234 5678 9012
→ XXXX XXXX 9012
```

Protects:

- Phone Numbers
- Aadhaar Numbers
- PAN Numbers
- Sensitive IDs

---

### Email-Based Document Processing

Supports automatic document ingestion through Gmail.

Workflow:

```text
Email Attachment
        ↓
IMAP Fetch
        ↓
Document Extraction
        ↓
PII Masking
        ↓
Classification
        ↓
Routing
        ↓
Database Storage
```

---

### RAG-Based Question Answering

Users can ask questions directly from uploaded documents.

Examples:

```text
What is the invoice date?

What is the order number?

What is the candidate's 10th percentage?

What skills are mentioned in the resume?
```

The system retrieves relevant document chunks and generates context-aware answers.

---

### Dashboard

Provides:

- Uploaded Documents
- Classification Results
- Confidence Scores
- Department Routing
- Processing Status
- AI Chat Interface

---

## System Architecture

```text
React Frontend
        ↓
FastAPI Backend
        ↓
Document Processing Engine
        ↓
OCR + PII Masking
        ↓
Classification + Routing
        ↓
RAG Retrieval
        ↓
Groq LLM
        ↓
Supabase Database
        ↓
Celery + Redis
```

---

## Technology Stack

### Frontend

- React.js
- Vite
- Axios
- React Router DOM
- Framer Motion

### Backend

- FastAPI
- Python
- Celery
- Redis

### AI & NLP

- Groq API
- Llama 3.3 70B
- Sentence Transformers
- RAG Pipeline

### Database

- Supabase PostgreSQL

### OCR

- EasyOCR / PaddleOCR

### Email Processing

- IMAP
- Gmail App Password

---

## Project Structure

```text
document-intelligence/

│
├── backend/
│
├── agents/
│   ├── extractor_agent.py
│   ├── classifier_agent.py
│   ├── router_agent.py
│   ├── pii_agent.py
│   ├── email_agent.py
│   └── ocr_helper.py
│
├── rag/
│   ├── chunker.py
│   ├── embeddings.py
│   ├── retrieval.py
│   └── qa_agent.py
│
├── routes/
│   ├── upload_routes.py
│   ├── document_routes.py
│   ├── email_routes.py
│   ├── dashboard_routes.py
│   └── chat_routes.py
│
├── frontend/
│
├── components/
├── pages/
├── services/
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/document-intelligence-system.git

cd document-intelligence-system
```

---

### Backend Setup

```bash
cd backend

pip install -r requirements.txt
```

Create `.env`

```env
SUPABASE_URL=YOUR_SUPABASE_URL

SUPABASE_KEY=YOUR_SUPABASE_KEY

GROQ_API_KEY=YOUR_GROQ_API_KEY

REDIS_URL=redis://localhost:6379/0

EMAIL_ID=your_email@gmail.com

EMAIL_PASSWORD=your_app_password
```

Run Backend:

```bash
uvicorn main:app --reload
```

---

### Celery Worker

```bash
celery -A celery_worker.celery_app worker --pool=solo --loglevel=info
```

---

### Redis

```bash
redis-server
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## API Endpoints

### Upload Document

```http
POST /upload
```

---

### View Documents

```http
GET /documents
```

---

### Process Email Attachments

```http
GET /check-email
```

---

### Ask Questions From Documents

```http
POST /ask
```

Parameters:

```text
question
document_id
```

Example:

```text
What is the invoice number?
```

---

## Future Enhancements

- Multi-language OCR
- Vector Database Integration
- Document Summarization
- Semantic Search
- Approval Workflow Engine
- Role-Based Access Control
- Analytics Dashboard
- Cloud Storage Integration
- Docker Deployment
- Kubernetes Support

---

## Author

### Shachindran Rao

B.Tech Information Technology

Panimalar Engineering College

GitHub:
https://github.com/shaz-dr24

LinkedIn:
https://www.linkedin.com/in/shachindran-h-a-55527a293

---

## License

This project is developed for educational, research, and enterprise automation purposes.
