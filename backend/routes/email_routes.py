# routes/email_routes.py

from fastapi import APIRouter

from celery_tasks.email_tasks import (
    check_emails
)

router = APIRouter()


@router.get("/check-email")
def check_email():

    task = check_emails.delay()

    return {
        "task_id": task.id
    }