const { agent, prepare, getLoggedInUser } = require('../db/data-helpers.js');
const User = require('../lib/models/User.js');


describe('User routes', () => {

  it('gets users with the most comments', async() => {
    const users = prepare(await User.getLeader());

    return agent
      .get('/api/v1/users/leader')
      .then(res => {
        expect(res.body).toEqual(users);
      });

  });

  it('returns top 10 users with most posts', async() => {
    const users = prepare(await User.getProlific());

    return agent
      .get('/api/v1/users/prolific')
      .then(res => {
        expect(res.body).toEqual(users);
      });

  });
});
