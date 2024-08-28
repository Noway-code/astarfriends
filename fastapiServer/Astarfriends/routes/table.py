from fastapi import APIRouter
from models import Markers

router = APIRouter()

@router.post("/data")
async def return_data(data: Markers):
    return {"received_data": data}
