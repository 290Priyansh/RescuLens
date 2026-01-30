from fastapi import APIRouter, Form, Request, HTTPException, Response
from twilio.twiml.messaging_response import MessagingResponse
from twilio.twiml.voice_response import VoiceResponse
from app.medical_nlp.extractor import extract_medical_entities
from app.medical_nlp.normalizer import normalize_entities
from app.triage.triage_engine import triage
from app.incident.service import create_incident

router = APIRouter()

@router.post("/webhooks/sms")
async def handle_sms(Body: str = Form(...), From: str = Form(...)):
    """
    Handle incoming SMS from Twilio.
    """
    transcript = Body.strip()
    
    # Process the incident
    extracted = extract_medical_entities(transcript)
    normalized = normalize_entities(extracted["entities"])
    triage_result = triage(normalized["symptoms"])
    
    incident = create_incident(
        input_text=transcript,
        symptoms=normalized["symptoms"],
        triage_result=triage_result,
        # In a real app, we might use 'From' to lookup location or user
    )
    
    # Create TwiML response
    resp = MessagingResponse()
    
    if incident.urgency == "CRITICAL":
        msg = f"EMERGENCY ALERT RECEIVED. Dispatching units immediately. ID: {incident.id.split('-')[0]}"
    elif incident.urgency == "URGENT":
         msg = f"Help is on the way. Severity: High. ID: {incident.id.split('-')[0]}"
    else:
        # Check if triage_result has reasoning, otherwise provide default
        reasoning = incident.reasoning[0] if incident.reasoning else "Monitor condition"
        msg = f"Incident recorded. Advice: {reasoning}"
        
    resp.message(msg)
    
    return Response(content=str(resp), media_type="application/xml")

@router.post("/webhooks/voice")
async def handle_voice(From: str = Form(...)):
    """
    Handle incoming Voice call. Records the call.
    """
    resp = VoiceResponse()
    resp.say("This is RescuLens 911. Please state your emergency after the beep.")
    
    # Record the user's response and send to transcription webhook
    # Note: In a real deployment, the transcription endpoint must be publicly accessible (e.g. via ngrok)
    resp.record(
        transcribe=True,
        transcribeCallback="/webhooks/transcription",
        maxLength=30,
        playBeep=True
    )
    
    return Response(content=str(resp), media_type="application/xml")

@router.post("/webhooks/transcription")
async def handle_transcription(TranscriptionText: str = Form(...), From: str = Form(...)):
    """
    Handle transcription callback.
    """
    transcript = TranscriptionText.strip()
    if not transcript:
        return
        
    extracted = extract_medical_entities(transcript)
    normalized = normalize_entities(extracted["entities"])
    triage_result = triage(normalized["symptoms"])
    
    create_incident(
        input_text=transcript,
        symptoms=normalized["symptoms"],
        triage_result=triage_result
    )
    
    return {"status": "processed"}
