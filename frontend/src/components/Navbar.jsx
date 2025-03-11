import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/yooga-logo.png';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const menuRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const admin = JSON.parse(localStorage.getItem('admin'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        setMenuOpen(false);
        navigate('/login');
    };

    const handleAdminLogout = () => {
        localStorage.removeItem('admin');
        setMenuOpen(false);
        navigate('/admin/login');
    };

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [menuOpen]);

    return (
        <nav className={`navbar ${isMobile ? 'mobile' : ''}`}>
            <div className="navbar-left">
                <img src={logo} alt="YooGA Logo" className="logo" />
                <span className="welcome-text">Welcome to Yoga App</span>
            </div>

            {/* Display links for desktop, aligned to the right */}
            <div className={`desktop-links ${isMobile ? 'hidden' : ''}`}>
                <Link to="/">Home</Link>
                {admin && <Link to="/admin/dashboard">Dashboard</Link>}
                {user && !admin && (
                    <>
                        <span className='user-text'>Hello, {user.name}</span>
                        <Link to="/profile">Profile</Link>
                        <button className="small-btn" onClick={handleLogout}>Logout</button>
                    </>
                )}
                {admin && !user && (
                    <>
                        <span className="admin-text">Hello, Admin</span>
                        <button className="small-btn" onClick={handleAdminLogout}>Logout</button>
                    </>
                )}
                {!user && !admin && (
                    <>
                        <Link to="/register">Register</Link>
                        <Link to="/login">User Login</Link>
                        <Link to="/admin/login">Admin Login</Link>
                    </>
                )}
            </div>

            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </div>

            {/* Mobile Menu */}
            <div ref={menuRef} className={`navbar-right ${menuOpen ? 'open' : ''}`}>
                {isMobile && (
                    <>
                        <Link to="/" onClick={closeMenu}>Home</Link>
                        {admin && <Link to="/admin/dashboard" onClick={closeMenu}>Dashboard</Link>}
                        {user && !admin && (
                            <>
                                <span>Hello, {user.name}</span>
                                <Link to="/profile" onClick={closeMenu}>Profile</Link>
                                <button className="small-btn" onClick={handleLogout}>Logout</button>
                            </>
                        )}
                        {admin && !user && (
                            <>
                                <span className="admin-text">Hello, Admin</span>
                                <button className="small-btn" onClick={handleAdminLogout}>Logout</button>
                            </>
                        )}
                        {!user && !admin && (
                            <>
                                <Link to="/register" onClick={closeMenu}>Register</Link>
                                <Link to="/login" onClick={closeMenu}>User Login</Link>
                                <Link to="/admin/login" onClick={closeMenu}>Admin Login</Link>
                            </>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
