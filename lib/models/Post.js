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
});

module.exports = mongoose.model('Post', schema);
