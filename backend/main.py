from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, transactions, summary

app = FastAPI(title="Budget Tracker API")

# ── CORS (allows React frontend to talk to this backend) ──────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register Routes ───────────────────────────────────────────
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
app.include_router(summary.router, prefix="/summary", tags=["Summary"])

# ── Health Check ──────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "Budget Tracker API is running ✅"}