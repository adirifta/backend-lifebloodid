const db = require('../database/db');
const { hashPassword, comparePasswords, generateToken, validateEmail } = require('../middleware/auth');

const register = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate email
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format. Only Gmail addresses are allowed.' });
    }

    try {
        // Hash the password
        const hashedPassword = await hashPassword(password);

        const [rows, fields] = await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [
            username,
            email,
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
    const { credential, password } = req.body;

    try {
        // Determine if the credential is an email or username
        const isEmail = validateEmail(credential);
        const query = isEmail ? 'SELECT * FROM users WHERE email = ?' : 'SELECT * FROM users WHERE username = ?';
        const [rows, fields] = await db.execute(query, [credential]);

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