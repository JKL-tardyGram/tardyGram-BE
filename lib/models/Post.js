const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  photoUrl: String,
  caption: String,
  tags: [String]
},
{
  toJSON:
  {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  },
  toObject: {
    virtuals: true
  } 
});

schema.virtual('comments',
  {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post'
    
  }
);

schema.statics.getTopPosts = function() {
  return this.aggregate(
    [
      {
        '$lookup': {
          'from': 'comments', 
          'localField': '_id', 
          'foreignField': 'post', 
          'as': 'commentArray'
        }
      }, {
        '$group': {
          '_id': '$_id', 
          'commentCount': {
            '$sum': {
              '$size': '$commentArray'
            }
          }, 
          'user': {
            '$first': '$user'
          }, 
          'photoUrl': {
            '$first': '$photoUrl'
          }, 
          'caption': {
            '$first': '$caption'
          }, 
          'tags': {
            '$addToSet': '$tags'
          }
        }
      }, {
        '$sort': {
          'commentCount': -1
        }
      }, {
        '$limit': 10
      }
    ]
  );
};

module.exports = mongoose.model('Post', schema);
