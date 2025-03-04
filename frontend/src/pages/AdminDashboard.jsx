import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
            setEditUser(null);  // clear the form
            fetchUsers(); // refresh the data
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Admin Dashboard</h2>
            
            {editUser && (
                <div style={{ marginBottom: '20px', border: '1px solid gray', padding: '10px' }}>
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
                    <button onClick={() => setEditUser(null)}>Cancel</button>
                </div>
            )}

            <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left' }}>
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
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>
                                {user.profile_photo ? (
                                    <img src={`http://localhost:5000${user.profile_photo}`} alt="Profile" width="50" />
                                ) : (
                                    'No Photo'
                                )}
                            </td>
                            <td>
                                <button onClick={() => handleEdit(user)}>Edit</button>
                                <button onClick={() => deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;
