import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import EditForm from './EditForm';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editUser, setEditUser] = useState(null);
    const [activeSection, setActiveSection] = useState('users'); // Manage Users or Gym Packages
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar State

     // Gym Packages
    const [gymPackages, setGymPackages] = useState([]);
    const [newPackage, setNewPackage] = useState({ name: '', details: '', duration: '', price: '' });
    const [editingPackage, setEditingPackage] = useState(null);


    useEffect(() => {
        fetchUsers();
        fetchGymPackages();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:5000/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error("Error fetching users:", err));
    };

    const fetchGymPackages = () => {
        axios.get('http://localhost:5000/gym-packages')
            .then(res => setGymPackages(res.data))
            .catch(err => console.error("Error fetching gym packages:", err));
    };

    const handleDeleteUser = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            axios.delete(`http://localhost:5000/user/${id}`)
                .then(() => fetchUsers())
                .catch(err => console.error(err));
        }
    };

    const handleEditUser = (user) => {
        setEditUser(user);
    };
    
    const handleCancelEdit = () => {
        setEditUser(null);
    };

    const handleUpdateUser = () => {
        setEditUser(null);
        fetchUsers();
    };

    // ✅ Wrap handleClickOutside in useCallback to fix ESLint warning
    const handleClickOutside = useCallback((event) => {
        if (
            sidebarOpen &&
            !event.target.closest('.admin-sidebar') && // Click is NOT inside sidebar
            !event.target.closest('.sidebar-toggle-btn') // Click is NOT on the toggle button
        ) {
            setSidebarOpen(false); // Close sidebar when clicking outside
        }
    }, [sidebarOpen]);

    useEffect(() => {
        if (sidebarOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => document.removeEventListener('click', handleClickOutside);
    }, [sidebarOpen, handleClickOutside]); // ✅ Fix: Added handleClickOutside to dependencies

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Gym Package Handlers
    const handleAddPackage = () => {
        axios.post('http://localhost:5000/gym-packages', newPackage)
            .then(() => {
                fetchGymPackages();
                setNewPackage({ name: '', details: '', duration: '', price: '' });
            })
            .catch(err => console.error(err));
    };

    const handleEditPackage = (pkg) => {
        setEditingPackage(pkg);
        setNewPackage(pkg);
    };

    const handleUpdatePackage = () => {
        axios.put(`http://localhost:5000/gym-packages/${editingPackage.id}`, newPackage)
            .then(() => {
                fetchGymPackages();
                setEditingPackage(null);
                setNewPackage({ name: '', details: '', duration: '', price: '' });
            })
            .catch(err => console.error(err));
    };

    const handleDeletePackage = (id) => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            axios.delete(`http://localhost:5000/gym-packages/${id}`)
                .then(() => fetchGymPackages())
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Sidebar Toggle Button that moves with Sidebar */}
            <button className={`sidebar-toggle-btn ${sidebarOpen ? 'move' : ''}`} onClick={handleSidebarToggle}>
                ☰
            </button>

            {/* Sidebar */}
            <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <button onClick={() => { setActiveSection('users'); setSidebarOpen(false); }}>Manage Users</button>
                <button onClick={() => { setActiveSection('gymPackages'); setSidebarOpen(false); }}>Manage Gym Packages</button>
            </div>

            <div className="admin-content">
                {activeSection === 'users' && (
                    editUser ? (
                        <EditForm user={editUser} onCancel={handleCancelEdit} onUpdate={handleUpdateUser} />
                    ) : (
                        <>
                            <h2>User Management</h2>
                            <input
                                type="text"
                                placeholder="Search by Name, Email or Phone"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th>Profile</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td data-label="Profile">
                                                <img src={`http://localhost:5000${user.profile_photo}`} alt="Profile" className="profile-pic" />
                                            </td>
                                            <td data-label="Name">{user.name}</td>
                                            <td data-label="Email">{user.email}</td>
                                            <td data-label="Phone">{user.phone}</td>
                                            <td data-label="Action">
                                                <button className="edit" onClick={() => handleEditUser(user)}>Edit</button>
                                                <button className="delete" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )
                )}

                {activeSection === 'gymPackages' && (
                    <div>
                        <h2>Manage Gym Packages</h2>

                        <input type="text" placeholder="Name" value={newPackage.name} onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })} />
                        <input type="text" placeholder="Details" value={newPackage.details} onChange={(e) => setNewPackage({ ...newPackage, details: e.target.value })} />
                        <input type="text" placeholder="Duration" value={newPackage.duration} onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })} />
                        <input type="text" placeholder="Price" value={newPackage.price} onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })} />
                        {editingPackage ? (
                            <button onClick={handleUpdatePackage}>Update Package</button>
                        ) : (
                            <button onClick={handleAddPackage}>Add Package</button>
                        )}

                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Details</th>
                                    <th>Duration</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gymPackages.map(pkg => (
                                    <tr key={pkg.id}>
                                        <td data-label="Name">{pkg.name}</td>
                                        <td data-label="Details">{pkg.details}</td>
                                        <td data-label="Duration">{pkg.duration}</td>
                                        <td data-label="Price">{pkg.price}</td>
                                        <td>
                                            <button onClick={() => handleEditPackage(pkg)}>Edit</button>
                                            <button onClick={() => handleDeletePackage(pkg.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
