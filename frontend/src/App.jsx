import { useState } from "react";
import Login from "./pages/Login";
import Charts from "./pages/Charts";
import Market from "./pages/Market";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Portfolio from "./pages/Portfolio";
import AdminActions from "./pages/AdminActions";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {

  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Market /></ProtectedRoute>} />
      <Route path="/portefeuille" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
      <Route path="/graphiques" element={<ProtectedRoute><Charts /></ProtectedRoute>} />
      <Route path="/admin/actions" element={<ProtectedRoute role="admin"><AdminActions /></ProtectedRoute>} />
    </Routes>
    </>
    
  );
}