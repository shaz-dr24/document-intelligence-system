import re


def mask_pii(text):

    # Aadhaar
    text = re.sub(
        r"\b\d{4}\s?\d{4}\s?\d{4}\b",
        "XXXX XXXX XXXX",
        text
    )

    # PAN
    text = re.sub(
        r"\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b",
        "XXXXX9999X",
        text
    )

    # Mobile Number
    text = re.sub(
        r"\b[6-9]\d{9}\b",
        "XXXXXXXXXX",
        text
    )

    # Email
    text = re.sub(
        r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
        "hidden@email.com",
        text
    )

    # Driving License
    text = re.sub(
        r"\b[A-Z]{2}[0-9]{13}\b",
        "DL-XXXXXXXXXXXXX",
        text
    )

    # Passport
    text = re.sub(
        r"\b[A-Z][0-9]{7}\b",
        "PXXXXXXX",
        text
    )

    return text