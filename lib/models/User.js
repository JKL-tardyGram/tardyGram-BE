const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({

  username: {
    type: String,
    required: true
  },

  passwordHash: {
    type: String,
    required: true
  },

  profilePhotoUrl: {
    type: String,
    required: true
  }

});

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, +process.env.SALT_ROUNDS || 8);
});

schema.statics.authorize = function(email, password) {
  return this.findOne({ email })
    .then(user => {
      if(!user) {
        throw new Error('Wrong Email/Password');
      }
      if(!bcrypt.compareSync(password, user.passwordHash)) {
        throw new Error('Wrong Email/Password');
      }
      return user;
    });
};

schema.statics.verifyToken = function(token) {
  const { sub } = jwt.verify(token, process.env.APP_SECRET);
  return this.hydrate(sub);
};
  
schema.methods.authToken = function() {
  return jwt.sign({ sub: this.toJSON() }, process.env.APP_SECRET, {
    expiresIn: '48h'
  });
};

module.exports = mongoose.model('User', schema);
