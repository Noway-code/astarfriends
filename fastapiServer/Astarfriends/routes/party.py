import random
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.models import Party as DBParty, Users as DBUsers
from database.database import get_db
from pydanticModels import Party, PartyDeleteRequest, UpdateLocationRequest

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
        date=data.date,
        time=data.time,
        description=data.description,
        party_code=rand_party_code
    )

    db.add(new_party)
    db.commit()
    db.refresh(new_party)
    return {"message": "Party created!", "data": new_party, "party_code": rand_party_code}

@router.post("/update-location")
async def update_location(data: UpdateLocationRequest, db: Session = Depends(get_db)):
    party = db.query(DBParty).filter(DBParty.party_code == data.party_code, DBParty.name == data.name).first()
    if party is None:
        return {"error": "Party does not exist."}

    party.destination = data.location
    db.commit()
    db.refresh(party)
    return {"message": "Destination updated!", "data": data}


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