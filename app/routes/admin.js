/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import { Router } from 'express';
import AdminController from '../controllers/admin.controller';
import errorHandler from '../middleware/error-handler';
const { auth } = require('../utils/middleware');

const admin = new Router();

// Categories Routes

admin.post('/add-category', auth, AdminController.addCategory);
admin.get('/categories', AdminController.getAllCategories);

admin.use(errorHandler);

export default admin;
