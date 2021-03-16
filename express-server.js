// header variables and settings
const express = require('express');
const bodyParser = require('body-parser');
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
  const random = '';
  for (let i = 0; i < num ; i++) {
    random += char[Math.floor(Math.random() * char.length)]
  }
  return random;
};

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/hello', (req, res) => {
  res.send("<html><body> Hello <b>World</b> </body> </html>\n");
});

app.get('/urls', (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});

// routing to a page to submit a new url
app.get('/urls/new', (req, res) => {
  res.render("urls_new")
})

// routing to a page with short and long url 
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]
  };  
  res.render('urls_show', templateVars);  
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  const randomString = generateRandomString(6);
  res.send('ok')
});


app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});