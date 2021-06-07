/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
const cron = require('node-cron');
import helmet from 'helmet';
import users from './routes/users';
import admin from './routes/admin';
import posts from './routes/posts';
import subreddit from './routes/subreddits';
import Constants from './config/constants';

const { httpLogger } = require('./logger-middlewares');

const app = express();

// Helmet helps you secure your Express apps by setting various HTTP headers
// https://github.com/helmetjs/helmet
app.use(helmet());

// Enable CORS with various options
// https://github.com/expressjs/cors
// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Allow-Credentials', true);
//   next();
// });
app.use(cors());

// Request logger
// https://github.com/expressjs/morgan
if (!Constants.envs.test) {
  app.use(morgan('dev'));
}

// Parse incoming request bodies
// https://github.com/expressjs/body-parser
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Express FileUpload helps in handling and saving files
// https://www.npmjs.com/package/express-fileupload
app.use(fileUpload());

// Lets you use HTTP verbs such as PUT or DELETE
// https://github.com/expressjs/method-override
app.use(methodOverride());
app.use(httpLogger);
// Mount public routes
app.use('/public', express.static(`${__dirname}/public`));

// Mount API routes
app.use(`${Constants.apiPrefix}/users`, users);
app.use(`${Constants.apiPrefix}/admin`, admin);
app.use(`${Constants.apiPrefix}/posts`, posts);
app.use(`${Constants.apiPrefix}/subreddits`, subreddit);
// cron.schedule('0 12 * * 7', () => {
//   console.log('called');
//   UserController.setGovt();
// });
app.listen(Constants.port, () => {
  // eslint-disable-next-line no-console
  console.log(`
    Port: ${Constants.port}
    Env: ${app.get('env')}
  `);
});

export default app;
