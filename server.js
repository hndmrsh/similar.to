var http = require("http");
var url = require("url");

// start the webserver
exports.start = function(port, route, handle){
	
	// callback when a request is made
	function onRequest(request, response){
		console.log("Accepted connection");
		
		var postData = "";
		var path = url.parse(request.url).pathname;
		console.log("Requesting " + path);		
		
		route(path, handle, request, response);
	}

	// start listening
	var server = http.createServer(onRequest);
	server.listen(port);
	
	console.log("Server started on port " + port);
}
