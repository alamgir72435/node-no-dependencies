/*
 *
 *Create and export configuration variables
 *
 */

// container for all the environments
var environment = {};
// staging (default) environment
environment.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
};

// production envrionmant
environment.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
};

// Determine which environment was passed as command =-line argument

var currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

// check that the current environment above, if not default to staging
var environmentToExport =
  typeof environment[currentEnvironment] == "object"
    ? environment[currentEnvironment]
    : environment.staging;

// export the module

module.exports = environmentToExport;
