from app.incident.models import Incident
from app.incident.repository import incident_repository


def create_incident(
    input_text: str,
    symptoms: list,
    triage_result: dict,
    lat: float = None,
    lon: float = None
) -> Incident:
    incident = Incident(
        input_text=input_text,
        symptoms=symptoms,
        triage_result=triage_result,
        lat=lat,
        lon=lon
    )

    incident_repository.save(incident)
    return incident


def confirm_dispatch(incident_id: str, dispatch_decision: dict):
    incident = incident_repository.get(incident_id)
    if not incident:
        raise ValueError("Incident not found")

    incident.dispatch_decision = dispatch_decision
    incident.dispatch_confirmed = True
    incident.status = "DISPATCH_CONFIRMED"

    incident.log_event(
        "DISPATCH_CONFIRMED",
        dispatch_decision
    )

    return incident


def override_dispatch(incident_id: str, reason: str):
    incident = incident_repository.get(incident_id)
    if not incident:
        raise ValueError("Incident not found")

    incident.dispatch_confirmed = False
    incident.status = "DISPATCH_OVERRIDDEN"
    incident.override_reason = reason

    incident.log_event(
        "DISPATCH_OVERRIDDEN",
        {"reason": reason}
    )

    return incident
