/* eslint-disable linebreak-style */
/* eslint-disable max-len */

import BaseController from './base.controller';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
import Constants from '../config/constants';
import { sendResetPassEmail } from '../lib/util';

class AuthController extends BaseController {
 login = async (req, res) => {
   const { username, password } = req.body;
   const criteria = (username.indexOf('@') === -1) ? { username: { $regex: new RegExp('^' + username + '$', 'i') } } : { email: username };
   const user = await User.findOne(criteria);

   if (!user) {
     return res
         .status(400)
         .send({ message: `No account with this ${criteria.email ? `email '${criteria.email}'` : `username '${username}'`} has been registered.` });
   }

   const credentialsValid = await bcrypt.compare(password, user.passwordHash);

   if (!credentialsValid) {
     return res.status(401).send({ message: 'Invalid username or password.' });
   }

   const payloadForToken = {
     id: user._id,
   };

   const token = jwt.sign(payloadForToken, Constants.security.sessionSecret);

   res.status(200).json({
     token,
     username: user.username,
     id: user._id,
     email: user.email,
     avatar: user.avatar,
     role: user.role,
     karma: user.karmaPoints.postKarma + user.karmaPoints.commentKarma,
   });
 };

 register = async (req, res) => {
   const { username, password, email } = req.body;

   if (!password || password.length < 6) {
     return res
         .status(400)
         .send({ message: 'Password needs to be atleast 6 characters long.' });
   }

   if (!username || username.length > 20 || username.length < 3) {
     return res
         .status(400)
         .send({ message: 'Username character length must be in range of 3-20.' });
   }

   if (!email) {
     return res
         .status(400)
         .send({ message: 'Email is required' });
   }

   const existingUser = await User.findOne({ $or: [{ username: { $regex: new RegExp('^' + username + '$', 'i') } }, { email: email }] }).select('email username');

   if (existingUser) {
     return res.status(400).send({
       message: `User with '${existingUser.username === username ? username : email}' is already exist. Choose another one.`,
     });
   }

   const saltRounds = 10;
   const passwordHash = await bcrypt.hash(password, saltRounds);

   const user = new User({
     email,
     username,
     passwordHash,
   });

   const savedUser = await user.save();

   const payloadForToken = {
     id: savedUser._id,
   };

   const token = jwt.sign(payloadForToken, Constants.security.sessionSecret);

   res.status(200).json({
     token,
     username: savedUser.username,
     id: savedUser._id,
     email: savedUser.email,
     role: savedUser.role,
     avatar: savedUser.avatar,
     karma: 0,
   });
 };

 sendForgetPassEmail = async (req, res, next) => {
   const { username } = req.body;
   const criteria = (username.indexOf('@') === -1) ? { username: { $regex: new RegExp('^' + username + '$', 'i') } } : { email: username };

   try {
     const user = await User.findOne(criteria).select('username email');
     if (!user) {
       return res.status(404).json({ message: Constants.messages.userNotFound });
     }
     const payload = { id: user._id };
     const token = jwt.sign(payload, Constants.security.sessionSecret, {
       expiresIn: '2m', // 2 minutes
     });
     const link = `${Constants.messages.productionLinkFrontend}resetpass/${user._id}/${token}`;
     await sendResetPassEmail(user, link);
     return res.status(200).json({ message: Constants.messages.emailSuccess });
   } catch (err) {
     err.status = 400;
     next(err);
   }
 };

forgetPassword = async (req, res, next) => {
  const { password } = req.body;
  const { userId, token } = req.params;
  try {
    const user = await User.findById({ _id: userId }).select('password');
    if (!user) {
      return res.status(404).json({ message: Constants.messages.userNotFound });
    }
    const decode = jwt.verify(token, Constants.security.sessionSecret);
    if (!decode) {
      return res.status(400).json({ message: Constants.messages.linkExpire });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    await user.save();

    return res.status(200).json({ message: Constants.messages.passwordChangeSuccess });
  } catch (err) {
    if (err.message === 'jwt expired') {
      return res.status(400).json({ message: Constants.messages.linkExpire });
    }
  }
};

resetPassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById({ _id: req.user });
    if (!user) {
      return res.status(404).json({ message: Constants.messages.userNotFound });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (isMatch) {
      const salt = await bcrypt.genSalt(10);
      // eslint-disable-next-line no-unused-vars
      const updateUserPassword = await User.findByIdAndUpdate(
          req.user,
          {
            $set: {
              passwordHash: await bcrypt.hash(newPassword, salt),
            },
          },
          { new: true },
      );
      return res.status(200).json({ message: Constants.messages.passwordChangeSuccess });
    }
    return res.status(400).json({ message: Constants.messages.passwordNotMatched });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};
}
export default new AuthController();

