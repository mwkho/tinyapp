// global variables and functions
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { render } = require('ejs');
const app  = express();
const PORT =  8080;

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
    },
    addNewUser: (userId, email, password) => {
      this[userID] = {     
        userId,
        email,
        password
      };
    },

    getUser: (id) => {
      return this[id];
    }
};

const generateRandomString = (num) =>  {
  const char = "abcdefghijklmnopqrstuvwxyz0123456789";
  let random = '';
  for (let i = 0; i < num; i++) {
    random += char[Math.floor(Math.random() * char.length)];
  }
  return random;
};

// start of tinyapp
app.get('/', (req, res) => {
  const user = users.getUser(req.cookies['user_id']);
  const templateVars = {urls: urlDatabase, user};
  res.render('urls_index', templateVars);
});

app.get('/register', (req, res) => {
  const user = users.getUser(req.cookies['user_id']);
  const templateVars = {user}  
  res.render('register', templateVars);
})

app.get('/urls', (req, res) => {
  const user = users.getUser(req.cookies['user_id']);
  const templateVars = {urls: urlDatabase, user};
  res.render('urls_index', templateVars);
});

// routing to a page to submit a new url
app.get('/urls/new', (req, res) => {
  const user = users.getUser(req.cookies['user_id']);
  const templateVars = {
    user
  };
  res.render('urls_new', templateVars);
});

// routing to a page with short and long url
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const user = users.getUser(req.cookies['user_id']);
  // if the shortURL does not exist, send them to 404
  if (Object.keys(urlDatabase).indexOf(shortURL) === -1) {
    res.redirect('/*');
    return;
  }
  const templateVars = {
    user,
    shortURL,
    longURL : urlDatabase[shortURL],
  };
  res.render('urls_show', templateVars);
});
   
app.get('/u/:shortURL', (req,res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/*', (req, res) => {
  res.status(404).send('Error 404: Unable to find the requested resource!');
});

// post of registering a new user
app.post('/register', (req, res) => {
  const userId = generateRandomString(6); 
  users.addNewUser(userId, req.body.email, req.body.password);
  res.cookie('user_id', userId);
  res.redirect('/urls');
})

// setting up username cookies for login
app.post('/login', (req, res) => {
  res.cookie('user_id', req.body.userId);
  res.redirect('/urls');
});

//logout routing
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

// making a POST request to change long url to short url
app.post('/urls', (req, res) => {
  const randomString = generateRandomString(6);
  let longURL = req.body.longURL;
  urlDatabase[randomString] = longURL;
  res.redirect(`/urls/${randomString}`);
});

// routing the post request to change the longURl
app.post('/urls/:shortURL', (req, res) => {
  const user = users.getUser(req.cookies['user_id']);
  let longURL = req.body.longURL;
  // only update the database if non-empty input
  if (longURL){
    urlDatabase[req.params.shortURL] = longURL;
  }
  const templateVars = {
    user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render('urls_show', templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});