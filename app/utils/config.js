/* eslint-disable linebreak-style */
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
import AWS from 'aws-sdk';
import Constants from '../config/constants';

const accessKeyId = Constants.messages.accessKey;
const secretAccessKey = Constants.messages.secretKey;

const wasabiEndpoint = new AWS.Endpoint('s3.wasabisys.com');
const s3 = new AWS.S3({
  endpoint: wasabiEndpoint,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const SECRET = process.env.SECRET;
const UPLOAD_PRESET = process.env.UPLOAD_PRESET || 'ml_default';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
  PORT,
  MONGODB_URI,
  SECRET,
  cloudinary,
  UPLOAD_PRESET,
  s3,
};
