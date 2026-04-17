from fastapi import APIRouter, HTTPException, Header
from jose import jwt, JWTError
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv
import os

from db import transactions_collection
from models.transaction import Transaction

load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

# ── Helper: Get user_id from token ────────────────────────────

def get_user_id(authorization: str):
    try:
        token = authorization.split(" ")[1]  # "Bearer <token>"
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ── Helper: Format MongoDB document ──────────────────────────

def format_transaction(t):
    return {
        "id": str(t["_id"]),
        "type": t["type"],
        "category": t["category"],
        "amount": t["amount"],
        "date": str(t["date"]),
        "note": t.get("note", "")
    }

# ── Routes ────────────────────────────────────────────────────

# ADD transaction
@router.post("/")
def add_transaction(transaction: Transaction, authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    new_transaction = {
        "user_id": user_id,
        "type": transaction.type,
        "category": transaction.category,
        "amount": transaction.amount,
        "date": str(transaction.date),
        "note": transaction.note
    }
    result = transactions_collection.insert_one(new_transaction)
    return {"message": "Transaction added", "id": str(result.inserted_id)}


# GET all transactions (with optional filters)
@router.get("/")
def get_transactions(
    authorization: str = Header(...),
    month: int = None,
    year: int = None,
    category: str = None,
    type: str = None
):
    user_id = get_user_id(authorization)
    query = {"user_id": user_id}

    # Apply filters if provided
    if category:
        query["category"] = category
    if type:
        query["type"] = type
    if month and year:
        query["date"] = {
            "$gte": f"{year}-{month:02d}-01",
            "$lte": f"{year}-{month:02d}-31"
        }

    transactions = transactions_collection.find(query).sort("date", -1)
    return [format_transaction(t) for t in transactions]


# UPDATE transaction
@router.put("/{transaction_id}")
def update_transaction(
    transaction_id: str,
    transaction: Transaction,
    authorization: str = Header(...)
):
    user_id = get_user_id(authorization)

    existing = transactions_collection.find_one({
        "_id": ObjectId(transaction_id),
        "user_id": user_id
    })
    if not existing:
        raise HTTPException(status_code=404, detail="Transaction not found")

    transactions_collection.update_one(
        {"_id": ObjectId(transaction_id)},
        {"$set": {
            "type": transaction.type,
            "category": transaction.category,
            "amount": transaction.amount,
            "date": str(transaction.date),
            "note": transaction.note
        }}
    )
    return {"message": "Transaction updated successfully"}


# DELETE transaction
@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: str, authorization: str = Header(...)):
    user_id = get_user_id(authorization)

    existing = transactions_collection.find_one({
        "_id": ObjectId(transaction_id),
        "user_id": user_id
    })
    if not existing:
        raise HTTPException(status_code=404, detail="Transaction not found")

    transactions_collection.delete_one({"_id": ObjectId(transaction_id)})
    return {"message": "Transaction deleted successfully"}