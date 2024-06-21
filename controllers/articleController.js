const db = require('../database/db');
const path = require('path');
const fs = require('fs');

// Get all articles
const getAllArticles = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM articles');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get article by ID
const getArticleById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM articles WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }
        const article = rows[0];
        // Add image URL if available
        article.imageUrl = article.image_url ? `${req.protocol}://${req.get('host')}/${article.image_url}` : null;
        res.status(200).json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Create a new article
const createArticle = async (req, res) => {
    if (!req.files || !req.files.file) return res.status(400).json({ msg: "No File Uploaded" });

    const { title, content, author } = req.body;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = `${file.md5}${ext}`;
    const url = `${req.protocol}://${req.get("host")}/api/images/${fileName}`;
    const allowedTypes = ['.png', '.jpg', '.jpeg'];

    if (!allowedTypes.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Image" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });

        try {
            const [result] = await db.execute(
                'INSERT INTO articles (title, content, author, image_url) VALUES (?, ?, ?, ?)',
                [title, content, author, `images/${fileName}`]
            );
            res.status(201).json({ msg: "Article created", id: result.insertId, imageUrl: url });
        } catch (error) {
            console.error('Error creating article:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
};

// Update an article
const updateArticle = async (req, res) => {
    const { id } = req.params;
    const { title, content, author } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM articles WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const oldImageUrl = rows[0].image_url;
        let imageUrl = oldImageUrl;

        if (req.files && req.files.file) {
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            const fileName = `${file.md5}${ext}`;
            const newUrl = `images/${fileName}`;

            if (!['.png', '.jpg', '.jpeg'].includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Image" });
            if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

            file.mv(`./public/${newUrl}`, async (err) => {
                if (err) return res.status(500).json({ msg: err.message });
            });

            imageUrl = newUrl;
        }

        const [result] = await db.execute(
            'UPDATE articles SET title = ?, content = ?, author = ?, image_url = ? WHERE id = ?',
            [title, content, author, imageUrl, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }

        if (req.files && req.files.file && oldImageUrl && imageUrl !== oldImageUrl) {
            fs.unlink(path.join(__dirname, '..', 'public', oldImageUrl), (err) => {
                if (err) console.error('Error deleting old image:', err);
            });
        }

        res.status(200).json({ message: 'Article updated' });
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete an article
const deleteArticle = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM articles WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const imageUrl = rows[0].image_url;

        const [result] = await db.execute('DELETE FROM articles WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }

        if (imageUrl) {
            fs.unlink(path.join(__dirname, '..', 'public', imageUrl), (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }

        res.status(200).json({ message: 'Article deleted' });
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};