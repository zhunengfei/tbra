/**
 * ππ‘ÏqueryString
 * @param {Object} maps
 */
TB.util.QueryData = function() {
	this.data = [];
	this.addField = function(input) {
		for(var i = 0; i < arguments.length; i++) {
			var field = arguments[i];
			if (field)
				this.add(field.name, encodeURIComponent(field.value));
		}
	}
	this.add = function(name, value) {
		this.data.push({"name":name, "value":value});
	}
	this.get = function(name) {
		for (var i = 0; i < this.data.length; i++) {
			if (this.data[i].name === name)
				return this.data[i].value;
		}
		return null;
	}
	this.toQueryString = function() {
		var qs = this.data.map(function(o, i) {
			return o.name + '=' + o.value;
		});
		return qs.join('&'); 			
	}
}