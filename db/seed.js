const chance = require('chance').Chance();
const User = require('../lib/models/User');
const Post = require('../lib/models/Post');
const Comment = require('../lib/models/Comment');


module.exports = async({ users = 20, posts = 100, comment = 500 } = {}) => {
  const createdUsers = await User.create([...Array(users)].map((_, i) => ({
    username: `user${i}`,
    profilePhotoUrl: chance.url(),
    password: `password${i}`
  })));
  const createdPosts = await Post.create([...Array(posts)].map(() => ({
    user: chance.pickone(createdUsers).id,
    photoUrl: chance.url(),
    caption: chance.sentence(),
    tags: [chance.word(), chance.word()]
  })));
  await Comment.create([...Array(comment)].map(() => ({
    commentBy: chance.pickone(createdUsers).id,
    post: chance.pickone(createdPosts).id,
    comment: chance.sentence()

  })));
};
