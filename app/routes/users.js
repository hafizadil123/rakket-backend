/* eslint-disable max-len */
import { Router } from 'express';
import UsersController from '../controllers/user.controller';
import AuthController from '../controllers/auth.controller';
import errorHandler from '../middleware/error-handler';
const { auth } = require('../utils/middleware');

const users = new Router();

// Users Routes
users.get('/test', (req, res) => {
  res.json({
    message: 'welcome in rakket way',
  });
});
users.post('/register', AuthController.register);
users.post('/login', AuthController.login);
// users.get('/get-users',auth, UsersController.getAllUsers);
// users.get('/get-user', auth, UsersController.getUserDetail);
users.post('/checkout', auth, UsersController.checkout);

users.put('/update-profile', auth, UsersController.changeProfile);
// users.get('/deactivateAccount', authenticate, UsersController.deactivateAccount);

users.get('/get-profile', auth, UsersController.getProfile);
// users.post('/checkout', UsersController.checkout);


users.get('/:username', UsersController.getUser);
users.post('/avatar', auth, UsersController.setUserAvatar);
users.delete('/avatar', auth, UsersController.removeUserAvatar);
users.use(errorHandler);

export default users;
