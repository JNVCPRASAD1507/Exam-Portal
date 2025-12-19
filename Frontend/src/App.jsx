import React from "react";
import {Routes, Route } from "react-router-dom";
import PrepareTest from "./components/PrepareTest";
import TakeTest from "./components/TakeTest";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import CreateStudent from "./pages/CreateStudent";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  return (
     
      
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* ADMIN ONLY */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ADMIN ONLY CREATE STUDENTS */}
          <Route
            path="/admin/create-student"
            element={
              <ProtectedRoute role="admin">
                <CreateStudent />
              </ProtectedRoute>
            }
          />

          {/* STUDENT ONLY */}
          <Route
            path="/taketest"
            element={
              <ProtectedRoute role="student">
                <TakeTest />
              </ProtectedRoute>
            }
          />

          {/* <Route
            path="/student/progress"
            element={
              <ProtectedRoute role="student">
                <StudentProgress />
              </ProtectedRoute>
            }
          /> */}

          <Route path="*" element={<Login />} />
        </Routes>
      
     
  );
};

export default App;
