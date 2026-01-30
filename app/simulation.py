import random

from app.medical_nlp.extractor import extract_medical_entities
from app.medical_nlp.normalizer import normalize_entities
from app.triage.triage_engine import triage
from app.routing.router import recommend_hospitals
from app.routing.hospitals import HOSPITALS
from app.api.schemas import AnalyzeRequest  # Assuming Location isn't used or import fix needed


SIMULATED_CALLS = [
    "Patient unconscious and not breathing",
    "Severe chest pain and sweating",
    "Multiple injuries after road accident",
    "High fever and vomiting",
    "Mild headache and dizziness"
]


from app.incident.service import create_incident
from app.incident.repository import incident_repository

# Simple Mock Location
class MockLocation:
    def __init__(self, lat, lon):
        self.lat = lat
        self.lon = lon

def run_simulation(num_cases: int):
    results = []

    for i in range(num_cases):
        transcript = random.choice(SIMULATED_CALLS)

        # 1. NLP Extraction
        extracted = extract_medical_entities(transcript)
        normalized = normalize_entities(extracted["entities"])
        
        # 2. Triage
        triage_result = triage(normalized["symptoms"])
        
        # 3. Routing (Mock Location for now)
        location = MockLocation(lat=23.2599 + random.uniform(-0.05, 0.05), lon=77.4126 + random.uniform(-0.05, 0.05))

        # 4. Create Incident (Persist to Repo)
        incident = create_incident(
            input_text=transcript,
            symptoms=normalized["symptoms"],
            triage_result=triage_result,
            lat=location.lat,
            lon=location.lon
        )
        
        # Map urgency to severity for router if needed (CRITICAL -> CRITICAL)
        severity = triage_result["urgency"]
        
        hospitals = recommend_hospitals(location, severity)
        
        if hospitals:
             incident.log_event("DISPATCH_RECOMMENDED", {"hospital": hospitals[0]["name"]})

        results.append({
            "case_id": incident.id,
            "transcript": transcript,
            "severity": severity,
            "assigned_hospital": hospitals[0]["name"] if hospitals else "NONE"
        })

    return {
        "cases": results,
        "final_hospital_state": [
            {"name": h["name"], "beds_left": h["beds"]}
            for h in HOSPITALS
        ]
    }


