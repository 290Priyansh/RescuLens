from app.medical_nlp.extractor import extract_medical_entities
from app.medical_nlp.normalizer import normalize_entities
from app.triage.triage_engine import triage

text = "Patient has chest pain, sweating, dizziness, and shortness of breath"

entities = extract_medical_entities(text)
normalized = normalize_entities(entities["entities"])
result = triage(normalized["symptoms"])

print("Symptoms:", normalized["symptoms"])
print("Triage result:")
print(result)
