import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
// import { AuthProvider } from "../context/AuthContext";

function App() {
  return (
    // <AuthProvider>
    //   <Router>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
            <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Optional: redirect "/" to /dashboard if logged in */}
         <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch-all route to redirect to login if no match */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    //   </Router>
    // </AuthProvider>
  );
}

export default App;