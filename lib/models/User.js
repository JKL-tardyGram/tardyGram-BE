const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },

  passwordHash: {
    type: String,
    required: true
  },

  profilePhotoUrl: {
    type: String,
    required: true
  }

}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash,
      delete ret.__v,
      delete ret.id;
    }
  }
});

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, +process.env.SALT_ROUNDS || 8);
});

schema.statics.authorize = function(username, password) {
  return this.findOne({ username })
    .then(user => {
      if(!user) {
        throw new Error('Wrong Username/Password');
      }
      if(!bcrypt.compareSync(password, user.passwordHash)) {
        throw new Error('Wrong Username/Password');
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

schema.statics.getLeader = function() {
  return this.aggregate([
    {
      '$lookup': {
        'from': 'comments',
        'localField': '_id',
        'foreignField': 'commentBy',
        'as': 'userCommentArray'
      }
    }, {
      '$group': {
        '_id': '$_id',
        'username': {
          '$first': '$username'
        },
        'profilePhotoUrl': {
          '$first': '$profilePhotoUrl'
        },
        'userCommentCount': {
          '$sum': {
            '$size': '$userCommentArray'
          }
        }
      }
    }, {
      '$sort': {
        'userCommentCount': -1
      }
    }, {
      '$limit': 10
    }
  ]);
};

schema.statics.getProlific = function() {
  return this.aggregate (
    [
      {
        '$lookup': {
          'from': 'posts',
          'localField': '_id',
          'foreignField': 'user',
          'as': 'userPostArray'
        }
      }, {
        '$group': {
          '_id': '$_id',
          'username': {
            '$first': '$username'
          },
          'profilePhotoUrl': {
            '$first': '$profilePhotoUrl'
          },
          'userPostCount': {
            '$sum': {
              '$size': '$userPostArray'
            }
          }
        }
      }, {
        '$sort': {
          'userPostCount': -1
        }
      }, {
        '$limit': 10
      }
    ]
  );
};

module.exports = mongoose.model('User', schema);
