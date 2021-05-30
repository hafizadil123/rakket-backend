/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import { Router } from 'express';
import UsersController from '../controllers/user.controller';
import AuthController from '../controllers/auth.controller';
import errorHandler from '../middleware/error-handler';
const { auth } = require('../utils/middleware');

const users = new Router();

// Users Routes

users.post('/register', AuthController.register);
users.get('/verify-email/:userId', AuthController.verifyEmail);
users.post('/login', AuthController.login);
users.post('/send-forget-password-email', AuthController.sendForgetPassEmail);
users.post('/forget-password/:userId/:token', AuthController.forgetPassword);
users.post('/reset-password', auth, AuthController.resetPassword);
// users.get('/get-users',auth, UsersController.getAllUsers);
// users.get('/get-user', auth, UsersController.getUserDetail);
users.post('/checkout', auth, UsersController.checkout);

users.post('/select-category', auth, UsersController.selectCategory);

users.put('/update-profile', auth, UsersController.changeProfile);
// users.get('/deactivateAccount', authenticate, UsersController.deactivateAccount);

users.get('/get-profile', auth, UsersController.getProfile);
// users.post('/checkout', UsersController.checkout);


users.get('/:username', UsersController.getUser);
users.post('/avatar', auth, UsersController.setUserAvatar);
users.delete('/avatar', auth, UsersController.removeUserAvatar);
users.use(errorHandler);

export default users;
