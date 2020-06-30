const { agent, prepare, getLoggedInUser } = require('../db/data-helpers.js');
const User = require('../lib/models/User');
const request = require('supertest');
const app = require('../lib/app');
const Post = require('../lib/models/Post.js');


describe('post routes', () => {
    
  it('it makes a new post with POST', async() => {
    
    const user = await getLoggedInUser();

    return agent
      .post('/api/v1/posts')
      .send({
        user: user._id, 
        photoUrl: 'photo string',
        caption: 'caption',
        tags: ['tag', 'tag1', 'tag2'] 
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(), 
          user: user.id,
          photoUrl: 'photo string',
          caption: 'caption',
          tags: ['tag', 'tag1', 'tag2'],
          __v: 0
        });
      });
  });

  it('it gets a list of all tardyGram posts', async() => {
    const posts = prepare(await Post.find());  

    return agent
      .get('/api/v1/posts')
      .then(res => {
        expect(res.body).toEqual(posts);
      });
  });

  it('it gets a post by id with GET', async() => {
    const post = prepare(await Post.findOne()
      .populate('comments'));

    return agent
      .get(`/api/v1/posts/${post._id}`)
      .then(res => {
        expect(res.body).toEqual(post);
      });
  });

  it('it updates the post caption with PATCH', async() => {
    const user = await getLoggedInUser();
    const post = prepare(await Post.findOne({ user: user._id }));

    return agent
      .patch(`/api/v1/posts/${post._id}`)
      .send({ caption: 'new caption' })
      .then(res => {
        expect(res.body).toEqual({
            
          '__v': 0,
          '_id': expect.anything(),
          'caption': 'new caption',
          'photoUrl': expect.any(String),
          'tags':  [
            expect.any(String),
            expect.any(String),
          ],
          'user': expect.anything(),
                 
        });
      });
  });

  it('it deletes a post with DELETE', async() => {
    const user = await getLoggedInUser();
    const post = prepare(await Post.findOne({ user: user._id }));

    return agent
      .delete(`/api/v1/posts/${post._id}`)
      .then(res => {
        expect(res.body). toEqual(post);
      });
  });
});
