// route a request
exports.route = function(path, handle, request, response){
	console.log("Routing request for " + path);
	
	if(typeof handle[path] === 'function'){
		handle[path](request, response);
	} else {
		// throw a 404
		console.log("No handler for " + path);
		response.writeHead(404, {"Content-Type": "text/plain", "Location": "404"});
		response.write("404 Not found :(");
		response.end();
	}
	
}