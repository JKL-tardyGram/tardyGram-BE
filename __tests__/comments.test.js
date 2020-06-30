const { agent, prepare, getLoggedInUser } = require('../db/data-helpers.js');
const Comment = require('../lib/models/Comment.js');
const Post = require('../lib/models/Post.js');

describe('tests comment routes', () => {

  it('can delete a comment by id', async() => {
    const user = await getLoggedInUser();
    const comment = prepare(await Comment.findOne({ commentBy: user._id }));
    return agent
      .delete(`/api/v1/comments/${comment._id}`)
      .then(res => {
        expect(res.body).toEqual(comment);
      });
  });

  it('can post a comment', async() => {
    const user = await getLoggedInUser();
    const post = prepare(await Post.findOne());

    return agent
      .post('/api/v1/comments')
      .send({
        commentBy: user._id,
        post: post._id,
        comment: 'This is my very special comment'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          commentBy: expect.anything(),
          post: post._id,
          comment: 'This is my very special comment',
          __v: 0
        });
      });
  });
});
