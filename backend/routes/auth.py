from fastapi import APIRouter, HTTPException
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import bcrypt
import os

from db import users_collection
from models.user import UserRegister, UserLogin

load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

# ── Helper Functions ──────────────────────────────────────────

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password[:72].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain[:72].encode("utf-8"), hashed.encode("utf-8"))

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ── Routes ────────────────────────────────────────────────────

@router.post("/register")
def register(user: UserRegister):
    existing = users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user.password)
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed
    }
    users_collection.insert_one(new_user)
    return {"message": "User registered successfully"}


@router.post("/login")
def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    token = create_token({"sub": str(db_user["_id"]), "email": db_user["email"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "name": db_user["name"]
    }