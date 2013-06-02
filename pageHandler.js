var fs = require("fs");
var pg = require("pg");
var url = require("url");
var moment = require("moment");

var connectionConfig = require("./config");

function error(err, response){
	console.log("error on connect to db");
	var body = "Uh-oh! Couldn't connect to database :(";
	response.writeHead(500, {"Content-Type": "text/plain"});
	response.write(body);
	response.end();
}

exports.start = function(request, response){
	var ip = request.connection.remoteAddress;
	
	console.log("Handling request for start");

	console.log("trying to connect to db");
	var client = new pg.Client(connectionConfig);
	pg.connect(connectionConfig, function(err, client){
		if(err){
			error(err, response);
		} else {
			if(ip){
				var query = client.query('INSERT INTO visits VALUES ($1, $2)', [ip, new Date()]);
			
				query.on('end', function(result){
					console.log("end");
					
					var visitorCount = client.query('SELECT COUNT(*) FROM visits');
					
					var count;
					visitorCount.on('row', function(row){
						count = row.count;
					});
					
					visitorCount.on('end', function(end){
						var body = "Hi, " + ip + "!\n\n";
						body += "You are visitor number " + count + ".";
						
						client.end();
						response.writeHead(200, {"Content-Type": "text/plain"});
						response.write(body);
						response.end();
					});
				});
			} else {
				var count;
				visitorCount.on('row', function(row){
					count = row.count;
				});
				
				visitorCount.on('end', function(end){
					var body = "Hi, " + ip + "!\n\n";
					body += "You are visitor number " + count + ".";

					client.end();
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.write(body);
					response.end();
				});
			}
				
			console.log("done");
		}
	});
}

exports.visits = function(request, response){
	console.log("Handling request for visits");

	var now = moment();
	var body = "Visitors as at " + now.format("dddd, MMMM Do YYYY, h:mm:ss a") + ":\n\n";

	console.log("trying to connect to db");
	pg.connect(connectionConfig, function(err, client){
		if(err){
			error(err, response);
		} else {
			var query = client.query('SELECT * FROM visits');
			
			query.on('row', function(row){
				console.log("row");
				body += row.ip + " at " + row.date + "\n";
			});
			query.on('end', function(result){
				console.log("end");
				body += "\n\nThanks for visiting!";
				
				client.end();
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.write(body);
				response.end();
			});
		}
	});
}