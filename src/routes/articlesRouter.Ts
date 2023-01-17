import express = require('express');
import { ArticlesController } from '../controllers/articlesController';
import { authenticateJWT } from '../middleware/auth';
export const articlesRouter = express.Router()
const articlesController = new ArticlesController()

articlesRouter.get('/', authenticateJWT, articlesController.getArticles);
articlesRouter.get('/:id', authenticateJWT, articlesController.getArticleById);
articlesRouter.post('/', authenticateJWT, articlesController.createArticle);
articlesRouter.put('/:id', authenticateJWT, articlesController.updateArticle);
articlesRouter.delete('/:id', authenticateJWT, articlesController.deleteArticle);