const express = require('express');
const router = express.Router();

// Temporary in-memory user store (you can replace with DB logic later)
const users = [];

// Register Route
router.post('/register', (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    users.push({ name, email, phone, password });
    res.status(201).json({ message: 'User registered successfully!' });
});

// Login Route (optional, if needed)
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user });
});

module.exports = router;
