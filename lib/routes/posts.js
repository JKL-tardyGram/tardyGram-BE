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
      .populate('comments')
      .then(post => res.send(post))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    Post
      .findOneAndUpdate({ user: req.user._id, _id: req.params.id }, req.body, { new: true })
      .then(post => res.send(post))
      .catch(next);
  })
  
  .delete('/:id', ensureAuth, (req, res, next) => {
    Post
      .findOneAndDelete({ user: req.user._id, _id: req.params.id })
      .then(post => res.send(post))
      .catch(next);
  })
  
;
