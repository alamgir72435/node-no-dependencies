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

    // choose the handler this request sould go to
    var choosenHandler =
      typeof router[trimedPath] !== undefined
        ? router[trimedPath]
        : handlers.notFound;

    var data = {
      trimedPath: trimedPath,
      queryStringObject: queryString,
      method: method,
      headers: headers,
      payload: buffer,
    };

    // Route the request to the handler specified in the router
    choosenHandler(data, function (statusCode, payload) {
      // use the status code called back by the handler
      statusCode = typeof statusCode == "number" ? statusCode : 200;
      // use the payload call back by the handler, or Default to an empty object
      payload = typeof payload == "object" ? payload : {};
      // convert the payload to a string
      var payloadString = JSON.stringify(payload);

      //   return the response
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("returning this response", statusCode, payloadString);
    });
  });
});

// start the server
server.listen(3000, () => console.log("Server Start on port 3000"));

// degine the handlers
var handlers = {};

handlers.sample = (data, callback) => {
  // callback a http status code, and a payload object
  callback(406, { name: "sample Handler" });
};

// Not found Handler
handlers.notFound = (data, callback) => {
  // Not found
  callback(404);
};

// Define a request router
var router = {
  sample: handlers.sample,
};
