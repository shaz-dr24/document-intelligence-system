# test_ocr.py

from agents.ocr_helper import extract_text_from_image

text = extract_text_from_image(
    "F:\eb.png"
)

print(text)