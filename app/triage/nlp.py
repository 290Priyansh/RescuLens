from transformers import pipeline

classifier = pipeline(
    task="text-classification",
    model="distilbert-base-uncased-finetuned-sst-2-english",
    framework="pt"   # 🔥 FORCE PYTORCH, NOT TENSORFLOW
)

def classify_text(text: str):
    result = classifier(text)[0]
    score = result["score"]

    if score > 0.85:
        severity = "CRITICAL"
    elif score > 0.65:
        severity = "HIGH"
    elif score > 0.45:
        severity = "MEDIUM"
    else:
        severity = "LOW"

    return severity, score
