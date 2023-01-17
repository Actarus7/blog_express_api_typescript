import express = require("express");
import { CommentsController } from "../controllers/commentsController";
import { authenticateJWT } from "../middleware/auth";
//import { articlesRouter } from "./articlesRouter";

export const commentsRouter = express.Router();
const commentsController = new CommentsController();


commentsRouter.get('/', commentsController.getAllComments);
commentsRouter.get('/:id', commentsController.getCommentById);
commentsRouter.get('/article/:id', authenticateJWT, commentsController.getCommentsByArticleId);
commentsRouter.post('/', authenticateJWT, commentsController.createComment);
commentsRouter.put('/:id', authenticateJWT, commentsController.updateComment);
commentsRouter.delete('/:id', authenticateJWT, commentsController.deleteComment);

