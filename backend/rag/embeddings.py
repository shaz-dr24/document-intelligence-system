# rag/embeddings.py

from sentence_transformers import (
    SentenceTransformer
)

# Load model once
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


def generate_embedding(text):

    if not text:
        return []

    embedding = model.encode(
        text,
        convert_to_numpy=True
    )

    return embedding.tolist()