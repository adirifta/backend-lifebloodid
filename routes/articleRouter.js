const express = require('express');
const bodyParser = require('body-parser');
const articleController = require('../controllers/articleController');

const router = express.Router();
router.use(bodyParser.json());

router.get('/articles', articleController.getAllArticles);
router.get('/articles/:id', articleController.getArticleById);
router.post('/articles', articleController.createArticle);
router.put('/articles/:id', articleController.updateArticle);
router.delete('/articles/:id', articleController.deleteArticle);

module.exports = router;