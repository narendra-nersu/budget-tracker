import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box,
  CircularProgress, Alert
} from "@mui/material";
import { addTransaction, updateTransaction } from "../api/transactions";

const CATEGORIES = [
  "Food", "Rent", "Travel", "Shopping",
  "Entertainment", "Health", "Education", "Salary", "Other"
];

const TYPES = ["income", "expense"];

const defaultForm = {
  type: "expense",
  category: "Food",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  note: "",
};

const TransactionForm = ({ open, onClose, onSuccess, editData }) => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If editing, prefill the form with existing data
  useEffect(() => {
    if (editData) {
      setForm({
        type: editData.type,
        category: editData.category,
        amount: editData.amount,
        date: editData.date,
        note: editData.note || "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [editData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");

    // Basic validation
    if (!form.amount || isNaN(form.amount) || form.amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!form.date) {
      setError("Please select a date.");
      return;
    }

    setLoading(true);
    try {
      if (editData) {
        await updateTransaction(editData.id, form);
      } else {
        await addTransaction(form);
      }
      onSuccess(); // Refresh parent data
      onClose();   // Close modal
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">

      {/* Title */}
      <DialogTitle sx={{ fontWeight: "bold", color: "#1a237e" }}>
        {editData ? "✏️ Edit Transaction" : "➕ Add Transaction"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>

          {/* Error */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Type */}
          <TextField
            select
            fullWidth
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            {TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t === "income" ? "💰 Income" : "💸 Expense"}
              </MenuItem>
            ))}
          </TextField>

          {/* Category */}
          <TextField
            select
            fullWidth
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          {/* Amount */}
          <TextField
            fullWidth
            label="Amount (₹)"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
          />

          {/* Date */}
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          {/* Note */}
          <TextField
            fullWidth
            label="Note (optional)"
            name="note"
            value={form.note}
            onChange={handleChange}
            multiline
            rows={2}
          />

        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ backgroundColor: "#1a237e" }}
        >
          {loading
            ? <CircularProgress size={22} color="inherit" />
            : editData ? "Update" : "Add"
          }
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default TransactionForm;