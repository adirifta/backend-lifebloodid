const db = require('../helpers/db');

const getAllArticles = async (req, res) => {
    try {
        const [rows, fields] = await db.execute('SELECT * FROM articles');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getArticleById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows, fields] = await db.execute('SELECT * FROM articles WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const createArticle = async (req, res) => {
    const { title, content, author } = req.body;
    try {
        const [result] = await db.execute('INSERT INTO articles (title, content, author) VALUES (?, ?, ?)', [
            title, content, author
        ]);
        res.status(201).json({ message: 'Article created', id: result.insertId });
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateArticle = async (req, res) => {
    const { id } = req.params;
    const { title, content, author } = req.body;
    try {
        const [result] = await db.execute('UPDATE articles SET title = ?, content = ?, author = ? WHERE id = ?', [
            title, content, author, id
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json({ message: 'Article updated' });
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteArticle = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('DELETE FROM articles WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Article not found' });
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