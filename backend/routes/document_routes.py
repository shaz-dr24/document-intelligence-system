from fastapi import APIRouter
from database.supabase_client import supabase

router = APIRouter()

@router.get("/documents")
def get_documents():

    result = (
        supabase
        .table("documents")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return result.data