const express = require('express');
const PostModel = require('../models/postsModel');
const postRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('cors');

postRouter
  .route('/')
  .get((req, res, next) => {
    PostModel.find()
      .then((posts) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(posts);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, cors(), (req, res, next) => {
    PostModel.create(req.body)
      .then((post) => {
        console.log('Post Created ', post);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(post);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /posts');
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    cors(),
    (req, res, next) => {
      PostModel.remove()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

postRouter
  .route('/:postId')
  .get((req, res, next) => {
    PostModel.findById(req.params.postId)
      .then((passportLocalMongoose) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(passportLocalMongoose);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /posts/${req.params.postId}`);
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    PostModel.findByIdAndUpdate(
      req.params.postId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((post) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(post);
      })
      .catch((err) => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      PostModel.findByIdAndDelete(req.params.postId)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

module.exports = postRouter;
