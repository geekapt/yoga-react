import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState('profile');
    const [packages, setPackages] = useState([]);

    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        fetch('http://localhost:5000/packages')
            .then(response => response.json())
            .then(data => setPackages(data))
            .catch(error => console.error('Error fetching packages:', error));
    }, []);

    if (!user) return null;

    // Function to handle menu clicks and close sidebar in mobile view
    const handleMenuClick = (section) => {
        setSelectedSection(section);
        if (window.innerWidth <= 768) { // Auto-hide sidebar on mobile
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="profile-container">
            {/* Toggle button */}
            <button className={`toggle-btn ${isSidebarOpen ? 'move-right' : ''}`} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                ☰
            </button>

            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-profile">
                    {user.profile_photo && (
                        <img src={`http://localhost:5000${user.profile_photo}`} alt="Profile" className="profile-pic" />
                    )}
                    <h3>Welcome, {user.name}</h3>
                    <p>{user.email}</p>
                    <p>{user.phone}</p>
                </div>
                <nav>
                    <ul>
                        <li onClick={() => handleMenuClick('profile')}>Profile</li>
                        <li onClick={() => handleMenuClick('packages')}>Packages</li>
                    </ul>
                </nav>
            </div>

            {/* Profile Content */}
            <div className="profile-content">
                {selectedSection === 'profile' ? (
                    <div>
                        <h2>Welcome, {user.name}</h2>
                        <p>Email: {user.email}</p>
                        <p>Phone: {user.phone}</p>
                    </div>
                ) : (
                    <div className="gym-packages">
                        <h2>Gym Packages</h2>
                        {packages.length > 0 ? (
                            <div className="packages-grid">
                                {packages.slice(0, 4).map(pkg => (
                                    <div key={pkg.id} className="package-card">
                                        <h3>{pkg.name}</h3>
                                        <p>{pkg.description}</p>
                                        <p className="price">Price: ${pkg.price}</p>
                                        <button className="add-to-cart">Add to Cart</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No packages available.</p>
                        )}
                    </div>

                )}
            </div>
        </div>
    );
};

export default Profile;
