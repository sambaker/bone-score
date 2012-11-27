var hexToInt = {
	"0":0,
	"1":1,
	"2":2,
	"3":3,
	"4":4,
	"5":5,
	"6":6,
	"7":7,
	"8":8,
	"9":9,
	"a":10,"A":10,
	"b":11,"B":11,
	"c":12,"C":12,
	"d":13,"D":13,
	"e":14,"E":14,
	"f":15,"F":15
}

// [CLASS] Awe.Color
// -----------------
// 
// Color class parses CSS color specs in different formats ("#rrggbb", "rgb(r, g, b)" or "rgba(r, g, b, a)") and provides
// accessors to r/g/b/a components and CSS color strings.
// 
// ### example usage
// `var color = new Awe.Color("#8fdff4");`
// 
// Assigns "$8fdff4":
// 
// `el.style.color = color.toHex();`
// 
// Assigns "rgb(143,223,244)":
// 
// `el.style.color = color.toRGB();`
// 
// Assigns "rgba(143,223,244,1)":
// 
// `el.style.color = color.toRGBA();`
// 
// Assigns [143, 223, 244]:
// 
// `var rgb = [color.r, color.g, color.b];`
function Color(color) {
	var self = this;

	self.toHex = function() {
		return self.hex;
	}

	self.toRGBA = function(alpha) {
		if (alpha == undefined) {
			alpha = self.a;
		}
		return "rgba("+self.r+","+self.g+","+self.b+","+alpha+")";
	}

	self.toRGB = function() {
		return "rgb("+self.r+","+self.g+","+self.b+")";
	}

	self._updateHex = function() {
		var r = self.r.toString(16);
		var g = self.g.toString(16);
		var b = self.b.toString(16);
		if (r.length == 1) {
			r = "0" + r;
		}
		if (g.length == 1) {
			g = "0" + g;
		}
		if (b.length == 1) {
			b = "0" + b;
		}
		self.hex = "#" + r + g + b;
	}

	self.scale = function(s) {
		self.r = Math.max(0, Math.min(Math.round(self.r * s), 255));
		self.g = Math.max(0, Math.min(Math.round(self.g * s), 255));
		self.b = Math.max(0, Math.min(Math.round(self.b * s), 255));
		self.a = Math.max(0, Math.min(self.a * s, 1));
		self._updateHex();
	}

	if (color[0] == "#") {
		self.hex = color;
		self.r = (hexToInt[color[1]] << 4) + hexToInt[color[2]];
		self.g = (hexToInt[color[3]] << 4) + hexToInt[color[4]];
		self.b = (hexToInt[color[5]] << 4) + hexToInt[color[6]];
		self.a = 1;
	} else if (arguments.length > 1) {
		self.r = _.isUndefined(arguments[0]) ? 0 : arguments[0];
		self.g = _.isUndefined(arguments[1]) ? 0 : arguments[1];
		self.b = _.isUndefined(arguments[2]) ? 0 : arguments[2];
		self.a = _.isUndefined(arguments[3]) ? 1 : arguments[3];
		self._updateHex();
	} else {
		if (color.indexOf('rgb(') == 0) {
			color = color.substring(4,color.length-1);
		} else if (color.indexOf('rgba(') == 0) {
			color = color.substring(5,color.length-1);
		}
		var i;
		self.r = parseInt(color);
		color = color.substring(color.indexOf(',')+1);
		self.g = parseInt(color);
		color = color.substring(color.indexOf(',')+1);
		self.b = parseInt(color);
		color = color.substring(color.indexOf(',')+1);
		if (color) {
			self.a = parseFloat(color);
		} else {
			self.a = 1;
		}
	}
}

function LocalStorage(defaults) {
	var self = this;

	self.defaults = defaults || {};

	self.init = function() {
	}

	self.read = function(key, defaultValue) {
		var value = $.cookie(key)
		if (value === null) {
			value = defaultValue || defaults[key];
		}
		return value;
	}

	self.write = function(key, value) {
		$.cookie(key, value);
	}

	self.remove = function(key) {
		$.removeCookie(key);
	}
}
