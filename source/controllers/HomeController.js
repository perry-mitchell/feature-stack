(function(module) {

	"use strict";

	var Controller = require("../core/Controller.js");

	var HomeController = Controller.extend({

		index: function() {
			this.setView("index");
			this.assign("title", "FeatureStack");
		}

	});

	module.exports = HomeController;

})(module);
