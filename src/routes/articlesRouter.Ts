// Imports
import express = require('express');
import { ArticlesController } from '../controllers/articlesController';
import { authenticateJWT } from '../middleware/auth';

// Exports - Déclarations
export const articlesRouter = express.Router()
const articlesController = new ArticlesController()

// Routes
articlesRouter.get('/', articlesController.getArticles);
articlesRouter.get('/:id/comments', articlesController.getArticleByIdWithComments);
articlesRouter.post('/', authenticateJWT, articlesController.createArticle);
articlesRouter.put('/:id', authenticateJWT, articlesController.updateArticle);
articlesRouter.delete('/:id', authenticateJWT, articlesController.deleteArticle);

articlesRouter.get('/:id', articlesController.getArticleById); // USELESS