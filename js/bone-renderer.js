

partialColors = {
	'-1': { odd: "#86b5d8", even: "#76a5c8" },
	0: { odd: "#86b5d8", even: "#76a5c8" },
	1: { odd: "#86b5d8", even: "#76a5c8" },
	2: { odd: "#86b5d8", even: "#76a5c8" },
	3: { odd: "#86b5d8", even: "#76a5c8" },
	4: { odd: "#86b5d8", even: "#76a5c8" },
	5: { odd: "#86b5d8", even: "#76a5c8" },
	6: { odd: "#86b5d8", even: "#76a5c8" },
	7: { odd: "#86b5d8", even: "#76a5c8" },
}

// var posW = 80;
// var posWHalf = posW >> 1;
// var noteW = posW * 7;
// var noteWHalf = noteW >> 1;
// var noteH = 50;

function BoneRenderer(config) {
	var self = this;
	var axes;
	var score;

	self.canvases = [];

	self.clear = function() {
		_.each(self.canvases, function(canvas) {
			$(canvas).remove();
		});
		self.canvases = [];
	}

	self.setConfig = function(config) {
		self.config = config;
		self.config.slideGridDimHalf = config.slideGridDim >> 1;
		self.config.timeGridDimHalf = config.timeGridDim >> 1;
		self.config.sizeSlide = config.slideGridDim * 7;
		score = config.score;
		if (config.vertical) {
			axes = BoneRenderer.AxesVertical;
		} else {
			axes = BoneRenderer.AxesHorizontal;
		}
		self.clear();
	}

	self.render = function() {
		self.clear();

		if (config.renderMeasures) {
			// Render each measure
			_.each(score.measures, function(measure) {
				self.canvases.push(self.renderNotes(measure));
			});
		} else {
			self.canvases.push(self.renderNotes(score.allNotes));
		}
	}

	self.canvases = function() {
		return canvases;
	}

	self.renderNotes = function(notes) {
		var canvas = document.createElement('canvas')
		canvas.width = self.config.sizeSlide;
		canvas.height = notes.length * self.config.timeGridDim;
		var context = canvas.getContext('2d');
		if (self.config.parent) {
			self.config.parent.append(canvas);
		}

		var o = {
			canvas: canvas,
			context: context,
			notes: notes
		}

		var i;
		var y;
		context.globalAlpha = 1.0;
		context.clearRect(0, 0, canvas.width, canvas.height);
		y = 0;
		_.each(notes, function(note, i) {
			var p = note.positions[note.selectedPosition];
			context.fillStyle = partialColors[p.partial].odd;
			for (i = 1; i < 7; i += 2) {
				context.fillRect(self.config.slideGridDim * i + self.config.slideGridSpacing, y + self.config.timeGridSpacing, self.config.slideGridDim - self.config.timeGridSpacing, self.config.timeGridDim - self.config.timeGridSpacing);
			}
			context.fillStyle = partialColors[p.partial].even;
			for (i = 0; i < 7; i += 2) {
				context.fillRect(self.config.slideGridDim * i + 1, y + 1, self.config.slideGridDim - 1, self.config.timeGridDim - 1);
			}
			y += self.config.timeGridDim;
		});
		y = self.config.timeGridDimHalf;
		context.lineWidth = 2;
		context.globalAlpha = 0.7;
		context.beginPath();
		_.each(notes, function(note, i) {
			var p = note.positions[note.selectedPosition];
			var x = self.config.slideGridDimHalf + self.config.slideGridDim * p.position;
			if (i) {
				context.lineTo(x, y);
			} else {
				context.moveTo(x, y);
			}
			y += self.config.timeGridDim;
		});
		context.stroke();
		y = self.config.timeGridDimHalf;
		context.fillStyle = "#000000";
		context.globalAlpha = 1.0;
		_.each(notes, function(note, i) {
			var p = note.positions[note.selectedPosition];
			var x = self.config.slideGridDimHalf + self.config.slideGridDim * p.position;
			context.beginPath();
			context.arc(x, y, 4, 0, Math.PI * 2);
			context.fill();
			y += self.config.timeGridDim;
		});
	}

	self.setConfig(config);
}

BoneRenderer.AxesHorizontal = {
	axisTime: "left",
	AxisTime: "Left",
	dimTime: "width",
	DimTime: "Width",
	axisSlide: "top",
	AxisSlide: "Top",
	dimSlide: "height",
	DimSlide: "Height",
	scaleSlide: -1
}

BoneRenderer.AxesVertical = {
	axisTime: "top",
	AxisTime: "Top",
	dimTime: "height",
	DimTime: "Height",
	axisSlide: "left",
	AxisSlide: "Left",
	dimSlide: "width",
	DimSlide: "Width",
	scaleSlide: 1
}
