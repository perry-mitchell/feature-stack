(function(module) {

	"use strict";

	// https://github.com/darlanalves/extends
	var extend = require("extends");

	var Class = function() {};

	var Controller = extend(Class, {

		constructor: function(req, resp) {
			this._request = req;
			this._response = resp;
			this._view = null;
			this._viewProperties = {};
			this._render = true;

			this.assign("loggedIn", false);
			this.assign("location", req.protocol + '://' + req.get('host') + req.originalUrl);
		},

		assign: function(key, value) {
			this._viewProperties[key] = value;
			return this;
		},

		assignObject: function(obj) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					this.assign(key, obj[key]);
				}
			}
		},

		failWith404: function() {
			this.getRequest().log({status:404}, "controller 404");
			this.getResponse().status(404).send('Not found');
		},

		getRequest: function() {
			return this._request;
		},

		getResponse: function() {
			return this._response;
		},

		getView: function() {
			return this._view;
		},

		getViewProperties: function() {
			return this._viewProperties;
		},

		log: function() {
			console.log.apply(null, arguments);
		},

		render: function() {
			var viewProps = this.getViewProperties(),
				logProps = {
					loggedIn: viewProps.loggedIn,
				};

			if (this._render !== true) {
				// No rendering, no headers
			} else if (this.getView() !== null) {
				// Jade
				this.getResponse().render(this.getView(), this.getViewProperties());
			} else {
				// JSON response
				this.getResponse().json(this.getViewProperties());
			}

			this.log(logProps, "controller hit");
		},

		setRender: function(renderEnabled) {
			this._render = (renderEnabled === true);
		},

		setView: function(viewName) {
			this._view = viewName;
		}

	});

	module.exports = Controller;

})(module);
