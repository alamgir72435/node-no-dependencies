// Dependencies
// openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
// for ssl generate
var http = require("http");
var https = require("https");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var config = require("./config");
var fs = require("fs");
var _data = require("./lib/data");

//Testing
// @TODO delete this
// _data.create("test", "newFile", { name: "saif" }, (err) => {
//   console.log(err);
// });

// The server should respond to all request with a string
// instantiate the server
var httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// start the server
httpServer.listen(config.httpPort, () =>
  console.log(
    "Server Start on port " + config.httpPort + " in " + config.envName + " now"
  )
);

// instantiate the https server
var httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem"),
};
var httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

// start the HTTPS server
httpsServer.listen(config.httpsPort, () =>
  console.log(
    "Server Start on port " +
      config.httpsPort +
      " in " +
      config.envName +
      " now"
  )
);

// All the server login for boh http and https server
var unifiedServer = (req, res) => {
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
      router[trimedPath] !== undefined ? router[trimedPath] : handlers.notFound;

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
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("returning this response", statusCode, payloadString);
    });
  });
};

// degine the handlers
var handlers = {};

handlers.ping = (data, callback) => {
  // callback a http status code, and a payload object

  callback(200);
};

// Not found Handler
handlers.notFound = (data, callback) => {
  // Not found
  callback(404);
};

// Define a request router
var router = {
  ping: handlers.ping,
};
