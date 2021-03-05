// Dependencies
var http = require("http");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
// The server should respond to all request with a string
var server = http.createServer((req, res) => {
  // Get  the url and parse it
  var parsedUrl = url.parse(req.url, true);

  // get the path
  var path = parsedUrl.pathname;
  var trimedPath = path.replace(/^\/+|\/+$/g, "");
  //   console.log(trimedPath);

  // get the query String as an object
  var queryString = parsedUrl.query;
  //   console.log(queryString);

  // http method
  var method = req.method.toLowerCase();

  // get the headers as an Object
  var headers = req.headers;

  // Get the  payloads
  var decoder = new StringDecoder("utf-8");
  var buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();
    // send the response
    // log the request path
    res.end("Hello world\n");
    console.log(buffer);
  });
});

// start the server
server.listen(3000, () => console.log("Server Start on port 3000"));
