from fastapi import APIRouter, HTTPException, Header
from jose import jwt, JWTError
from dotenv import load_dotenv
import os

from db import transactions_collection

load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

# ── Helper: Get user_id from token ────────────────────────────

def get_user_id(authorization: str):
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ── Routes ────────────────────────────────────────────────────

# SUMMARY: Total income and expense for a given month
@router.get("/totals")
def get_totals(month: int, year: int, authorization: str = Header(...)):
    user_id = get_user_id(authorization)

    pipeline = [
        {
            "$match": {
                "user_id": user_id,
                "date": {
                    "$gte": f"{year}-{month:02d}-01",
                    "$lte": f"{year}-{month:02d}-31"
                }
            }
        },
        {
            "$group": {
                "_id": "$type",
                "total": {"$sum": "$amount"}
            }
        }
    ]

    result = transactions_collection.aggregate(pipeline)
    totals = {"income": 0, "expense": 0}
    for item in result:
        totals[item["_id"]] = item["total"]

    totals["balance"] = totals["income"] - totals["expense"]
    return totals


# SUMMARY: Spending by category (for Pie chart)
@router.get("/category")
def get_category_summary(month: int, year: int, authorization: str = Header(...)):
    user_id = get_user_id(authorization)

    pipeline = [
        {
            "$match": {
                "user_id": user_id,
                "type": "expense",
                "date": {
                    "$gte": f"{year}-{month:02d}-01",
                    "$lte": f"{year}-{month:02d}-31"
                }
            }
        },
        {
            "$group": {
                "_id": "$category",
                "total": {"$sum": "$amount"}
            }
        },
        {
            "$sort": {"total": -1}
        }
    ]

    result = transactions_collection.aggregate(pipeline)
    return [{"category": item["_id"], "total": item["total"]} for item in result]


# SUMMARY: Month-wise totals for last 6 months (for Bar chart)
@router.get("/monthly")
def get_monthly_summary(authorization: str = Header(...)):
    user_id = get_user_id(authorization)

    pipeline = [
        {
            "$match": {
                "user_id": user_id
            }
        },
        {
            "$group": {
                "_id": {
                    "month": {"$substr": ["$date", 5, 2]},
                    "year": {"$substr": ["$date", 0, 4]},
                    "type": "$type"
                },
                "total": {"$sum": "$amount"}
            }
        },
        {
            "$sort": {
                "_id.year": -1,
                "_id.month": -1
            }
        },
        {
            "$limit": 12
        }
    ]

    result = transactions_collection.aggregate(pipeline)
    return [
        {
            "month": item["_id"]["month"],
            "year": item["_id"]["year"],
            "type": item["_id"]["type"],
            "total": item["total"]
        }
        for item in result
    ]