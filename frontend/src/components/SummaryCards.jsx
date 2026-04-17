import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const SummaryCards = ({ totals }) => {
  const cards = [
    {
      title: "Total Income",
      value: totals?.income || 0,
      icon: <TrendingUpIcon fontSize="large" />,
      color: "#2e7d32",
      bg: "#e8f5e9",
    },
    {
      title: "Total Expenses",
      value: totals?.expense || 0,
      icon: <TrendingDownIcon fontSize="large" />,
      color: "#c62828",
      bg: "#ffebee",
    },
    {
      title: "Balance",
      value: totals?.balance || 0,
      icon: <AccountBalanceIcon fontSize="large" />,
      color: "#1a237e",
      bg: "#e8eaf6",
    },
  ];

  return (
    <Grid container spacing={3} mb={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Card elevation={3} sx={{ borderRadius: 3, backgroundColor: card.bg }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                {/* Text */}
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="bold">
                    {card.title}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: card.color, mt: 0.5 }}>
                    ₹{card.value.toLocaleString()}
                  </Typography>
                </Box>

                {/* Icon */}
                <Box sx={{ color: card.color }}>
                  {card.icon}
                </Box>

              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;