# rag/embeddings.py

from sentence_transformers import (
    SentenceTransformer
)

# Load model once
model = None

def get_model():
    global model

    if model is None:
        model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

    return model


def generate_embedding(text):

    if not text:
        return []

    model = get_model()

    embedding = model.encode(
        text,
        convert_to_numpy=True
    )

    return embedding.tolist()