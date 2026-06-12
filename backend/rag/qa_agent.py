from groq import Groq

from rag.retrieval import retrieve_context
from config.settings import GROQ_API_KEY

client = Groq(
    api_key=GROQ_API_KEY
)

def answer_question(
    question,
    document_id
):

    chunks = retrieve_context(
    question,
    document_id
)

    context = "\n".join(
        [
            chunk["chunk_text"]
            for chunk in chunks
        ]
    )

    prompt = f"""
Answer using ONLY the context.

Context:
{context}

Question:
{question}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content