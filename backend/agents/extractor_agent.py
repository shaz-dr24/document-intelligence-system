# agents/extractor_agent.py
from rag.chunker import chunk_text
from rag.embeddings import generate_embedding
from agents.classifier_agent import classify_document
from agents.router_agent import route_document
from agents.pii_agent import mask_pii

import fitz
import os

from database.supabase_client import supabase

try:
    from agents.ocr_helper import extract_text_from_image
    print("OCR LOADED SUCCESSFULLY")
except Exception as e:
    print("OCR IMPORT ERROR =", str(e))
    extract_text_from_image = None


def extract_text_from_pdf(filepath):
    pdf = fitz.open(filepath)

    text = ""

    for page in pdf:
        text += page.get_text()

    pdf.close()

    return text


def extract_text_from_txt(filepath):
    with open(
        filepath,
        "r",
        encoding="utf-8",
        errors="ignore"
    ) as file:

        return file.read()


def extract_document(document_id, filepath):

    text = ""
    masked_text = ""
    classification = {}
    department = None

    try:

        extension = os.path.splitext(filepath)[1].lower()

        # PDF

        if extension == ".pdf":

            text = extract_text_from_pdf(filepath)

        # TXT

        elif extension == ".txt":

            text = extract_text_from_txt(filepath)

        # IMAGE OCR

        elif extension in [".jpg", ".jpeg", ".png"]:

            if extract_text_from_image:

                text = extract_text_from_image(filepath)

            else:

                raise Exception(
                    "OCR Engine Not Configured"
                )

        else:

            raise Exception(
                "Unsupported File Type"
            )

        print("\nTEXT EXTRACTED\n")
        print(text[:1000])

        # PII MASKING

        masked_text = mask_pii(text)

        print("\nPII MASKED TEXT\n")
        print(masked_text[:1000])

        # CLASSIFICATION

        classification = classify_document(
            masked_text
        )

        print("\nCLASSIFICATION RESULT\n")
        print(classification)

        department = route_document(
            classification["document_type"]
)

        # ROUTING

        department = route_document(
            classification["document_type"]
        )

        print("\nROUTED TO\n")
        print(department)

        chunks = chunk_text(masked_text)

        for chunk in chunks:

            embedding = generate_embedding(
                chunk
            )

            supabase.table(
                "document_chunks"
            ).insert({

                "document_id": document_id,
                "chunk_text": chunk,
                "embedding": embedding

            }).execute()

        # DATABASE UPDATE

        result = (
            supabase.table("documents")
            .update({
                "processing_stage": "ROUTED",
                "status": "COMPLETED",
                "extracted_text": text,
                "masked_text": masked_text,
                "doc_type": classification["document_type"],
                "confidence_score": classification["confidence"],
                "classification_reason": classification["reason"],
                "department": department,
                "routing_status": "ROUTED"
            })
            .eq("id", document_id)
            .execute()
        )

        print("\nSUPABASE UPDATE RESULT\n")
        print(result)

        return text

    except Exception as e:

        error_message = str(e)

        print("\nERROR\n")
        print(error_message)

        try:

            supabase.table(
                "documents"
            ).update({

                "status": "FAILED",

                "error_message": error_message,

                "extracted_text": text,

                "masked_text": masked_text,

                "department": department,

                "routing_status": "FAILED"

            }).eq(
                "id",
                document_id
            ).execute()

        except Exception as db_error:

            print("\nDATABASE UPDATE ERROR\n")
            print(str(db_error))

        raise e