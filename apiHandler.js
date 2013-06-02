var url = require("url");

var db = require("./dbHelper");

exports.query = function(request, response){
	var query = url.parse(request.url, true).query;
	
	var type = query.type;
	var itemName = query.name;
	
	console.log("Looking up " + itemName + " in table " + type);

	db.query(itemName, type, function(result){
		response.writeHead(200, {"Content-Type": "application/json"});
		response.write(JSON.stringify(result));
		response.end();
	});
}

exports.suggest = function(request, response){
	var query = url.parse(request.url, true).query;
	
	var prefix = query.prefix;
	
	console.log("Looking for suggestions beginning with " + prefix);

	db.suggest(prefix, function(result){
		response.writeHead(200, {"Content-Type": "application/json"});
		response.write(JSON.stringify(result));
		response.end();
	});
}