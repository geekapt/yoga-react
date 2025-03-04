const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');  // You'll need to create this to manage your DB connection (cleaner)

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Register Route
router.post('/register', upload.single('profilePic'), (req, res) => {
    const { name, email, phone, password } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = 'INSERT INTO users (name, email, phone, password, profile_pic) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, phone, password, profilePic], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'User registered successfully!' });
    });
});

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (result.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        res.json(result[0]);
    });
});

module.exports = router;
