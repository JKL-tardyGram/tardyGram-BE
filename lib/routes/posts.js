const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth');
const Post = require('../models/Post');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Post
      .create(req.body)
      .then(post => res.send(post))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Post
      .find()
      .then(posts => res.send(posts))
      .catch(next);   
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Post
      .findById(req.params.id)
      .then(post => res.send(post))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    Post
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(post => res.send(post))
      .catch(next);
  });
