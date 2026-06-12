from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.email_routes import router as email_router
from routes.upload_routes import router as upload_router
from routes.document_routes import router as document_router
from routes.dashboard_routes import router as dashboard_router
from routes.chat_routes import router as chat_router

app = FastAPI(
    title="Document Intelligence System"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(document_router)
app.include_router(dashboard_router)
app.include_router(email_router)
app.include_router(chat_router) 

@app.get("/")
def home():
    return {
        "message": "Document Intelligence API Running"
    }