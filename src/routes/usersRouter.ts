// Imports
import express = require('express');
import { UsersController } from '../controllers/usersController';
import { authenticateJWT } from '../middleware/auth';

// Exports - Déclarations
export const usersRouter = express.Router();
const usersController = new UsersController() 

// Routes
usersRouter.get('/', authenticateJWT, usersController.getUsers);
usersRouter.post('/register', usersController.register);
usersRouter.post('/login', usersController.login);