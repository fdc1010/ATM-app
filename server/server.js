var express = require("express");
var Path = require("path");
var routes = express.Router();
var browserify = require("browserify-middleware");


var runServer = function(db) {
  // No need to browserify, but at one point I was requiring modules from ATM.js and needed it.
  routes.get("/app-bundle.js", browserify("./src/ATM.js"));

  // Default path for static assets (html, etc.)
  var assetFolder = Path.resolve(__dirname, "../");
  routes.use(express.static(assetFolder));

  // Parse incoming request bodies as JSON
  routes.use(require("body-parser").json());

  routes.get("/api/balance", function(req, res) {
    db.select("amount")
      .from("pins")
      .where("pin", "=", req.query.pin)
      .asCallback(function(err, rows) {
        // DB doesn't throw error on bad request, so measuring lack of response here.
        if (!rows.length) {
          res.status(404);
          res.json({Error: err});
        } else {
          res.json({balance: rows[0].amount});
        }
      });
  });

  routes.post("/api/transact", function(req, res) {
    db.update("amount", req.body.transaction)
      .from("pins")
      .where("pin", "=", req.query.pin)
      .asCallback(function(err, rows) {
        // DB responds with rows = 0 for error on update, rows = 1 for valid update requests.
        if (rows === 0) {
          res.status(400);
          res.json({Error: err});
        } else {
          res.sendStatus(200);
        }
      });
  });

  // The Catch-all Route
  routes.get("/*", function(req, res){
    res.sendFile( assetFolder + "/index.html" );
  });

  // Create our Express instance then mount our main router using routes defined above.
  var app = express();
  app.use("/", routes);

  // Start the server
  var port = process.env.PORT || 4000;
  console.log("Listening on port", port);
  return app.listen(port);
}

module.exports = runServer;
