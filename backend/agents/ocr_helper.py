# agents/ocr_helper.py

import easyocr

reader = None

def get_reader():
    global reader

    if reader is None:
        reader = easyocr.Reader(
            ['en'],
            gpu=False
        )

    return reader


def extract_text_from_image(image_path):
    reader = get_reader()

    result = reader.readtext(
        image_path,
        detail=0
    )

    return "\n".join(result)