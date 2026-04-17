import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  MenuItem,
  TextField,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../components/Navbar";
import TransactionForm from "../components/TransactionForm";
import { getTransactions, deleteTransaction } from "../api/transactions";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const Transactions = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // Fetch transactions with filters
  const fetchTransactions = async () => {
    try {
      const filters = {};
      if (month && year) {
        filters.month = month;
        filters.year = year;
      }
      if (filterType) filters.type = filterType;
      if (filterCategory) filters.category = filterCategory;

      const data = await getTransactions(filters);
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [month, year, filterType, filterCategory]);

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (err) {
      setDeleteError("Failed to delete transaction.");
    }
  };

  // Handle Edit
  const handleEdit = (transaction) => {
    setEditData(transaction);
    setFormOpen(true);
  };

  // Handle Add
  const handleAdd = () => {
    setEditData(null);
    setFormOpen(true);
  };

  return (
    <Box sx={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="#1a237e">
            🧾 Transactions
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ backgroundColor: "#1a237e" }}
          >
            Add Transaction
          </Button>
        </Box>

        {/* Filters Row */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          {/* Month */}
          <TextField
            select
            size="small"
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            sx={{ width: 140 }}
          >
            {MONTHS.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Year */}
          <TextField
            select
            size="small"
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={{ width: 100 }}
          >
            {Array.from({ length: 4 }, (_, i) => currentYear - 1 + i).map(
              (y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ),
            )}
          </TextField>

          {/* Type Filter */}
          <TextField
            select
            size="small"
            label="Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            sx={{ width: 130 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="income">💰 Income</MenuItem>
            <MenuItem value="expense">💸 Expense</MenuItem>
          </TextField>

          {/* Category Filter */}
          <TextField
            size="small"
            label="Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            sx={{ width: 150 }}
            placeholder="e.g. Food"
          />
        </Box>

        {/* Error */}
        {deleteError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {deleteError}
          </Alert>
        )}

        {/* Transactions Table */}
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 3 }}
        >
          <Table>
            {/* Table Head */}
            <TableHead sx={{ backgroundColor: "#1a237e" }}>
              <TableRow>
                {["Date", "Type", "Category", "Amount", "Note", "Actions"].map(
                  (h) => (
                    <TableCell
                      key={h}
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      {h}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 4, color: "text.secondary" }}
                  >
                    No transactions found for this period
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((t) => (
                  <TableRow
                    key={t.id}
                    hover
                    sx={{ "&:last-child td": { border: 0 } }}
                  >
                    {/* Date */}
                    <TableCell>{t.date}</TableCell>

                    {/* Type Chip */}
                    <TableCell>
                      <Chip
                        label={t.type}
                        size="small"
                        sx={{
                          backgroundColor:
                            t.type === "income" ? "#e8f5e9" : "#ffebee",
                          color: t.type === "income" ? "#2e7d32" : "#c62828",
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                      />
                    </TableCell>

                    {/* Category */}
                    <TableCell>{t.category}</TableCell>

                    {/* Amount */}
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: t.type === "income" ? "#2e7d32" : "#c62828",
                      }}
                    >
                      {t.type === "income" ? "+" : "-"}₹
                      {Number(t.amount).toLocaleString()}
                    </TableCell>

                    {/* Note */}
                    <TableCell sx={{ color: "text.secondary" }}>
                      {t.note || "—"}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(t)}
                        sx={{ color: "#1a237e" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(t.id)}
                        sx={{ color: "#c62828" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Add / Edit Modal */}
      <TransactionForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditData(null);
        }}
        onSuccess={fetchTransactions}
        editData={editData}
      />
    </Box>
  );
};

export default Transactions;
