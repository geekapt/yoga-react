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
    host: '192.168.1.44',
    user: 'yoga',
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


// Fetch Gym Packages
app.get('/gym-packages', (req, res) => {
    const sql = 'SELECT * FROM gym_packages';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Add a Gym Package
app.post('/gym-packages', (req, res) => {
    const { name, details, duration, price } = req.body;
    const sql = 'INSERT INTO gym_packages (name, details, duration, price) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, details, duration, price], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Package added successfully!' });
    });
});

// Edit a Gym Package
app.put('/gym-packages/:id', (req, res) => {
    const { name, details, duration, price } = req.body;
    const sql = 'UPDATE gym_packages SET name = ?, details = ?, duration = ?, price = ? WHERE id = ?';
    db.query(sql, [name, details, duration, price, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Package updated successfully!' });
    });
});

// Delete a Gym Package
app.delete('/gym-packages/:id', (req, res) => {
    const sql = 'DELETE FROM gym_packages WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Package deleted successfully!' });
    });
});

const fetchGymPackages = async () => {
  try {
    const response = await axios.get("http://192.168.1.44:5000/api/gym-packages");
    setGymPackages(response.data);
  } catch (error) {
    console.error("Error fetching gym packages:", error);
  }
};


// Assign a gym package to a user (purchase a package)
app.post('/users/:id/assign-package', (req, res) => {
    const { packageId } = req.body;
    const sql = 'UPDATE users SET active_package_id = ? WHERE id = ?';
    
    db.query(sql, [packageId, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Package assigned to user successfully!' });
    });
});

// Fetch User with Active Package
app.get('/users/:id', (req, res) => {
    const sql = `
        SELECT users.*, gym_packages.name AS active_package
        FROM users
        LEFT JOIN gym_packages ON users.active_package_id = gym_packages.id
        WHERE users.id = ?
    `;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
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