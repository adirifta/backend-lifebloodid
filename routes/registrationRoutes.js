const express = require('express');
const pool = require('../database/db'); // Assuming db.js is in the root directory
const router = express.Router();
const { generateRegistrationNumber, generateBarcode } = require('../utils/registrationUtils');

// Create a new registrant
router.post('/registrants', async (req, res) => {
    const { full_name, address, birth_date, gender, blood_type, phone_number } = req.body;
    const registration_number = generateRegistrationNumber();
    
    try {
        const [result] = await pool.execute(
            'INSERT INTO registrants (registration_number, full_name, address, birth_date, gender, blood_type, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [registration_number, full_name, address, birth_date, gender, blood_type, phone_number]
        );
        
        const barcode = generateBarcode(registration_number);
        res.status(201).json({ id: result.insertId, registration_number });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}); 

// Get all registrants
router.get('/registrants', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM registrants');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a registrant by ID
router.get('/registrants/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const [rows] = await pool.execute('SELECT * FROM registrants WHERE id = ?', [id]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Registrant not found' });
        } else {
            res.json(rows[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a registrant
router.put('/registrants/:id', async (req, res) => {
    const { id } = req.params;
    const { full_name, address, birth_date, gender, blood_type, phone_number } = req.body;
    
    try {
        const [result] = await pool.execute(
            'UPDATE registrants SET full_name = ?, address = ?, birth_date = ?, gender = ?, blood_type = ?, phone_number = ? WHERE id = ?',
            [full_name, address, birth_date, gender, blood_type, phone_number, id]
        );
        
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Registrant not found' });
        } else {
            res.json({ message: 'Registrant updated successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a registrant
router.delete('/registrants/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const [result] = await pool.execute('DELETE FROM registrants WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Registrant not found' });
        } else {
            res.json({ message: 'Registrant deleted successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;