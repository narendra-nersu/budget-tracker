import { useState } from "react";
import {
  Box, Container, Typography, TextField, Button,
  MenuItem, IconButton, Paper, Divider, Chip, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Navbar from "../components/Navbar";

const PRIORITIES = ["High", "Medium", "Low"];
const UNITS = ["Kg", "L", "Piece", "Pack", "Dozen"];
const PRIORITY_ORDER = { High: 1, Medium: 2, Low: 3 };

const defaultItem = {
  name: "",
  pricePerUnit: "",
  desiredQty: "",
  unit: "Kg",
  priority: "Medium",
};

const GroceryPlanner = () => {
  const [budget, setBudget] = useState("");
  const [items, setItems] = useState([{ ...defaultItem }]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ── Add new item row ──────────────────────────────────────
  const addItem = () => {
    setItems([...items, { ...defaultItem }]);
  };

  // ── Remove item row ───────────────────────────────────────
  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // ── Handle item field change ──────────────────────────────
  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // ── Core Algorithm ────────────────────────────────────────
  // Priority-based + Round-robin for same priority
  const runAlgorithm = () => {
    setError("");
    setResult(null);

    // Validate budget
    const totalBudget = parseFloat(budget);
    if (!totalBudget || totalBudget <= 0) {
      setError("Please enter a valid budget amount.");
      return;
    }

    // Validate items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.name.trim()) {
        setError(`Item ${i + 1}: Please enter a name.`);
        return;
      }
      if (!item.pricePerUnit || parseFloat(item.pricePerUnit) <= 0) {
        setError(`Item ${i + 1}: Please enter a valid price.`);
        return;
      }
      if (!item.desiredQty || parseFloat(item.desiredQty) <= 0) {
        setError(`Item ${i + 1}: Please enter a valid quantity.`);
        return;
      }
    }

    // Build working list
    let workingList = items.map((item, index) => ({
      id: index,
      name: item.name.trim(),
      pricePerUnit: parseFloat(item.pricePerUnit),
      desiredQty: parseFloat(item.desiredQty),
      unit: item.unit,
      priority: item.priority,
      allocatedQty: 0,
      totalCost: 0,
    }));

    let remainingBudget = totalBudget;

    // Sort by priority order
    const priorityGroups = {};
    PRIORITIES.forEach((p) => {
      priorityGroups[p] = workingList.filter((i) => i.priority === p);
    });

    // Process each priority group with round-robin
    for (const priority of PRIORITIES) {
      const group = priorityGroups[priority].filter(
        (item) => item.allocatedQty < item.desiredQty
      );

      if (group.length === 0) continue;

      // Round-robin: give 1 unit at a time to each item in group
      let madeProgress = true;
      while (madeProgress && remainingBudget > 0) {
        madeProgress = false;
        for (const item of group) {
          if (item.allocatedQty >= item.desiredQty) continue;
          if (item.pricePerUnit > remainingBudget) continue;

          // Allocate 1 unit
          item.allocatedQty += 1;
          item.totalCost += item.pricePerUnit;
          remainingBudget -= item.pricePerUnit;
          remainingBudget = parseFloat(remainingBudget.toFixed(2));
          madeProgress = true;
        }
      }
    }

    // Build results
    const bought = workingList.filter((i) => i.allocatedQty > 0);
    const skipped = workingList.filter((i) => i.allocatedQty === 0);
    const partial = bought.filter((i) => i.allocatedQty < i.desiredQty);
    const totalSpent = parseFloat((totalBudget - remainingBudget).toFixed(2));

    setResult({
      bought,
      skipped,
      partial,
      totalBudget,
      totalSpent,
      remainingBudget: parseFloat(remainingBudget.toFixed(2)),
    });
  };

  // ── Reset ─────────────────────────────────────────────────
  const handleReset = () => {
    setBudget("");
    setItems([{ ...defaultItem }]);
    setResult(null);
    setError("");
  };

  return (
    <Box sx={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <ShoppingCartIcon sx={{ color: "#1a237e", fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold" color="#1a237e">
            Smart Grocery Planner
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter your budget and grocery items. The planner will allocate
          items based on priority — High first, then Medium, then Low.
        </Typography>

        {/* Budget Input */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            💰 Total Budget (₹)
          </Typography>
          <TextField
            size="small"
            type="number"
            placeholder="e.g. 5000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            sx={{ width: 250 }}
            InputProps={{
              startAdornment: (
                <Typography sx={{ mr: 1, color: "text.secondary" }}>₹</Typography>
              ),
            }}
          />
        </Paper>

        {/* Items Table */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            🛒 Grocery List
          </Typography>

          {/* Error */}
          {error && (
            <Typography color="error" variant="body2" mb={2}>
              ⚠️ {error}
            </Typography>
          )}

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e8eaf6" }}>
                  {["Item Name", "Price / Unit (₹)", "Desired Qty", "Unit", "Priority", ""].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: "bold", color: "#1a237e" }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>

                    {/* Name */}
                    <TableCell>
                      <TextField
                        size="small" placeholder="e.g. Rice"
                        value={item.name}
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                        sx={{ width: 150 }}
                      />
                    </TableCell>

                    {/* Price */}
                    <TableCell>
                      <TextField
                        size="small" type="number" placeholder="e.g. 60"
                        value={item.pricePerUnit}
                        onChange={(e) => handleChange(index, "pricePerUnit", e.target.value)}
                        sx={{ width: 120 }}
                      />
                    </TableCell>

                    {/* Qty */}
                    <TableCell>
                      <TextField
                        size="small" type="number" placeholder="e.g. 2"
                        value={item.desiredQty}
                        onChange={(e) => handleChange(index, "desiredQty", e.target.value)}
                        sx={{ width: 100 }}
                      />
                    </TableCell>

                    {/* Unit */}
                    <TableCell>
                      <TextField
                        select size="small"
                        value={item.unit}
                        onChange={(e) => handleChange(index, "unit", e.target.value)}
                        sx={{ width: 100 }}
                      >
                        {UNITS.map((u) => (
                          <MenuItem key={u} value={u}>{u}</MenuItem>
                        ))}
                      </TextField>
                    </TableCell>

                    {/* Priority */}
                    <TableCell>
                      <TextField
                        select size="small"
                        value={item.priority}
                        onChange={(e) => handleChange(index, "priority", e.target.value)}
                        sx={{ width: 110 }}
                      >
                        {PRIORITIES.map((p) => (
                          <MenuItem key={p} value={p}>
                            {p === "High" ? "🔴 High" : p === "Medium" ? "🟡 Medium" : "🟢 Low"}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>

                    {/* Delete */}
                    <TableCell>
                      <IconButton
                        size="small" onClick={() => removeItem(index)}
                        sx={{ color: "#c62828" }}
                        disabled={items.length === 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add Item */}
          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={addItem}
            sx={{ mt: 2, color: "#1a237e" }}
          >
            Add Item
          </Button>

        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={runAlgorithm}
            sx={{ backgroundColor: "#1a237e", px: 4 }}
          >
            🧮 Calculate
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={handleReset}
            sx={{ borderColor: "#1a237e", color: "#1a237e" }}
          >
            Reset
          </Button>
        </Box>

        {/* ── Results Section ─────────────────────────────── */}
        {result && (
          <Box>

            {/* Summary Cards */}
            <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
              {[
                { label: "Total Budget", value: `₹${result.totalBudget.toLocaleString()}`, color: "#1a237e", bg: "#e8eaf6" },
                { label: "Total Spent", value: `₹${result.totalSpent.toLocaleString()}`, color: "#2e7d32", bg: "#e8f5e9" },
                { label: "Remaining", value: `₹${result.remainingBudget.toLocaleString()}`, color: "#e65100", bg: "#fff3e0" },
              ].map((card) => (
                <Paper
                  key={card.label}
                  elevation={3}
                  sx={{ p: 2, borderRadius: 3, backgroundColor: card.bg, minWidth: 180 }}
                >
                  <Typography variant="body2" color="text.secondary" fontWeight="bold">
                    {card.label}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: card.color }}>
                    {card.value}
                  </Typography>
                </Paper>
              ))}
            </Box>

            {/* Items You Can Buy */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="#2e7d32" mb={2}>
               Items You Can Buy ({result.bought.length})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
                      {["Item", "Priority", "Allocated Qty", "Unit", "Cost"].map((h) => (
                        <TableCell key={h} sx={{ fontWeight: "bold" }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.bought.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.priority}
                            size="small"
                            sx={{
                              backgroundColor:
                                item.priority === "High" ? "#ffebee" :
                                item.priority === "Medium" ? "#fff8e1" : "#e8f5e9",
                              color:
                                item.priority === "High" ? "#c62828" :
                                item.priority === "Medium" ? "#f9a825" : "#2e7d32",
                              fontWeight: "bold",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {item.allocatedQty} / {item.desiredQty}
                          {item.allocatedQty < item.desiredQty && (
                            <Chip label="Partial" size="small"
                              sx={{ ml: 1, backgroundColor: "#fff3e0", color: "#e65100", fontSize: 10 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#2e7d32" }}>
                          ₹{item.totalCost.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Skipped Items */}
            {result.skipped.length > 0 && (
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="#c62828" mb={2}>
                  Skipped Items ({result.skipped.length}) — Budget Insufficient
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#ffebee" }}>
                        {["Item", "Priority", "Desired Qty", "Unit", "Would Cost"].map((h) => (
                          <TableCell key={h} sx={{ fontWeight: "bold" }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {result.skipped.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={item.priority} size="small"
                              sx={{
                                backgroundColor:
                                  item.priority === "High" ? "#ffebee" :
                                  item.priority === "Medium" ? "#fff8e1" : "#e8f5e9",
                                color:
                                  item.priority === "High" ? "#c62828" :
                                  item.priority === "Medium" ? "#f9a825" : "#2e7d32",
                                fontWeight: "bold",
                              }}
                            />
                          </TableCell>
                          <TableCell>{item.desiredQty}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell sx={{ color: "#c62828", fontWeight: "bold" }}>
                            ₹{(item.pricePerUnit * item.desiredQty).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

          </Box>
        )}

      </Container>
    </Box>
  );
};

export default GroceryPlanner;