from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.models import Party as DBParty, Users as DBUsers
from database.database import get_db
from pydanticModels import Party, Users, JoinPartyRequest, UpdateLocationRequest
import random

router = APIRouter()

@router.post("/join-party")
async def join_party(data: JoinPartyRequest, db: Session = Depends(get_db)):
    party = db.query(DBParty).filter(DBParty.party_code == data.party_code).first()
    if party is None:
        return {"error": "Party does not exist."}

    new_user = DBUsers(
        name=data.name,
        party_code=data.party_code,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User joined party!", "data": data}


@router.post("/update-location")
async def update_location(data: UpdateLocationRequest, db: Session = Depends(get_db)):
    user = db.query(DBUsers).filter(DBUsers.party_code == data.party_code, DBUsers.name == data.name).first()

    if user is None:
        return {"error": "User does not exist."}

    user.location = data.location
    db.commit()
    db.refresh(user)

    return {"message": "Location updated!", "location": data.location}
@router.get("/get-users")
async def get_users(party_code: int, db: Session = Depends(get_db)):
    party = db.query(DBParty).filter(DBParty.party_code == party_code).first()
    if party is None:
        return {"error": "Party does not exist."}

    users = db.query(DBUsers).filter(DBUsers.party_code == party_code).all()
    return {"data": users}


@router.post("/update-driving")
async def update_driving(data: JoinPartyRequest, db: Session = Depends(get_db)):
    user = db.query(DBUsers).filter(DBUsers.party_code == data.party_code, DBUsers.name == data.name).first()
    if user is None:
        return {"error": "User does not exist."}

    user.driving = not user.driving

    db.commit()
    db.refresh(user)
    return {"message": "Driving status updated!", "data": data, "driving": user.driving}
#
# @router.post("/leave-party")
# async def leave_party(data: Party, db: Session = Depends(get_db)):
#     user = db.query(DBUsers).filter(DBUsers.party_code == data.party_code).first()
#     if user is None:
#         return {"error": "User does not exist."}
#
#     db.delete(user)
#     db.commit()
#     return {"message": "User left party!"}
