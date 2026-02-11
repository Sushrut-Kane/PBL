#!/usr/bin/env python3
import sys
import pytesseract
from pdf2image import convert_from_path
from PIL import Image

def extract_text_from_pdf(pdf_path):
    try:
        images = convert_from_path(pdf_path)

        extracted_text = ""

        for i, image in enumerate(images):
            text = pytesseract.image_to_string(image)
            extracted_text += text + "\n"

        return extracted_text.strip()

    except Exception as e:
        print(f"Error processing PDF: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ocr_script.py <path_to_pdf>", file=sys.stderr)
        sys.exit(1)

    pdf_path = sys.argv[1]

    extracted_text = extract_text_from_pdf(pdf_path)

    print(extracted_text)
