import spacy
from typing import List, Dict

# Load models once (important for performance)
BASE_NLP = spacy.load("en_core_sci_sm")
DISEASE_NLP = spacy.load("en_ner_bc5cdr_md")
CLINICAL_NLP = spacy.load("en_ner_jnlpba_md")


def extract_medical_entities(text: str) -> Dict:
    """
    Extracts medical symptoms and clinical entities from free-text input.
    This layer extracts FACTS only, not diagnoses.
    """

    entities = []
    seen = set()

    for nlp in (BASE_NLP, DISEASE_NLP, CLINICAL_NLP):
        doc = nlp(text)
        for ent in doc.ents:
            key = (ent.text.lower(), ent.label_)
            if key not in seen:
                seen.add(key)
                entities.append({
                    "text": ent.text,
                    "label": ent.label_
                })

    return {
        "raw_text": text,
        "entities": entities
    }
