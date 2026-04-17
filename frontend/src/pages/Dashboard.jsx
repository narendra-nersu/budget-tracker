import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import CategoryChart from "../components/CategoryChart";
import MonthlyChart from "../components/MonthlyChart";
import TransactionForm from "../components/TransactionForm";
import {
  getTotals,
  getCategorySummary,
  getMonthlySummary,
} from "../api/summary";

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

const Dashboard = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [totals, setTotals] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  // Fetch all dashboard data
  const fetchData = async () => {
    try {
      const [t, c, m] = await Promise.all([
        getTotals(month, year),
        getCategorySummary(month, year),
        getMonthlySummary(),
      ]);
      setTotals(t);
      setCategoryData(c);
      setMonthlyData(m);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

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
          {/* Title */}
          <Typography variant="h5" fontWeight="bold" color="#1a237e">
            📊 Dashboard
          </Typography>

          {/* Month + Year Filter + Add Button */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Month Selector */}
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

            {/* Year Selector */}
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

            {/* Add Transaction Button */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setFormOpen(true)}
              sx={{ backgroundColor: "#1a237e" }}
            >
              Add Transaction
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <SummaryCards totals={totals} />

        {/* Charts Row */}
        <Grid container spacing={3}>
          {/* Pie Chart */}
          <Grid item xs={12} md={5}>
            <CategoryChart data={categoryData} />
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12} md={7}>
            <MonthlyChart data={monthlyData} />
          </Grid>
        </Grid>
      </Container>

      {/* Add Transaction Modal */}
      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={fetchData}
        editData={null}
      />
    </Box>
  );
};

export default Dashboard;
