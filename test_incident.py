from app.medical_nlp.extractor import extract_medical_entities
from app.medical_nlp.normalizer import normalize_entities
from app.triage.triage_engine import triage
from app.incident.service import create_incident

text = "Patient has chest pain and shortness of breath"

entities = extract_medical_entities(text)
normalized = normalize_entities(entities["entities"])
triage_result = triage(normalized["symptoms"])

incident = create_incident(
    input_text=text,
    symptoms=normalized["symptoms"],
    triage_result=triage_result
)

print("Incident ID:", incident.id)
print("Status:", incident.status)
print("Audit log:")
for entry in incident.audit_log:
    print(entry)
