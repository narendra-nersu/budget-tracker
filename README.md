# 💰 Budget Tracker

A full-stack personal finance management application built with **React.js**, **FastAPI**, and **MongoDB**. Track your income and expenses, visualize spending patterns with charts, and plan your grocery shopping smartly with a priority-based algorithm.

---

##  Features

###  Dashboard
- Monthly income vs expense summary cards
- Category-wise spending **Pie Chart**
- Month-wise income vs expense **Bar Chart**
- Filter by month and year

###  Transactions
- Add, edit, and delete transactions
- Filter by month, year, type, and category
- Color-coded income (green) and expense (red)

###  Smart Grocery Planner
- Enter total budget and grocery items
- Priority-based allocation — **High → Medium → Low**
- **Round-robin algorithm** for fair distribution within same priority
- Shows bought items, partial allocations, and skipped items
- Real-time budget summary (Spent / Remaining)

---

##  Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI framework |
| Vite | Build tool |
| Material UI (MUI) | Component library |
| Recharts | Charts and data visualization |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Context API | Global auth state management |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| PyMongo | MongoDB driver |
| bcrypt | Password hashing |
| python-jose | JWT token generation |
| python-dotenv | Environment variables |
| Uvicorn | ASGI server |

### Database
| Technology | Purpose |
|---|---|
| MongoDB | NoSQL database |
| MongoDB Atlas | Cloud database hosting |
| MongoDB Compass | Database GUI tool |

---

##  Project Structure

```
budget-tracker/
├── backend/
│   ├── routes/
│   │   ├── auth.py           # Register & Login APIs
│   │   ├── transactions.py   # CRUD operations
│   │   └── summary.py        # Aggregation queries for charts
│   ├── models/
│   │   ├── user.py           # User schema
│   │   └── transaction.py    # Transaction schema
│   ├── main.py               # FastAPI app entry point
│   ├── db.py                 # MongoDB connection
│   ├── .env                  # Environment variables
│   └── requirements.txt      # Python dependencies
│
└── frontend/
    └── src/
        ├── api/
        │   ├── axios.js          # Axios base config + JWT interceptor
        │   ├── auth.js           # Auth API calls
        │   ├── transactions.js   # Transaction API calls
        │   └── summary.js        # Summary/chart API calls
        ├── context/
        │   └── AuthContext.jsx   # Global auth state
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── Transactions.jsx
        │   └── GroceryPlanner.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── SummaryCards.jsx
        │   ├── CategoryChart.jsx
        │   ├── MonthlyChart.jsx
        │   └── TransactionForm.jsx
        ├── App.jsx
        └── main.jsx
```

---

##  API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and get JWT token |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/transactions/` | Get all transactions (with filters) |
| POST | `/transactions/` | Add new transaction |
| PUT | `/transactions/{id}` | Update transaction |
| DELETE | `/transactions/{id}` | Delete transaction |

### Summary
| Method | Endpoint | Description |
|---|---|---|
| GET | `/summary/totals` | Total income, expense & balance |
| GET | `/summary/category` | Spending by category (Pie chart) |
| GET | `/summary/monthly` | Month-wise totals (Bar chart) |

---

##  Smart Grocery Planner Algorithm

The planner uses a **Priority-based Round-Robin Greedy Algorithm**:

```
1. Sort items by priority: High → Medium → Low
2. For items with same priority, use Round-Robin:
   - Give 1 unit at a time to each item fairly
   - Repeat until budget runs out or all quantities fulfilled
3. Items that can't be afforded are marked as Skipped
4. Partially fulfilled items show allocated vs desired quantity
```

**Example:**
```
Budget: ₹300
Rice  (High, ₹60/kg, 3kg) → Allocated: 2kg  [Partial - budget ran out]
Milk  (High, ₹25/L,  4L)  → Allocated: 4L   [Fully fulfilled]
Chips (Low,  ₹30/pk, 3pk) → Allocated: 0    [Skipped]
```

---

##  MongoDB Schema

```json
// users collection
{
  "_id": ObjectId,
  "name": "Narendra",
  "email": "narendra@email.com",
  "password": "bcrypt_hashed"
}

// transactions collection
{
  "_id": ObjectId,
  "user_id": "string",
  "type": "income | expense",
  "category": "Food | Rent | Travel | ...",
  "amount": 850,
  "date": "2025-05-15",
  "note": "Optional note"
}
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- Python 3.10+
- MongoDB (local) or MongoDB Atlas account

---

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Create `.env` file in `backend/`:
```env
MONGO_URI=mongodb://localhost:27017
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Run the server:
```bash
uvicorn main:app --reload
```
API runs at: `http://127.0.0.1:8000`
Swagger Docs: `http://127.0.0.1:8000/docs`

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
App runs at: `http://localhost:5173`

---

