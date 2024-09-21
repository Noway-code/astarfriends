from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from database.database import Base

# Association table for many-to-many relationship between Party and Users
party_users_association = Table(
    'party_users', Base.metadata,
    Column('party_id', ForeignKey('party.id')),
    Column('user_id', ForeignKey('users.id'))
)

# SQLAlchemy model for Users
class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    party_code = Column(Integer, nullable=False)
    driving = Column(Boolean, default=False)
    location = Column(String)

    parties = relationship("Party", secondary=party_users_association, back_populates="passengers")

# SQLAlchemy model for Party
class Party(Base):
    __tablename__ = 'party'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    destination = Column(String)
    host = Column(String, nullable=False)
    date = Column(String, nullable=False)
    time = Column(String, nullable=False)
    description = Column(String)
    party_code = Column(Integer, unique=True)

    passengers = relationship("Users", secondary=party_users_association, back_populates="parties")
