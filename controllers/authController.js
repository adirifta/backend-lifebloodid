const db = require('../helpers/db');
const { hashPassword, comparePasswords, generateToken } = require('../helpers/auth');

const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await hashPassword(password);

        const [rows, fields] = await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [
            username,
            hashedPassword
        ]);

        // Generate JWT token
        const token = generateToken(rows.insertId);

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Get user from database
        const [rows, fields] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const match = await comparePasswords(password, rows[0].password);

        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateToken(rows[0].id);

        res.status(200).json({ message: 'Login successful', token });
        console.log('berhasil login')
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    register,
    login
};