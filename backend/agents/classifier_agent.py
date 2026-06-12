# agents/classifier_agent.py

import json

from groq import Groq

from config.settings import GROQ_API_KEY

client = Groq(
    api_key=GROQ_API_KEY
)


def classify_document(text):

    text = text[:5000]

    prompt = f"""
Classify the document into exactly ONE of the following types.

Possible Types:

- Invoice
- Resume
- Contract
- Purchase Order
- Medical Report
- Bank Statement
- Aadhar Card
- PAN Card
- Passport
- Driving Licence
- Voter ID
- Other

Guidance for identity documents (use the closest match, do not default to Passport or Other for these):
- Aadhar Card: 12-digit Aadhaar/UID number, issued by UIDAI, has "Government of India" + Aadhaar logo, may show a QR code.
- PAN Card: 10-character alphanumeric PAN number, issued by Income Tax Department, has "Permanent Account Number".
- Driving Licence: has a DL number, RTO/transport authority name, vehicle class/category, issue and validity dates.
- Voter ID: EPIC number, issued by Election Commission of India.
- Passport: passport number, MRZ (machine-readable zone), "Republic of India" passport booklet format, nationality/place of birth fields.

If the document does not clearly match any specific type above, use "Other".

Return ONLY JSON, no extra text.

Example:

{{
  "document_type": "Aadhar Card",
  "confidence": 96,
  "reason": "Contains a 12-digit Aadhaar number and UIDAI branding"
}}

Document:

{text}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    result = response.choices[0].message.content.strip()

    if result.startswith("```json"):
        result = result.replace("```json", "")
        result = result.replace("```", "")
        result = result.strip()

    try:
        return json.loads(result)
    except json.JSONDecodeError:
        return {
            "document_type": "Other",
            "confidence": 0,
            "reason": "Could not parse classifier response"
        }