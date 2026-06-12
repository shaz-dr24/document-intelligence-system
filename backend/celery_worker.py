from celery import Celery

celery_app = Celery(
    "document_tasks",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
    include=[
        "celery_tasks.document_tasks",
        "celery_tasks.email_tasks"
    ]
)