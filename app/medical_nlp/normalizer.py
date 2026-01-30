from typing import List, Dict

# Canonical medical symptom dictionary
# key = canonical symptom
# values = phrases that map to it
CANONICAL_SYMPTOMS = {
    "chest pain": [
        "chest pain",
        "chest tightness",
        "pressure in chest"
    ],
    "dyspnea": [
        "shortness of breath",
        "difficulty breathing",
        "breathing difficulty",
        "shortness"
    ],
    "diaphoresis": [
        "sweating",
        "excessive sweating",
        "cold sweat"
    ],
    "dizziness": [
        "dizziness",
        "lightheaded",
        "lightheadedness"
    ],
    "unconsciousness": [
        "unconscious",
        "passed out",
        "not responding"
    ],
    "seizure": [
        "seizure",
        "convulsions",
        "fits"
    ]
}

def normalize_entities(entities: List[Dict]) -> Dict:
    """
    Converts raw extracted entities into canonical medical symptoms.
    """

    normalized = set()
    matched_phrases = []

    for entity in entities:
        text = entity["text"].lower()

        for canonical, variants in CANONICAL_SYMPTOMS.items():
            for phrase in variants:
                if phrase in text:
                    normalized.add(canonical)
                    matched_phrases.append({
                        "original": entity["text"],
                        "normalized": canonical
                    })

    return {
        "symptoms": sorted(list(normalized)),
        "matches": matched_phrases
    }
