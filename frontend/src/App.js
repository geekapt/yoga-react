import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';  // New file for Admin Login
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home'; 


const App = () => (
    <Router>
        <Navbar />
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/login" element={<AdminLogin />} />   {/* Add this */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* <Route path="/" element={<h3>Welcome to Yoga App</h3>} /> */}
            <Route path="/" element={<Home />} />   {/* Use Home component for the root path */}
        </Routes>
    </Router>
);

export default App;
