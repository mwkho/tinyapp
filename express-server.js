// global variables and functions
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { render } = require('ejs');
const app  = express();
const PORT =  8080;

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(cookieParser())

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  const templateVars = {urls: urlDatabase, username: req.cookies["username"]};
  res.render('urls_index', templateVars);
});

app.get('/urls', (req, res) => {
  const templateVars = {urls: urlDatabase, username: req.cookies["username"]};
  res.render('urls_index', templateVars);
});

// routing to a page to submit a new url
app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  }
  res.render('urls_new', templateVars);
});

// routing to a page with short and long url
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  if (Object.keys(urlDatabase).indexOf(shortURL) === -1) {
    res.redirect('/*');
  }
  const templateVars = {
    shortURL,
    longURL : urlDatabase[shortURL],
    username: req.cookies["username"]
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

// setting up username cookies for login
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username)
  res.redirect('/urls');
});

//logout routing
app.post('/logout', (req, res) => {
  res.clearCookie('username');
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
  let longURL = req.body.longURL;
  urlDatabase[req.params.shortURL] = longURL;
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL,
    username: req.cookies["username"]
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