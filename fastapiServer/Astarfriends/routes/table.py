from fastapi import APIRouter

from components.vehicleRouting import vehicle_routing
from models import Markers
import requests

router = APIRouter()

def post_calculate_route(data):
    osrmCoordinates = ';'.join([f'{marker.position[1]},{marker.position[0]}' for marker in data.allMarkers])
    url = f'http://router.project-osrm.org/table/v1/driving/{osrmCoordinates}?annotations=distance'

    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print('Error:', response.status_code)
            return None
    except Exception as e:
        print('Error:', e)
        return None

@router.post("/data")
async def return_data(data: Markers):
    osrmData = post_calculate_route(data)

    if osrmData is None:
        return {"error": "An error occurred while calculating the route."}

    vehicle_routing(osrmData)
    processed_data = {
        "house_count": len(data.houseMarkers),
        "driver_count": len(data.driverMarkers),
        "destination_count": len(data.destinationMarkers),
        "total_markers": len(data.houseMarkers) + len(data.driverMarkers) + len(data.destinationMarkers)
    }
    return {"processed_data": processed_data}
