/* eslint-disable linebreak-style */
/* eslint-disable max-len */

import BaseController from './base.controller';

const User = require('../models/user');
const Category = require('../models/category');
import Constants from '../config/constants';

class AdminController extends BaseController {
    addCategory = async (req, res) => {
      const { name } = req.body;
      const user = await User.findById({ _id: req.user });

      if (!user) {
        return res
            .status(400)
            .send({ message: Constants.messages.userNotFound });
      }

      if (!name) {
        return res
            .status(400)
            .send({ message: `Category name is requierd` });
      }

      const category = new Category({
        name,
      });

      await category.save();

      res.status(200).json({ message: 'Category added successfully!' });
    };

    getAllCategories = async (req, res) => {
      const categories = await Category.find({});

      res.status(200).json({ message: 'success', categories });
    };
}
export default new AdminController();
