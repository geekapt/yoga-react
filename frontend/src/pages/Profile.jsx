import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    // const handleLogout = () => {
    //     localStorage.removeItem('user');
    //     navigate('/login');
    // };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className={`profile-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>


            <div className="profile-content">
                <h2>Welcome, {user.name}</h2>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                {user.profile_pic && (
                    <img src={`http://localhost:5000${user.profile_pic}`} alt="Profile" className="profile-pic" />
                )}
            </div>
            <div className="sidebar">
                <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    ☰
                </button>
                <nav>
                    <ul>
                        <li onClick={() => navigate('/')}>Home</li>
                        <li onClick={Profile}>Packages</li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Profile;
