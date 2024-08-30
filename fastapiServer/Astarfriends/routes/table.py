from fastapi import APIRouter
from components.vehicleRouting import vehicle_routing
from models import Markers
import requests

router = APIRouter()

osrmCoordinates = {}

def post_calculate_route(data):
    global osrmCoordinates
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

def get_route_polylines(optimal_routes, data):
    polylines = []
    # optimal routes contains the indexes of locations. We need to grab the coordinates of these locations
    # and pass them into the OSRM API to get the polylines
    for route in optimal_routes:
        coordinates = ';'.join([f'{data.allMarkers[index].position[1]},{data.allMarkers[index].position[0]}' for index in route])

        url = f'http://router.project-osrm.org/route/v1/driving/{coordinates}.json?geometries=polyline'
        try:
            response = requests.get(url)
            if response.status_code == 200:
                route_data = response.json()

                polylines.append(route_data['routes'][0]['geometry'])
            else:
                print('Error:', response.status_code)
                return None
        except Exception as e:
            print('Error:', e)
            return None
    #print polylines with new lines between each polyline
    print('\n\n'.join(polylines))
    return polylines

@router.post("/data")
async def return_data(data: Markers):
    global osrmCoordinates
    osrmCoordinates = ';'.join([f'{marker.position[1]},{marker.position[0]}' for marker in data.allMarkers])
    osrmData = post_calculate_route(data)
    if osrmData is None:
        return {"error": "An error occurred while calculating the route."}

    markercounts = {
        "driver_count": len(data.driverMarkers),
        "destination_count": len(data.destinationMarkers),
        "house_count": len(data.houseMarkers),
        "total_markers": len(data.driverMarkers) + len(data.destinationMarkers) + len(data.houseMarkers)
    }
    optimal_routes = vehicle_routing(osrmData, markercounts)

    polylines = get_route_polylines(optimal_routes, data)

    return {"polylines": polylines}
