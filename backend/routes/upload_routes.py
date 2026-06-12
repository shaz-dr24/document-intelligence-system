from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File

import os

from agents.ingestor_agent import (
    create_document_record
)

from celery_tasks.document_tasks import (
    process_document
)

router = APIRouter()

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...)
):

    filepath = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(filepath, "wb") as buffer:
        buffer.write(
            await file.read()
        )

    document = create_document_record(
        file.filename,
        filepath
    )

    process_document.delay(
        document["id"],
        filepath
    )

    return {
        "message": "uploaded",
        "document_id": document["id"]
    }