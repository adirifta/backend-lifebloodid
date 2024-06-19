const express = require('express');
const router = express.Router();
const {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} = require('../controllers/articleController');
const upload = require('../middleware/upload');

router.get('/articles', getAllArticles);
router.get('/articles/:id', getArticleById);
router.post('/articles', upload.single('image'), createArticle);
router.put('/articles/:id', upload.single('image'), updateArticle);
router.delete('/articles/:id', deleteArticle);

module.exports = router;
