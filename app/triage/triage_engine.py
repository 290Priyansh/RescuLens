from typing import List, Dict
from app.triage.rules import CRITICAL_RULES, HIGH_RULES, MEDIUM_RULES


def evaluate_rules(symptoms: set, rules: List[Dict]) -> List[str]:
    """
    Checks which rules match the given symptoms.
    Returns reasoning strings for matched rules.
    """
    reasons = []
    for rule in rules:
        if rule["pattern"].issubset(symptoms):
            reasons.append(rule["reason"])
    return reasons


def triage(symptoms: List[str]) -> Dict:
    """
    Determines urgency and dispatch requirement based on symptoms.
    """

    symptom_set = set(symptoms)
    reasoning = []

    # CRITICAL has highest priority
    critical_reasons = evaluate_rules(symptom_set, CRITICAL_RULES)
    if critical_reasons:
        return {
            "urgency": "CRITICAL",
            "dispatch_required": True,
            "reasoning": critical_reasons
        }

    # HIGH priority
    high_reasons = evaluate_rules(symptom_set, HIGH_RULES)
    if high_reasons:
        return {
            "urgency": "HIGH",
            "dispatch_required": True,
            "reasoning": high_reasons
        }

    # MEDIUM priority
    medium_reasons = evaluate_rules(symptom_set, MEDIUM_RULES)
    if medium_reasons:
        return {
            "urgency": "MEDIUM",
            "dispatch_required": False,
            "reasoning": medium_reasons
        }

    # Default: LOW
    return {
        "urgency": "LOW",
        "dispatch_required": False,
        "reasoning": ["No emergency symptom patterns detected"]
    }
