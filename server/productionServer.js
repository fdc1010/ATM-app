var server = require("./server.js");
var db = require("../src/DBconfig")("ATM.db");

server(db);
