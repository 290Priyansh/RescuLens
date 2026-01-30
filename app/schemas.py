from pydantic import BaseModel
from typing import List


class Location(BaseModel):
    lat: float
    lon: float


class TriageRequest(BaseModel):
    transcript: str
    location: Location


class HospitalRecommendation(BaseModel):
    name: str
    score: float
    reason: str


class TriageResponse(BaseModel):
    severity: str
    confidence: float
    reasoning: List[str]
    recommended_hospitals: List[HospitalRecommendation]
