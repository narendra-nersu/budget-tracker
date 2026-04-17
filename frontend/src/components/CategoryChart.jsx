import { Box, Card, CardContent, Typography } from "@mui/material";
import {
  PieChart, Pie, Cell, Tooltip,
  Legend, ResponsiveContainer
} from "recharts";

const COLORS = [
  "#1a237e", "#1565c0", "#0288d1",
  "#00838f", "#2e7d32", "#f9a825",
  "#e65100", "#c62828"
];

const CategoryChart = ({ data }) => {
  // Format data for recharts
  const chartData = data?.map((item) => ({
    name: item.category,
    value: item.total,
  }));

  return (
    <Card elevation={3} sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>

        {/* Title */}
        <Typography variant="h6" fontWeight="bold" mb={2}>
          💸 Spending by Category
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
            <Typography>No expense data for this month</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString()}`, "Amount"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

      </CardContent>
    </Card>
  );
};

export default CategoryChart;