const db = require('../database/db');
const fs = require('fs');
const path = require('path');

// Get all locations
const getAllLocations = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM locations');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get location by ID
const getLocationById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM locations WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Create a new location
const createLocation = async (req, res) => {
    const { title, address } = req.body;
    const image = req.files && req.files.image;

    let imageUrl = null;
    if (image) {
        const ext = path.extname(image.name);
        const fileName = `${Date.now()}${ext}`;
        const uploadPath = path.join(__dirname, '..', 'public', 'images', fileName);
        
        await image.mv(uploadPath);
        imageUrl = `images/${fileName}`;
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO locations (title, image_url, address) VALUES (?, ?, ?)',
            [title, imageUrl, address]
        );
        res.status(201).json({ message: 'Location created', id: result.insertId });
    } catch (error) {
        console.error('Error creating location:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update a location
const updateLocation = async (req, res) => {
    const { id } = req.params;
    const { title, address } = req.body;
    const image = req.files && req.files.image;

    let imageUrl = null;
    if (image) {
        const ext = path.extname(image.name);
        const fileName = `${Date.now()}${ext}`;
        const uploadPath = path.join(__dirname, '..', 'public', 'images', fileName);
        
        await image.mv(uploadPath);
        imageUrl = `/images/${fileName}`;
    }

    try {
        const [rows] = await db.execute('SELECT * FROM locations WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Location not found' });
        }

        const oldImageUrl = rows[0].image_url;

        const [result] = await db.execute(
            'UPDATE locations SET title = ?, address = ?, image_url = ? WHERE id = ?',
            [title, address, imageUrl || oldImageUrl, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Location not found' });
        }

        if (imageUrl && oldImageUrl && imageUrl !== oldImageUrl) {
            fs.unlink(path.join(__dirname, '..', 'public', oldImageUrl), (err) => {
                if (err) console.error('Error deleting old image:', err);
            });
        }

        res.status(200).json({ message: 'Location updated' });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a location
const deleteLocation = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM locations WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Location not found' });
        }

        const imageUrl = rows[0].image_url;

        const [result] = await db.execute('DELETE FROM locations WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Location not found' });
        }

        if (imageUrl) {
            fs.unlink(path.join(__dirname, '..', 'public', imageUrl), (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }

        res.status(200).json({ message: 'Location deleted' });
    } catch (error) {
        console.error('Error deleting location:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation
};