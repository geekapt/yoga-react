import React, { useState } from 'react';
import axios from 'axios';

function EditForm({ user, onCancel, onUpdate }) {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:5000/user/${user.id}`, formData)
            .then(() => {
                onUpdate();
            })
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                <button type="submit">Update User</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
        </div>
    );
}

export default EditForm;
