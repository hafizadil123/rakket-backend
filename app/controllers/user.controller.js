/* eslint-disable linebreak-style */
/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unused-vars */

import BaseController from './base.controller';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import Constants from '../config/constants';
import { v4 as uuidv4 } from 'uuid';
const Post = require('../models/post');
const { cloudinary, UPLOAD_PRESET } = require('../utils/config');
const paginateResults = require('../utils/paginateResults');


const stripe = require('stripe')('strip_secret_key');

class UsersController extends BaseController {
	whitelist = [
	  'fullName',
	  'password',
	  'city',
	  'state',
	  'role',
	  'email',
	  'image',
	  'country',
	  'billName',
	  'billDescription',
	  'userId',
	];

 	getUser = async (req, res) => {
 	  const { username } = req.params;
 	  const page = Number(req.query.page);
 	  const limit = Number(req.query.limit);

 	  const user = await User.findOne({
		  username: { $regex: new RegExp('^' + username + '$', 'i') },
 	  });

 	  if (!user) {
		  return res
 	        .status(404)
 	        .send({ message: `Username '${username}' does not exist on server.` });
 	  }

 	  const postsCount = await Post.find({ author: user.id }).countDocuments();
 	  const paginated = paginateResults(page, limit, postsCount);
 	  const userPosts = await Post.find({ author: user.id })
		  .sort({ createdAt: -1 })
		  .select('-comments')
		  .limit(limit)
		  .skip(paginated.startIndex)
		  .populate('author', 'username')
		  .populate('subreddit', 'subredditName');

 	  const paginatedPosts = {
		  previous: paginated.results.previous,
		  results: userPosts,
		  next: paginated.results.next,
 	  };

 	  res.status(200).json({ userDetails: user, posts: paginatedPosts });
	  };

	 setUserAvatar = async (req, res) => {
	   const { avatarImage } = req.body;

	   if (!avatarImage) {
		  return res
	         .status(400)
	         .send({ message: 'Image URL needed for setting avatar.' });
	   }

	   const user = await User.findById(req.user);

	   if (!user) {
		  return res
	         .status(404)
	         .send({ message: 'User does not exist in database.' });
	   }

	   const uploadedImage = await cloudinary.uploader.upload(
		  avatarImage,
		  {
	         upload_preset: UPLOAD_PRESET,
		  },
		  (error) => {
	         if (error) return res.status(401).send({ message: error.message });
		  },
	   );

	   user.avatar = {
		  exists: true,
		  imageLink: uploadedImage.url,
		  imageId: uploadedImage.public_id,
	   };

	   const savedUser = await user.save();
	   res.status(201).json({ avatar: savedUser.avatar });
	  };

removeUserAvatar = async (req, res) => {
  const user = await User.findById(req.user);

  if (!user) {
    return res
        .status(404)
        .send({ message: 'User does not exist in database.' });
  }

  user.avatar = {
    exists: false,
    imageLink: 'null',
    imageId: 'null',
  };

  await user.save();
  res.status(204).end();
};
	// forget password
	forgetPassword = async (req, res, next) => {
	  const { password } = req.body;
	  try {
	    // find user by its id
	    const user = await User.findOne({ _id: req.params.userId }).select('password');
	    if (!user) {
	      return res.status(404).json({ msg: Constants.messages.userNotFound });
	    }
	    const decode = jwt.verify(req.params.token, Constants.security.sessionSecret);
	    if (!decode) {
	      return res.status(400).json({ msg: Constants.messages.linkExpire });
	    }

	    const salt = await bcrypt.genSalt(10);
	    user.password = await bcrypt.hash(password, salt);
	    await user.save();

	    return res.status(200).json({ msg: Constants.messages.userPasswordChangeSuccess });
	  } catch (err) {
	    if (err.message === 'jwt expired' || err.message === 'jwt malformed') {
	      return res.status(400).json({ msg: Constants.messages.linkExpire });
	    }
	    err.status = 400;
	    next(err);
	  }
	};
	// // reset user password
	resetPassword = async (req, res, next) => {
	  const { newPassword, userId } = req.body;

	  try {
	    const user = await User.findById({ _id: userId });
	    if (!user) {
	      return res.status(400).json({ message: Constants.messages.userNotFound, success: 0 });
	    }
	      const salt = await bcrypt.genSalt(10);
	      const updatedUser = await User.findByIdAndUpdate(
	          userId,
	          {
	            $set: {
	              password: await bcrypt.hash(newPassword, salt),
	            },
	          },
	          { new: true },
	      );
		  return res.status(200).json({ message: Constants.messages.userPasswordChangeSuccess,
	         success: 1,
			 user: updatedUser });
	  } catch (err) {
	    err.status = 400;
	    next(err);
	  }
	};

	// // upload user profile image
	changePicture = async (req, res, next) => {
	  try {
	    // find user by its id
	    const user = await User.findById({ _id: req.user.id }).select('imageUrl');
	    if (!user) {
	      return res.status(404).json({ msg: Constants.messages.userNotFound });
	    }
	    user.imageUrl = `${req.files.imageUrl[0].filename}`;
	    await user.save();
	    return res.status(200).json({ msg: 'Profile Uploaded Successfully!', imageUrl: user.imageUrl });
	  } catch (err) {
	    err.status = 400;
	    next(err);
	  }
	};

	// update user profile
	changeProfile = async (req, res, next) => {
	  // filter body data with whitelist data
	  const params = this.filterParams(req.body, this.whitelist);
	  try {
	    // find user by its id and update
	    const user = await User.findByIdAndUpdate({ _id: req.body.userId }, { $set: params }, { new: true });
	    if (!user) {
	      return res.status(404).json({ message: Constants.messages.userNotFound, success: 0 });
	    }
	    return res.status(200).json({ message: 'Profile Updated Successfully!', newUser: user, success: 1 });
	  } catch (err) {
	    err.status = 400;
	    next(err);
	  }
	};

	// upload user profile image
	deactivateAccount = async (req, res, next) => {
	  try {
	    // find user by its id
	    // find user by its id and update
	    const user = await User.findByIdAndUpdate({ _id: req.user.id }, { $set: { blocked: true } }, { new: true });
	    if (!user) {
	      return res.status(404).json({ msg: Constants.messages.userNotFound });
	    }
	    const data = {
	      id: user._id,
	      email: user.email,
	      firstName: user.firstName,
	      lastName: user.lastName,
	      address: user.address,
	      mobileNumber: user.mobileNumber,
	      blocked: user.blocked,
	      city: user.city,
	      country: user.country,
	      imageUrl: user.imageUrl,
	      userReferenceId: user.userId,
	    };

	    return res.status(200).json({ msg: 'Account Deactivated Successfully!', user: data });
	  } catch (err) {
	    err.status = 400;
	    next(err);
	  }
	};

	// get user profile

	sendMail = async (req, res, next) => {
	  try {
	    const user ={
	      fromEmail: req.body.fromEmail,
	      toEmail: req.body.toEmail,
	      text: req.body.text,
	    };
	    // will usee to send the email
	    // sendInquiryEmail(user);
	    res.status(200).json({
	      message: 'message has been sent',
	      success: 1,
	    });
	  } catch (err) {
	    next(err);
	  }
	}
	// will use this function if I need to add the checkout
	checkout = async (req, res, next) => {
	  let error;
	  let status;
	  try {
	    const { product, token, userId } = req.body;

	    const customer = await stripe.customers.create({
	      email: token.email,
	      source: token.id,
	    });

	    const idempotencyKey = uuidv4();
	    const charge = await stripe.charges.create(
			  {
	          amount: product.price * 100,
	          currency: 'usd',
	          customer: customer.id,
	          receipt_email: token.email,
	          description: `Purchased the ${product.name}`,
	          shipping: {
				  name: token.card.name || '',
				  address: {
	              line1: token.card.address_line1,
	              line2: token.card.address_line2,
	              city: token.card.address_city,
	              country: token.card.address_country,
	              postal_code: token.card.address_zip,
				  },
	          },
			  },
			  {
	          idempotencyKey,
			  },
	    );
	    console.log('Charge:', { charge });
	    const getUserObj = await Bill.findOne({
	      userId,
	    });
	    console.log('dddddddd', getUserObj, getUserObj.vote );
	    await Bill.findOneAndUpdate({
	      userId,
	    },
	    { $set: { vote: (getUserObj.vote + 1) || 0 } }, { new: true },
	    );
	    status = 'success';
	  } catch (error) {
	    console.error('Error:', error);
	    status = 'failure';
	  }

	  res.json({ error, status });
	  }


    getProfile = async (req, res, next) => {
      try {
      // find user by its id
      // find user by its id and update
        const user = await User.findById({ _id: req.user._id }).select('-password');
        if (!user) {
          return res.status(404).json({ msg: Constants.messages.userNotFound });
        }

        return res.status(200).json({ msg: Constants.messages.success, user: user });
      } catch (err) {
        err.status = 400;
        next(err);
      }
    };
}

export default new UsersController();
