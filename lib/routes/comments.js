const { Router } = require('express');
const Comment = require('../models/Comment.js');
const ensureAuth = require('../middleware/ensureAuth.js');


module.exports = Router()

  .delete('/:id', ensureAuth, (req, res, next) => {
    Comment
      .findOneAndDelete({ commentBy: req.user._id, _id: req.params.id })
      .then(deleted => res.send(deleted))
      .catch(next);
  })

  .post('/', ensureAuth, (req, res, next) => {
    Comment
      .create(req.body)
      .then(post => res.send(post))
      .catch(next);
  })
;
