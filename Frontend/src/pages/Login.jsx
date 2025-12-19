import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = await login({
        rollNo,       // KEEP STRING
        password,
        role,         // IMPORTANT
      });

      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/taketest");
      }
    } catch (err) {
      setError("Invalid Roll Number or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Box sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" textAlign="center" mb={3}>
          Login
        </Typography>

        {/* Role Selection */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            variant={role === "admin" ? "contained" : "outlined"}
            onClick={() => setRole("admin")}
            sx={{ mr: 2 }}
          >
            Admin
          </Button>
          <Button
            variant={role === "student" ? "contained" : "outlined"}
            onClick={() => setRole("student")}
          >
            Student
          </Button>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Roll Number"
            fullWidth
            required
            margin="normal"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : `Login as ${role}`}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
