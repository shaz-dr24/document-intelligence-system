from fastapi import APIRouter
from database.supabase_client import supabase

router = APIRouter()


@router.get("/dashboard")
def dashboard():

    documents = (
        supabase.table("documents")
        .select("*")
        .execute()
    )

    docs = documents.data

    total_documents = len(docs)

    completed = len([
        d for d in docs
        if d.get("status") == "COMPLETED"
    ])

    processing = len([
        d for d in docs
        if d.get("status") == "PROCESSING"
    ])

    failed = len([
        d for d in docs
        if d.get("status") == "FAILED"
    ])

    departments = {}

    for doc in docs:

        dept = doc.get("department")

        if dept:

            departments[dept] = (
                departments.get(dept, 0) + 1
            )

    top_department = "-"

    if departments:

        top_department = max(
            departments,
            key=departments.get
        )

    return {
        "total_documents": total_documents,
        "completed": completed,
        "processing": processing,
        "failed": failed,
        "top_department": top_department,
        "documents": docs
    }