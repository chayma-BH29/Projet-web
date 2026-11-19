import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Market from "./pages/Market";
import Portfolio from "./pages/Portfolio";
import Charts from "./pages/Charts";
import AdminActions from "./pages/AdminActions";
import { useState } from "react";

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