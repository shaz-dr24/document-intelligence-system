from celery_worker import celery_app

from agents.email_agent import (
    fetch_unread_emails
)

from celery_tasks.document_tasks import (
    process_document
)

from database.supabase_client import (
    supabase
)

import uuid
import os


@celery_app.task(
    name="celery_tasks.email_tasks.check_emails"
)
def check_emails():

    files = fetch_unread_emails()

    print("\nEMAIL FILES FOUND:")
    print(files)

    for filepath in files:

        document_id = str(
            uuid.uuid4()
        )

        filename = os.path.basename(
            filepath
        )

        # INSERT DOCUMENT RECORD FIRST

        insert_result = (
            supabase.table(
                "documents"
            )
            .insert({
                "id": document_id,
                "filename": filename,
                "file_url": filepath,
                "status": "PROCESSING",
                "processing_stage": "INGESTED"
            })
            .execute()
        )

        print("\nDOCUMENT INSERTED:")
        print(insert_result)

        # SEND TO CELERY DOCUMENT PROCESSOR

        process_document.delay(
            document_id,
            filepath
        )

    return len(files)