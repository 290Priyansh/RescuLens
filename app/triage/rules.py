# Emergency symptom pattern rules
# These rules are conservative by design

CRITICAL_RULES = [
    {
        "pattern": {"chest pain", "dyspnea"},
        "reason": "Chest pain with breathing difficulty indicates possible cardiac event"
    },
    {
        "pattern": {"unconsciousness"},
        "reason": "Loss of consciousness detected"
    },
    {
        "pattern": {"seizure"},
        "reason": "Active seizure symptoms detected"
    }
]

HIGH_RULES = [
    {
        "pattern": {"chest pain"},
        "reason": "Chest pain requires urgent evaluation"
    },
    {
        "pattern": {"dyspnea"},
        "reason": "Breathing difficulty detected"
    },
    {
        "pattern": {"diaphoresis", "dizziness"},
        "reason": "Possible circulatory compromise"
    }
]

MEDIUM_RULES = [
    {
        "pattern": {"dizziness"},
        "reason": "Neurological symptom detected"
    }
]
