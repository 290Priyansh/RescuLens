from app.medical_nlp.extractor import extract_medical_entities

text = "Patient has chest pain, sweating, dizziness, and shortness of breath"
print(extract_medical_entities(text))
