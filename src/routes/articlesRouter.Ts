import express = require('express');
import { ArticlesController } from '../controllers/articlesController';
import { CommentsController } from '../controllers/commentsController';
import { authenticateJWT } from '../middleware/auth';

export const articlesRouter = express.Router()
const articlesController = new ArticlesController()
const commentsController = new CommentsController();

articlesRouter.get('/', articlesController.getArticles);
articlesRouter.get('/:id', articlesController.getArticleById);
articlesRouter.get('/:id/comments', authenticateJWT, articlesController.getArticleById, commentsController.getCommentsByArticleId);
articlesRouter.post('/', authenticateJWT, articlesController.createArticle);
articlesRouter.put('/:id', authenticateJWT, articlesController.updateArticle);
articlesRouter.delete('/:id', authenticateJWT, articlesController.deleteArticle);