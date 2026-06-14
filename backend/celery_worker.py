import os
from celery import Celery
from dotenv import load_dotenv
import ssl

load_dotenv()

redis_url = os.getenv("REDIS_URL")

celery_app = Celery(
    "document_tasks",
    broker=redis_url,
    backend=redis_url,
    include=[
        "celery_tasks.document_tasks",
        "celery_tasks.email_tasks"
    ]
)

celery_app.conf.broker_use_ssl = {
    "ssl_cert_reqs": ssl.CERT_NONE
}

celery_app.conf.redis_backend_use_ssl = {
    "ssl_cert_reqs": ssl.CERT_NONE
}