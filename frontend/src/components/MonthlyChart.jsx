import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

const MONTH_NAMES = {
  "01": "Jan", "02": "Feb", "03": "Mar",
  "04": "Apr", "05": "May", "06": "Jun",
  "07": "Jul", "08": "Aug", "09": "Sep",
  "10": "Oct", "11": "Nov", "12": "Dec"
};

const MonthlyChart = ({ data }) => {

  // Transform raw API data into recharts format
  const chartMap = {};

  data?.forEach((item) => {
    const key = `${MONTH_NAMES[item.month]} ${item.year}`;
    if (!chartMap[key]) {
      chartMap[key] = { month: key, income: 0, expense: 0 };
    }
    chartMap[key][item.type] = item.total;
  });

  const chartData = Object.values(chartMap).reverse();

  return (
    <Card elevation={3} sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>

        {/* Title */}
        <Typography variant="h6" fontWeight="bold" mb={2}>
          📊 Monthly Income vs Expense
        </Typography>

        {/* No data state */}
        {!chartData || chartData.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 300,
              color: "text.secondary",
            }}
          >
            <Typography>No data available yet</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString()}`]}
              />
              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill="#2e7d32"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#c62828"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

      </CardContent>
    </Card>
  );
};

export default MonthlyChart;