// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const checkUser = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me"); // protected route
        setUser(res.data); // actual verified user
      } catch (err) {
        console.error("Token invalid:", err.response?.data?.message || err.message);
        logout(); // remove token + clear user
      }
    }

    setLoading(false);
  };

  checkUser();
}, []);


  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
      toast.success("Login successful!");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
      toast.success("Registration successful!");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
