from rag.embeddings import (
    generate_embedding
)

from database.supabase_client import (
    supabase
)


def retrieve_context(
    question,
    document_id
):

    query_embedding = generate_embedding(
        question
    )

    result = supabase.rpc(
    "match_document_chunks",
    {
        "query_embedding": query_embedding,
        "doc_id": document_id,
        "match_count": 5
    }
).execute()

    return result.data