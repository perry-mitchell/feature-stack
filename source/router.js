(function(module) {

	"use strict";

	var request,
		response;

	var fs = require('fs'),
		Promise = require("promise-polyfill");

	function failWith404(res) {
		res.status(404).send('Not found');
	}

	var setNextRoute = function(controllerName, actionName, params) {
		params = params || [];
		return function (req, res) {
			var fileName = __dirname + "/controllers/" + controllerName + ".js",
				ControllerClass = null;

			fs.exists(fileName, function (exists) {
				if (exists) {
					var actionArgs = [];
					for (var i = 0, paramsLen = params.length; i < paramsLen; i += 1) {
						actionArgs.push((req.params.hasOwnProperty(params[i]) ? req.params[params[i]] : undefined));
					}

					ControllerClass = require(fileName);
					var controller = new ControllerClass(req, res);
					var output = controller[actionName].apply(controller, actionArgs);
					// Wait for promises that may be returned from the action
					if (output instanceof Promise) {
						output.then(function() {
							controller.render();
						});
					} else {
						controller.render();
					}
				} else {
					console.log("Controller not found or failed to load: " + fileName);
					failWith404(res);
				}
			});
		};
	};

	module.exports = setNextRoute;

})(module);
