
var knex = function(file) {
  return require("knex")({
    client: "sqlite3",
    connection: {
      // Searches for the db file relative to the assetFolder location specified in the server.
      filename : file
    },
    useNullAsDefault: true
  });
};

console.log("Connected to sqlite3");
module.exports = knex;
