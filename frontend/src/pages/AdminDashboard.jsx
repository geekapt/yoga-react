import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditForm from './EditForm';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:5000/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
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

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
    );

    return (
        <div className="admin-dashboard">
            {editUser ? (
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
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td data-label="Profile"><img src={`http://localhost:5000${user.profile_photo}`} alt="Profile" className="profile-pic" /></td>
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
            )}
        </div>
    );
}

export default AdminDashboard;