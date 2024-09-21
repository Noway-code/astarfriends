from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.models import Party as DBParty, Users as DBUsers
from database.database import get_db
from pydanticModels import Party, PartyDeleteRequest
import random

router = APIRouter()

@router.post("/create-party")
async def create_party(data: Party, db: Session = Depends(get_db)):
    # Generate a random 5-digit party code and check if it already exists
    while True:
        rand_party_code = random.randint(10000, 99999)
        existing_party = db.query(DBParty).filter(DBParty.party_code == rand_party_code).first()
        if existing_party is None:
            break

    new_party = DBParty(
        name=data.name,
        host=data.host,
        destination=data.destination,
        date=data.date,
        time=data.time,
        description=data.description,
        party_code = rand_party_code
    )

    db.add(new_party)
    db.commit()
    db.refresh(new_party)
    return {"message": "Party created!", "data": data, "party_code": rand_party_code}

@router.post("/update-party-details")
async def update_party_details(data: Party, db: Session = Depends(get_db)):
    party = db.query(DBParty).filter(DBParty.party_code == data.party_code).first()
    if party is None:
        return {"error": "Party does not exist."}

    party.name = data.name
    party.destination = data.destination
    party.date = data.date
    party.time = data.time
    party.description = data.description
    db.commit()
    db.refresh(party)
    return {"message": "Party details updated!", "data": data}


@router.post("/delete-party")
async def delete_party(request: PartyDeleteRequest, db: Session = Depends(get_db)):
    party = db.query(DBParty).filter(DBParty.party_code == request.party_code).first()
    if party is None:
        return {"error": "Party does not exist."}

    db.delete(party)
    db.commit()
    return {"message": "Party deleted!"}


# @router.post("/update-location")
# async def update_location(data: Party, db: Session = Depends(get_db)):
#     user = db.query(DBUsers).filter(DBUsers.party_code == data.party_code).first()
#     if user is None:
#         return {"error": "User does not exist."}
#
#     user.location = data.location
#     db.commit()
#     db.refresh(user)
#     return {"message": "Location updated!", "data": data}

# @router.post("/join-party")
# async def join_party(data: Party, db: Session = Depends(get_db)):
#     # Check if party exists
#     party = db.query(DBParty).filter(DBParty.party_code == data.party_code).first()
#     if party is None:
#         return {"error": "Party does not exist."}
#
#     # Create User record
#     new_user = DBUsers(
#         name=data.name,
#         party_name=party.name,
#         party_code=data.party_code
#     )
#
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     return {"message": "User joined party!", "data": data}
#
#
# @router.get("/get-users")
# async def get_users(party_code: str, db: Session = Depends(get_db)):
#     party = db.query(DBParty).filter(DBParty.party_code == party_code).first()
#     if party is None:
#         return {"error": "Party does not exist."}
#
#     users = db.query(DBUsers).filter(DBUsers.party_code == party_code).all()
#     return {"data": users}


# @router.post("/update-driving")
# async def update_driving(data: Party, db: Session = Depends(get_db)):
#     user = db.query(DBUsers).filter(DBUsers.party_code == data.party_code).first()
#     if user is None:
#         return {"error": "User does not exist."}
#
#     user.driving = data.driving
#     db.commit()
#     db.refresh(user)
#     return {"message": "Driving status updated!", "data": data}
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


# @router.post("/delete-user")
# async def delete_user(data: Party, db: Session = Depends(get_db)):
#     user = db.query(DBUsers).filter(DBUsers.party_code == data.party_code).first()
#     if user is None:
#         return {"error": "User does not exist."}
#
#     db.delete(user)
#     db.commit()
#     return {"message": "User deleted!"}

