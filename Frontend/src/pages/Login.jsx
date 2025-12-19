import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call your backend login API
      const userData = await login({ rollNo: Number(rollNo), password });

      if (userData.role === "admin") {
        navigate("/preparetest");
      } else if (userData.role === "student") {
        navigate("/taketest");
      }
    } catch (err) {
      setError("Invalid Roll Number or Password");
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
            color="primary"
            onClick={() => setRole("admin")}
            sx={{ mr: 2 }}
          >
            Admin
          </Button>
          <Button
            variant={role === "student" ? "contained" : "outlined"}
            color="secondary"
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
            <Typography color="error" mt={1} mb={1}>
              {error}
            </Typography>
          )}

          <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 2 }}>
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;

