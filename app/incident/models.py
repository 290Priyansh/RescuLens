from typing import List, Dict
from datetime import datetime
from uuid import uuid4


class Incident:
    def __init__(
        self,
        input_text: str,
        symptoms: List[str],
        triage_result: Dict,
        lat: float = None,
        lon: float = None
    ):
        self.id = str(uuid4())
        self.lat = lat
        self.lon = lon
        self.created_at = datetime.utcnow()
        self.updated_at = self.created_at

        self.input_text = input_text
        self.symptoms = symptoms

        self.urgency = triage_result["urgency"]
        self.dispatch_required = triage_result["dispatch_required"]
        self.reasoning = triage_result["reasoning"]

        self.status = "TRIAGED"

        self.dispatch_decision = None
        self.dispatch_confirmed = False
        self.override_reason = None

        self.audit_log = [
            {
                "timestamp": self.created_at.isoformat(),
                "event": "INCIDENT_CREATED",
                "details": {
                    "urgency": self.urgency,
                    "dispatch_required": self.dispatch_required
                }
            }
        ]

    def log_event(self, event: str, details: Dict):
        self.audit_log.append({
            "timestamp": datetime.utcnow().isoformat(),
            "event": event,
            "details": details
        })
        self.updated_at = datetime.utcnow()
