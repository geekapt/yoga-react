import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const admin = JSON.parse(localStorage.getItem('admin'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleAdminLogout = () => {
        localStorage.removeItem('admin');
        navigate('/admin/login');
    };

    return (
        <nav className="navbar">
            <Link to="/">Home</Link>

            {/* User Links (if user is logged in) */}
            {user && !admin && (
                <>
                    <span>Hello, {user.name}</span>
                    <Link to="/profile">Profile</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            )}

            {/* Admin Links (if admin is logged in) */}
            {admin && !user && (
                <>
                    <span>Hello, Admin</span>
                    <Link to="/admin/dashboard">Dashboard</Link> {/* Add Dashboard Link */}
                    <button onClick={handleAdminLogout}>Logout</button>
                </>
            )}

            {/* Public Links (when no one is logged in) */}
            {!user && !admin && (
                <>
                    <Link to="/register">Register</Link>
                    <Link to="/login">User Login</Link>
                    <Link to="/admin/login">Admin Login</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
