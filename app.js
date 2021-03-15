const http = require('http');
const PORT =  8080;

const requestHandler = (req, res) => {
  const URL = req.url;
  if (URL === '/'){
    res.write('Welcome!\n');
  }
  if (URL === '/urls'){
    res.write('Here are the URLs. \n');
  } else{
    res.statusCode = 404;
    res.end(`Error 404 page not found`)
  }
  res.end();
};


const server =http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})