from app.medical_nlp.extractor import extract_medical_entities
from app.medical_nlp.normalizer import normalize_entities

text = "Patient has chest pain, sweating, dizziness, and shortness of breath"

extracted = extract_medical_entities(text)
normalized = normalize_entities(extracted["entities"])

print("Extracted entities:")
print(extracted["entities"])

print("\nNormalized symptoms:")
print(normalized)
