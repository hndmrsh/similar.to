var pg = require("pg");

var connectionConfig = require("./config");
var validTypes = require("./validTypes").types;

exports.lookup = function(itemName, type, callback){
	var obj;
	
	if(validTypes.types.indexOf(type) == -1){
		obj = {
			response: 'Type not valid'
		};
		
		callback(obj);
	} else {
		console.log("trying to connect to db");
		pg.connect(connectionConfig, function(err, client){
			if(err){
				obj = err;
				
				callback(obj);
				client.end();
			} else {
				var query = client.query('SELECT * FROM ' + type + ' WHERE name = $1', [itemName]);
				
				query.on('row', function(row){
					obj = row;
					console.log("game found");
				});
				
				query.on('end', function(result){
					if(!obj){
						console.log("nothing found");
						obj = {
							response: "Not found"
						};
					}
					
					callback(obj);
					
					client.end();
				});
			}
		});
	}
}

exports.suggest = function(prefix, callback){
	var obj;
	
	console.log("looking up all items with prefix " + prefix);
	pg.connect(connectionConfig, function(err, client){
		if(err){
			obj = err;
			
			callback(obj);
			client.end();
		} else {
			obj = {results: []};
			
			// build query string from all valid tables
			var queryString = "";
			for(var i = 0; i < validTypes.length; i++){
				if(i > 0){
					queryString += " UNION ALL ";
				}
				queryString += "SELECT *, '" + validTypes[i] + "' AS type FROM " + validTypes[i] + " WHERE name LIKE $1";
			}
			queryString += " ORDER BY name";
			
			console.log("querying tables with the following command:");
			console.log(queryString);
			
			var query = client.query(queryString , [prefix + '%']);
			
			query.on('row', function(row){
				console.log("suggestion found: " + row.name + ", from: " + row.type);
				obj.results.push({
					name: row.name,
					type: row.type
				});
			});
			
			query.on('end', function(result){
				callback(obj);
				client.end();
			});
		}
	});
}