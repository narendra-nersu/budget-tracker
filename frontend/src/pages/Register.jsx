import { useState } from "react";
import {
  Box, Button, TextField, Typography,
  Paper, Alert, CircularProgress
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await registerUser(form);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Try again.");
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
          Create your free account
        </Typography>

        {/* Alerts */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Form */}
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
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
          {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
        </Button>

        {/* Login Link */}
        <Typography variant="body2" textAlign="center">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1a237e", fontWeight: "bold" }}>
            Login here
          </Link>
        </Typography>

      </Paper>
    </Box>
  );
};

export default Register;