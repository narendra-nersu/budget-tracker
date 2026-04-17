import { useState } from "react";
import {
  Box, Button, TextField, Typography,
  Paper, Alert, CircularProgress
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: 380, borderRadius: 3 }}>

        {/* Title */}
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
          💰 Budget Tracker
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
          Login to manage your finances
        </Typography>

        {/* Error */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Form */}
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />

        {/* Submit */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ backgroundColor: "#1a237e", mb: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>

        {/* Register Link */}
        <Typography variant="body2" textAlign="center">
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#1a237e", fontWeight: "bold" }}>
            Register here
          </Link>
        </Typography>

      </Paper>
    </Box>
  );
};

export default Login;