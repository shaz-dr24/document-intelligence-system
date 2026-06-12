from database.supabase_client import supabase

def create_document_record(
    filename,
    filepath
):

    data = {
        "filename": filename,
        "file_url": filepath,
        "status": "PROCESSING",
        "processing_stage": "INGESTED"
    }

    result = (
        supabase
        .table("documents")
        .insert(data)
        .execute()
    )

    return result.data[0]