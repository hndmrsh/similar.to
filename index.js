var server = require("./server");
var router = require("./router");
var pageHandler = require("./pageHandler");
var apiHandler = require("./apiHandler");

var handle = {};
handle["/"] = pageHandler.start;
handle["/visits"] = pageHandler.visits;

handle["/api/query"] = apiHandler.query;
handle["/api/suggest"] = apiHandler.suggest;

server.start(8888, router.route, handle);