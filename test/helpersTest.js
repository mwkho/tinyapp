const { assert } = require('chai');
const { getUserId, urlsForUser} = require('../helper.js');

const testUsers = {
  "user1": {
    id: "user1",
    email: "user1@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2": {
    id: "user2",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  '1233': {
    longURL: 'http://google.com',
    userId: 'user1'
  }
};

describe('testing for getUserId', () => {
  it('return an id with valid email', () => {
    const id = getUserId('user1@example.com', testUsers);
    assert.strictEqual(id, 'user1');
  });

  it('return undefined with no valid email found', () => {
    const id = getUserId('use1@example.com', testUsers);
    assert.strictEqual(id, undefined);
  });
  it('return undefined for empty email', () => {
    const id = getUserId('', testUsers);
    assert.strictEqual(id, undefined);
  });
});

describe('testing urlsForUser', () =>{
  it('return a url for existing id', () => {
    const url = urlsForUser('user1', urlDatabase);
    const equalDatabase =   {'1233': {
      longURL: 'http://google.com',
      userId: 'user1'
    }};
    assert.deepEqual(url, equalDatabase);
  });

  it('return empty dictionary for non existent id', () => {
    const url = urlsForUser('user', urlDatabase);
    const equalDatabase = {};
    assert.deepEqual(url, equalDatabase);
  });
});
