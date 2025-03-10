const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // for profile images

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'yoga'
});

// Multer for file uploads (profile pictures)
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// User Registration
app.post('/register', upload.single('profilePic'), (req, res) => {
    const { name, email, phone, password } = req.body;

    // This was previously using `profilePic`, but your table column is `profile_photo`
    const profilePhoto = req.file ? `/uploads/${req.file.filename}` : null;

    // Fixed the SQL column name from `profile_pic` to `profile_photo`
    const sql = 'INSERT INTO users (name, email, phone, password, profile_photo) VALUES (?, ?, ?, ?, ?)';
    
    // Pass the correct variable name (`profilePhoto`)
    db.query(sql, [name, email, phone, password, profilePhoto], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'User registered successfully!' });
    });
});

// User Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
        res.json(result[0]);
    });
});

// Admin Login
app.post('/admin/login', (req, res) => {
    const { email, password } = req.body;

    // Simple check for admin credentials - you can enhance this
    const sql = 'SELECT * FROM admin WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(401).json({ message: 'Invalid admin credentials' });
        res.json({ message: 'Admin logged in successfully', admin: result[0] });
    });
});

// Fetch all users for Admin Dashboard
app.get('/admin/users', (req, res) => {
    const sql = 'SELECT id, name, email, phone, profile_photo FROM users';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});


// Fetch all users (for Admin)
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Edit User (Admin)
app.put('/user/:id', (req, res) => {
    const { name, email, phone } = req.body;
    const sql = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?';
    db.query(sql, [name, email, phone, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'User updated successfully' });
    });
});

// Delete User (Admin)
app.delete('/user/:id', (req, res) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'User deleted successfully' });
    });
});

// Add Admin User (with Password)
app.post('/register', (req, res) => {
    const { name, email, phone, password } = req.body;
    const sql = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, phone, password], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'User added successfully' });
    });
});


const PORT = 5000;
app.listen(PORT, '0.0.0.0',() => console.log('Server running on port 5000'));

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to database');
    }
});
