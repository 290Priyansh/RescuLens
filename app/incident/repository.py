from typing import Dict
from app.incident.models import Incident


class IncidentRepository:
    """
    In-memory incident store.
    Replace with DB later without changing business logic.
    """

    def __init__(self):
        self._incidents: Dict[str, Incident] = {}

    def save(self, incident: Incident):
        self._incidents[incident.id] = incident

    def get(self, incident_id: str) -> Incident:
        return self._incidents.get(incident_id)

    def all(self):
        return list(self._incidents.values())


# Singleton instance (for now)
incident_repository = IncidentRepository()
