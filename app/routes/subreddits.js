/* eslint-disable linebreak-style */
import { Router } from 'express';
const { auth } = require('../utils/middleware');
import Subreddit from '../controllers/subreddit.controller';

const reddit = new Router();

reddit.get('/', Subreddit.getSubreddits);
reddit.get('/r/:subredditName', Subreddit.getSubredditPosts);
reddit.get('/top10', Subreddit.getTopSubreddits);
reddit.post('/', auth, Subreddit.createNewSubreddit);
reddit.patch('/:id', auth, Subreddit.editSubDescription);
reddit.post('/:id/subscribe', auth, Subreddit.subscribeToSubreddit);

export default reddit;
