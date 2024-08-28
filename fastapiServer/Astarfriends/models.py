from pydantic import BaseModel
from typing import List

class Marker(BaseModel):
    id: int
    position: List[float]

class Markers(BaseModel):
    houseMarkers: List[Marker]
    driverMarkers: List[Marker]
    destinationMarkers: List[Marker]
