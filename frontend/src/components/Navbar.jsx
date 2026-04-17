import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1a237e" }}>
      <Toolbar>
        {/* Logo + Title */}
        <AccountBalanceWalletIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          Budget Tracker
        </Typography>

        {/* Nav Links */}
        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button color="inherit" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
            <Button color="inherit" onClick={() => navigate("/transactions")}>
              Transactions
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate("/grocery-planner")}
            >
              🛒 Grocery Planner
            </Button>
            <Typography variant="body2" sx={{ color: "#90caf9" }}>
              Hi, {user.name}
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
