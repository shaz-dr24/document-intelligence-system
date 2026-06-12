from fastapi import APIRouter

from rag.qa_agent import (
    answer_question
)

router = APIRouter()


@router.post("/ask")
def ask_question(
    question: str,
    document_id: str
):

    answer = answer_question(
    question,
    document_id
)

    return {
        "answer": answer
    }