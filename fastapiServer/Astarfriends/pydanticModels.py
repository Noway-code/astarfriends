from pydantic import BaseModel
from typing import List, Optional

class Marker(BaseModel):
    id: int
    position: List[float]

class Markers(BaseModel):
    houseMarkers: List[Marker]
    driverMarkers: List[Marker]
    destinationMarkers: List[Marker]
    allMarkers: List[Marker]

class PartyDeleteRequest(BaseModel):
    party_code: int

class JoinPartyRequest(BaseModel):
    name: str
    party_code: int

class UpdateLocationRequest(BaseModel):
    name: str
    party_code: str
    location: str

# Pydantic model for Users
class Users(BaseModel):
    name: str
    party_code: int
    driving: Optional[bool] = None
    location: Optional[List[float]] = None

# Pydantic model for Party
class Party(BaseModel):
    name: str
    destination: Optional[str] = None
    host: str
    date: str
    time: str
    description: Optional[str] = None
    party_code: Optional[int] = None
    passengers: Optional[List[Users]] = None
    drivers: Optional[List[Users]] = None

