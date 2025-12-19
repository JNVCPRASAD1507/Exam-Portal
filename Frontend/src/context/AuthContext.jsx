import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user & token on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = async ({ rollNo, password, role }) => {
    const res = await api.post("/auth/login", {
      rollNo,     // KEEP STRING
      password,
      role,
    });

    const userData = res.data;

    setUser({
      rollNo: userData.rollNo,
      role: userData.role,
    });

    // Save token separately (BEST PRACTICE)
    localStorage.setItem("token", userData.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        rollNo: userData.rollNo,
        role: userData.role,
      })
    );

    // Attach token globally
    api.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;

    return userData;
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, api }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
