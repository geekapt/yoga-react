import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css'; // Add this

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/user/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const handleEdit = (user) => {
        setEditUser(user);
    };

    const handleUpdateUser = async () => {
        try {
            await axios.put(`http://localhost:5000/user/${editUser.id}`, {
                name: editUser.name,
                email: editUser.email,
                phone: editUser.phone
            });
            setEditUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>

            {editUser && (
                <div className="edit-form">
                    <h3>Edit User</h3>
                    <input
                        type="text"
                        placeholder="Name"
                        value={editUser.name}
                        onChange={e => setEditUser({ ...editUser, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={editUser.email}
                        onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                    />
                    <input
                        type="tel"
                        placeholder="Phone"
                        value={editUser.phone}
                        onChange={e => setEditUser({ ...editUser, phone: e.target.value })}
                    />
                    <button onClick={handleUpdateUser}>Update</button>
                    <button className="cancel" onClick={() => setEditUser(null)}>Cancel</button>
                </div>
            )}

            <div className="responsive-table">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Profile Photo</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td data-label="ID">{user.id}</td>
                                <td data-label="Name">{user.name}</td>
                                <td data-label="Email">{user.email}</td>
                                <td data-label="Phone">{user.phone}</td>
                                <td data-label="Profile Photo">
                                    {user.profile_photo ? (
                                        <img src={`http://localhost:5000${user.profile_photo}`} alt="Profile" className="profile-pic" />
                                    ) : 'No Photo'}
                                </td>
                                <td data-label="Actions">
                                    <button className="edit" onClick={() => handleEdit(user)}>Edit</button>
                                    <button className="delete" onClick={() => deleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;
