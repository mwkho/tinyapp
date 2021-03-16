// header variables and settings
const express = require('express');
const bodyParser = require('body-parser');
const { render } = require('ejs');
const app  = express();
const PORT =  8080;

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');


// global variables and functions
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = (num) =>  {
  const char = "abcdefghijklmnopqrstuvwxyz0123456789";
  let random = '';
  for (let i = 0; i < num ; i++) {
    random += char[Math.floor(Math.random() * char.length)]    
  };
  return random;
};

app.get('/', (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});

app.get('/hello', (req, res) => {
  res.send('<html><body> Hello <b>World</b> </body> </html>\n');
});

app.get('/urls', (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});

// making a POST request to change long url to short url
app.post('/urls', (req, res) => {
  const randomString = generateRandomString(6);
  let longURL = 'https://' + req.body.longURL;
  urlDatabase[randomString] = longURL;
  res.redirect(`/urls/${randomString}`);
  
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect('/urls')
});

// routing to a page to submit a new url
app.get('/urls/new', (req, res) => {
  res.render('urls_new')
});

// routing to a page with short and long url 
app.get('/urls/:shortURL', (req, res) => {
   const templateVars = {
     shortURL: req.params.shortURL,
     longURL : urlDatabase[req.params.shortURL]
    };
    res.render('urls_show', templateVars);  
});

/** 
 * TODO: 
 * set up a 404 and a server page
 * refactor code to keep it DRY
 * add a functionality to check for valid url format
 * order of POST and GET 
 * 
 */


// routing the post request to change the longURl
app.post('/urls/:shortURL', (req, res) => {
  let longURL = req.body.longURL;
    // do nothing if the input is empty
  if(!longURL){
    res.send('Invalid URL. Go back and try again')
    return
  }
  urlDatabase[req.params.shortURL] = longURL;
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL
  };
  res.render('urls_show', templateVars);
})
   
app.get('/u/:shortURL', (req,res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});