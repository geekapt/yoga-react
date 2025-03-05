import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="profile-container">
            <h2>Welcome, {user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            {user.profile_pic && (
                <img src={`http://192.168.68.200:5000${user.profile_pic}`} alt="Profile" className="profile-pic" />
            )}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Profile;
