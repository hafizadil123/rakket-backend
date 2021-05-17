/* eslint-disable linebreak-style */
import { Router } from 'express';
const { auth } = require('../utils/middleware');
import PostController from '../controllers/post.controller';
import PostVoteController from '../controllers/postVote.controller';
import PostCommentController from '../controllers/postComment.controller';
import CommentVote from '../controllers/commentVote.controller';
import errorHandler from '../middleware/error-handler';
const posts = new Router();


// CRUD posts routes
posts.get('/', PostController.getPosts);
posts.get('/search', PostController.getSearchedPosts);
posts.get('/:id/comments', PostController.getPostAndComments);
posts.get('/subscribed', auth, PostController.getSubscribedPosts);
posts.post('/', auth, PostController.createNewPost);
posts.patch('/:id', auth, PostController.updatePost);
posts.delete('/:id', auth, PostController.deletePost);

// posts vote routes
posts.post('/:id/upvote', auth, PostVoteController.upvotePost);
posts.post('/:id/downvote', auth, PostVoteController.downvotePost);

// post comments routes
posts.post('/:id/comment', auth, PostCommentController.postComment);
posts.delete('/:id/comment/:commentId', auth, PostCommentController.deleteComment);
posts.patch('/:id/comment/:commentId', auth, PostCommentController.updateComment);
posts.post('/:id/comment/:commentId/reply', auth, PostCommentController.postReply);
posts.delete('/:id/comment/:commentId/reply/:replyId', auth, PostCommentController.deleteReply);
posts.patch('/:id/comment/:commentId/reply/:replyId', auth, PostCommentController.updateReply);

// comment vote routes
posts.post('/:id/comment/:commentId/upvote', auth, CommentVote.upvoteComment);
posts.post('/:id/comment/:commentId/downvote', auth, CommentVote.downvoteComment);
posts.post('/:id/comment/:commentId/reply/:replyId/upvote', auth, CommentVote.upvoteReply);
posts.post(
    '/:id/comment/:commentId/reply/:replyId/downvote',
    auth,
    CommentVote.downvoteReply,
);
posts.use(errorHandler);
export default posts;
