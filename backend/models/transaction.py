from pydantic import BaseModel
from typing import Optional
from datetime import date

class Transaction(BaseModel):
    type: str            # "income" or "expense"
    category: str        # "Food", "Rent", "Travel" etc.
    amount: float
    date: date
    note: Optional[str] = None