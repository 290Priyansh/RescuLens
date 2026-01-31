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

import os
import requests
from openai import OpenAI
from app.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

@router.post("/webhooks/voice")
async def handle_voice(From: str = Form(...)):
    """
    Handle incoming Voice call. Records the call and sends for local transcription.
    """
    resp = VoiceResponse()
    resp.say("This is RescuLens 911. Please state your emergency after the beep. We are listening.")
    
    # Record the user's response
    # action: Twilio will POST to this URL when recording ends (silence or hangup)
    resp.record(
        action="/webhooks/process_recording",
        max_length=60,
        play_beep=True
    )
    
    return Response(content=str(resp), media_type="application/xml")

@router.post("/webhooks/process_recording")
async def handle_recording(RecordingUrl: str = Form(...), From: str = Form(...)):
    """
    Download recording -> Whisper -> NLP -> Triage
    """
    print(f"Processing recording from: {RecordingUrl}")
    resp = MessagingResponse()
    
    # 1. Download the Audio File
    # Twilio recordings are private by default, so we need to auth
    try:
        audio_response = requests.get(
            RecordingUrl, # + ".mp3" sometimes helps if default is wav
            auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        )
        audio_response.raise_for_status()
        
        # Save to temp file
        filename = f"temp_recording_{From.strip('+')}.wav"
        with open(filename, "wb") as f:
            f.write(audio_response.content)
            
        # 2. Send to Whisper
        with open(filename, "rb") as audio_file:
            transcript_response = client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file,
                prompt="Panic, emergency, medical context, ambulance, help"
            )
        
        transcript = transcript_response.text
        print(f"Whisper Transcript: {transcript}")
        
        # 3. Process Incident
        extracted = extract_medical_entities(transcript)
        normalized = normalize_entities(extracted["entities"])
        triage_result = triage(normalized["symptoms"])
        
        create_incident(
            input_text=transcript,
            symptoms=normalized["symptoms"],
            triage_result=triage_result
        )

        # Cleanup
        os.remove(filename)

    except Exception as e:
        print(f"Error processing recording: {e}")
        # In a real app, we'd queue a retry or alert an admin
        return Response(status_code=500)
    
    # We don't usually reply voice-to-voice here immediately because the caller might have hung up.
    # But if they are still on the line, we could say "Help is on the way".
    # For now, we just return empty 200 OK to acknowledge receipt.
    return {"status": "processed"} 

