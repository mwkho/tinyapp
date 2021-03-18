const addNewUser = (userId, email, password, database) => {
  database[userId] = {     
    userId,
    email,
    password
  };
}

const urlsForUser = (id, database) => {
  const urls = {}
  for (let url in database){
    if (database[url].userId === id){
      urls[url] = database[url];
    };
  };
  return urls;
}
const getUser = (id, database) => {
  return database[id];
}

const getUserId = (email, database) => {
  for (let id in database){
    if (database[id].email === email){
      return id;
    }
  }
}

const generateRandomString = (num) => {
  const char = "abcdefghijklmnopqrstuvwxyz0123456789";
  let random = '';
  for (let i = 0; i < num; i++) {
    random += char[Math.floor(Math.random() * char.length)];
  }
  return random;
};


module.exports = {
  addNewUser,
  urlsForUser,
  getUserId,
  getUser,
  generateRandomString
}