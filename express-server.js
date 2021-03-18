// global variables and functions
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session')
const bcrypt = require('bcryptjs');
const { render } = require('ejs');
const app  = express();
const PORT =  8080;

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2', 'key3']
}));

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userId: "abcde" },
  "9sm5xK": {longURL: "http://www.google.com" , userId: "user1" }
};

const users = {
    'user1' : {
      id: 'user1',
      email: 'user1@example.com',
      password: 'monkeyfuz'
    },
    'user2': {
      id:'user2',
      email: 'user2@example.com',
      password: 'monkeyfuzz'
    }
};

const addNewUser = (userId, email, password) => {
  users[userId] = {     
    userId,
    email,
    password
  };
}

const urlsForUser = (id) => {
  const urls = {}
  for (let url in urlDatabase){
    if (urlDatabase[url].userId === id){
      urls[url] = urlDatabase[url];
    };
  };
  return urls;
}
const getUser = (id) => {
  return users[id];
}

const getUserId = (email) => {
  for (let id in users){
    if (users[id].email === email){
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

const accessAllowed = (userId, shortURL,res) => {
    if (userId !== urlDatabase[shortURL]['userId']) {
      res.status(403).send('Error 403: Forbidden access')
      return
  };
}
/**TODO:
 * fix bug of shortenting an empty long url
 * refactor code (if possible)
 */


// start of tinyapp
app.get('/', (req, res) => {
  const user = getUser(req.session.user_id);
  const urls = urlsForUser(req.session.user_id);
  const templateVars = {urls, user};
  res.render('urls_index', templateVars);
});

app.get('/urls', (req, res) => {
  const user = getUser(req.session.user_id);
  const urls = urlsForUser(req.session.user_id);
  const templateVars = {urls, user};
  res.render('urls_index', templateVars);
});

app.get('/register', (req, res) => {
  const user = getUser(req.session.user_id);
  const templateVars = {user}  
  res.render('register', templateVars);
})
app.get('/login', (req, res) => {
  const user = getUser(req.session.user_id);
  const templateVars = {user}  
  res.render('login', templateVars)
})


// routing to a page to submit a new url
app.get('/urls/new', (req, res) => {
  const user = getUser(req.session.user_id);
  if (!user){ 
    res.redirect('/login')
    return
  }
  const templateVars = {
    user
  };
  res.render('urls_new', templateVars);
});

// routing to a page with short and long url
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const userId = req.session.user_id;
  const user = getUser(userId);

  // if the shortURL does not exist, send them to 404
  if (!urlDatabase[shortURL]) {
    res.redirect('/*');
    return;
  }

  if(userId !== urlDatabase[shortURL].userId){
    res.status(403).send('Error 403: Forbidden Access');
    return;
  }

  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {
    user,
    shortURL,
    longURL
  };
  res.render('urls_show', templateVars);
});
   
app.get('/u/:shortURL', (req,res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/*', (req, res) => {
  res.status(404).send('Error 404: Unable to find the requested resource!\n');
});

// post of registering a new user
app.post('/register', (req, res) => {
  const email = req.body.email.trim();
  const unhashPassword = req.body.password.trim();
  const userId = generateRandomString(6);

  if (!(email && unhashPassword)){
    res.status(400).send('Error 400: email and password not allowed to be empty\n');
    return;
  };
  if(getUserId(email)){
    res.status(400).send('Error 400: User already exist\n');
    return;
  };

  bcrypt.genSalt(10)
  .then((salt) => {
      bcrypt.hash(unhashPassword, salt, (err, hash) => {
        addNewUser(userId, email, hash);
        req.session.user_id = userId;
        res.redirect('/urls');
      })
    })
})

// routing logIN
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userId = getUserId(email);

  if (!userId){
    res.status(403).send('No such user exists\n');
    return
  }
  if (!bcrypt.compareSync(password, users[userId].password)){
    res.status(403).send(`Incorrect password for email \n`);
    return
  }
  req.session.user_id = userId;
  res.redirect('/urls');
});

//logout routing
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

// making a POST request for long url -> short url
app.post('/urls', (req, res) => {
  const randomString = generateRandomString(6);
  let longURL = req.body.longURL;
  urlDatabase[randomString] = {
    longURL,
    userId: req.session.user_id
  };
  res.redirect(`/urls/${randomString}`);
});

// routing the post request to change(edit) the longURl
app.post('/urls/:shortURL', (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.shortURL;

  if(userId !== urlDatabase[shortURL].userId){
    res.status(403).send('Error 403: Forbidden Access\n');
    return;
  }

  const user = getUser(userId);
  const longURL = req.body.longURL;
  // only update the database if non-empty input
  if (longURL){
    urlDatabase[shortURL].longURL= longURL;
  }
  const templateVars = {
    user,
    shortURL,
    longURL: urlDatabase[shortURL].longURL,
  };
  res.render('urls_show', templateVars);
});

// deleting a url
app.post('/urls/:shortURL/delete', (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.shortURL;

  if(userId !== urlDatabase[shortURL].userId){
    res.status(403).send('Error 403: Forbidden Access\n');
    return;
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});