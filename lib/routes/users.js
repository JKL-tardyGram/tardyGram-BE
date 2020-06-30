const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth');
const User = require('../models/User');

module.exports = Router()
  .get('/leader', ensureAuth, (req, res, next) => {
    User
      .getLeader()
      .then(user => res.send(user))
      .catch(next);
  })
  .get('/prolific', ensureAuth, (req, res, next) => {
    User
      .getProlific()
      .then(user => res.send(user))
      .catch(next);
  })

;
