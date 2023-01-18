// Imports
import express = require("express");
import { CommentsController } from "../controllers/commentsController";
import { authenticateJWT } from "../middleware/auth";

// Exports - Déclarations
export const commentsRouter = express.Router();
// export const articlesRouter = express.Router();
const commentsController = new CommentsController();

// Routes
commentsRouter.get('/', commentsController.getAllComments);
commentsRouter.get('/:id', commentsController.getCommentById);
commentsRouter.get('/article/:id', commentsController.getCommentsByArticleId);
commentsRouter.post('/', authenticateJWT, commentsController.createComment);
commentsRouter.put('/:id', authenticateJWT, commentsController.updateComment);
commentsRouter.delete('/:id', authenticateJWT, commentsController.deleteComment);