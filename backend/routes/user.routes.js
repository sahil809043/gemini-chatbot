import express from 'express';
import {
    getUserChats,
    createNewChat,
    getUserChat,
    updateChat,
} from '../controllers/user.controllers.js';
import Middleware from '../middleware/authentication.middleware.js';

const router = express.Router();

// Add middleware to all routes
router.route('/userchats').get(Middleware.decodeToken, getUserChats);
router.route('/chats').post(Middleware.decodeToken, createNewChat);
router.route('/chats/:id').get(Middleware.decodeToken, getUserChat);
router.route('/chats/:id').put(Middleware.decodeToken, updateChat);

export default router;
