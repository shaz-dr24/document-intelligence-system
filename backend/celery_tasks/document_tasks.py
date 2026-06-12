from celery_worker import celery_app

from agents.extractor_agent import (
    extract_document
)

@celery_app.task(name="process_document")
def process_document(
    document_id,
    filepath
):

    print("TASK STARTED")

    extract_document(
        document_id,
        filepath
    )

    print("TASK FINISHED")

    return {
        "status":"completed"
    }