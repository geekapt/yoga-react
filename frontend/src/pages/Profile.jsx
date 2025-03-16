import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState('profile');
    const [packages, setPackages] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    
    const navigate = useNavigate();

    // Redirect if not logged in
    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    // Fetch Gym Packages from backend
    useEffect(() => {
        fetch('http://localhost:5000/gym-packages')
            .then(response => response.json())
            .then(data => setPackages(data))
            .catch(error => console.error('Error fetching packages:', error));
    }, []);

    // Get Active Package Details
    const activePackage = packages.find(p => p.id === user?.active_package_id) || null;

    // Handle Purchase Click
    const handlePurchaseClick = (pkg) => {
        setSelectedPackage(pkg);
        setShowPaymentForm(true);
    };

    // Handle Payment Submission (Dummy)
    const handlePaymentSubmit = (e) => {
        e.preventDefault();

        if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
            alert('Please fill in all card details');
            return;
        }

        // Simulate Package Purchase
        handlePurchase(selectedPackage.id);
    };

    // Purchase Package Function
    const handlePurchase = async (packageId) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${user.id}/assign-package`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packageId })
            });

            if (response.ok) {
                alert('Package purchased successfully!');
                const updatedUser = { ...user, active_package_id: packageId };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setShowPaymentForm(false);
                setSelectedSection('profile');
            } else {
                console.error('Failed to assign package');
            }
        } catch (error) {
            console.error('Error purchasing package:', error);
        }
    };

    // Sidebar toggle handler
    const handleMenuClick = (section) => {
        setSelectedSection(section);
        if (window.innerWidth <= 768) setIsSidebarOpen(false);
    };

    if (!user) return null;

    return (
        <div className="profile-container">
            {/* Toggle Sidebar Button */}
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
                        <li onClick={() => handleMenuClick('packages')}>Package List</li>
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
                        {activePackage ? (
                            <div className="active-package">
                                <h3>Active Package</h3>
                                <p><strong>Name:</strong> {activePackage.name}</p>
                                <p><strong>Duration:</strong> {activePackage.duration}</p>
                                <p><strong>Details:</strong> {activePackage.details}</p>
                                <p><strong>Price:</strong> ${activePackage.price}</p>
                            </div>
                        ) : (
                            <p>No active package.</p>
                        )}
                    </div>
                ) : showPaymentForm && selectedPackage ? (
                    <div className="payment-form-container">
                        <h2>Complete Payment</h2>
                        <div className="selected-package-card">
                            <h3>{selectedPackage.name}</h3>
                            <p><strong>Duration:</strong> {selectedPackage.duration}</p>
                            <p><strong>Details:</strong> {selectedPackage.details}</p>
                            <p className="price">Price: ${selectedPackage.price}</p>
                        </div>

                        <form className="payment-form" onSubmit={handlePaymentSubmit}>
                            <label>Card Number</label>
                            <input 
                                type="text" 
                                placeholder="1234 5678 9012 3456" 
                                maxLength="16"
                                value={cardDetails.number}
                                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            />

                            <label>Expiry Date</label>
                            <input 
                                type="text" 
                                placeholder="MM/YY" 
                                maxLength="5"
                                value={cardDetails.expiry}
                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            />

                            <label>CVV</label>
                            <input 
                                type="password" 
                                placeholder="123" 
                                maxLength="3"
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            />

                            <button type="submit">Pay ${selectedPackage.price}</button>
                            <button type="button" className="cancel-btn" onClick={() => setShowPaymentForm(false)}>Cancel</button>
                        </form>
                    </div>
                ) : (
                    <div className="gym-packages">
                        <h2>Gym Packages</h2>
                        {packages.length > 0 ? (
                            <div className="packages-grid">
                                {packages.slice(0, 4).map(pkg => (
                                    <div key={pkg.id} className="package-card">
                                        <h3>{pkg.name}</h3>
                                        <p><strong>Details:</strong> {pkg.details}</p>
                                        <p><strong>Duration:</strong> {pkg.duration}</p>
                                        <p className="price">Price: ${pkg.price}</p>
                                        <button className="add-to-cart" onClick={() => handlePurchaseClick(pkg)}>
                                            {user.active_package_id === pkg.id ? 'Active Package' : 'Buy Now'}
                                        </button>
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
