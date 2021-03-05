// Library for storing and editing data

// Dependencies
var fs = require("fs");
var path = require("path");

// container for the module

var lib = {};
// base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data");

lib.create = (dir, file, data, callback) => {
  // open the file for writing
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // callback()
        // convirt data to string
        var stringData = JSON.stringify(data);
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback("Error Closing new File");
              }
            });
          } else {
            callback("Error writing to new File");
          }
        });
      } else {
        callback("Could not create new File, it may already exist");
      }
    }
  );
};

// Export the module
module.exports = lib;
