(function(module) {

	"use strict";

	var http = require('http');
	http.globalAgent.maxSockets = 25;

	var express = require("express"),
		router = require("./router.js");

	var publicDir = "./public";

	module.exports = function() {

		var app = express();
		app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');

		// routes

		app.get("/", router("HomeController", "index"));

		// static files:
		app.get(/^(.+)$/, function(req, res) { 
			//req.log("static request");
			res.sendFile(publicDir + "/" + req.params[0]); 
		});

		var port = 8080;
		app.listen(port, function() {
			console.log("Listening on " + port);
		});

	};

})(module);
