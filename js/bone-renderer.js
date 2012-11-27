
var oddStart = new Color('#86b5d8');
var oddEnd = new Color('#d6fb61');
var evenStart = new Color('#76a5c8');
var evenEnd = new Color('#d6e73c');

var start = oddStart;
var end = oddEnd;

partialColors = {
	// Out of range of the trombone
	"INVALID": { odd: "#fa8f83", even: "#fa8f83" },
	// Out of the student's range
	"OUTOFRANGE": { odd: "#ff56f0", even: "#ff56f0" }
};

for (var i = 0; i <= 8; ++i) {
	var oddR = oddStart.r + (oddEnd.r - oddStart.r) * i / 8;
	var evenR = evenStart.r + (evenEnd.r - evenStart.r) * i / 8;
	var oddG = oddStart.g + (oddEnd.g - oddStart.g) * i / 8;
	var evenG = evenStart.g + (evenEnd.g - evenStart.g) * i / 8;
	var oddB = oddStart.b + (oddEnd.b - oddStart.b) * i / 8;
	var evenB = evenStart.b + (evenEnd.b - evenStart.b) * i / 8;
	partialColors[''+(i-1)] = {
		odd: new Color(Math.round(oddR), Math.round(oddG), Math.round(oddB)).toHex(),
		even: new Color(Math.round(evenR), Math.round(evenG), Math.round(evenB)).toHex()
	}
}

function BoneRenderer(config) {
	var self = this;
	var axes;
	var score;

	self.canvases = [];

	self.clear = function() {
		_.each(self.canvases, function(canvas) {
			$(canvas.canvas).remove();
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

	function fillRect(context, slidePos, timePos, slideDim, timeDim) {
		if (self.config.vertical) {
			context.fillRect(slidePos, timePos, slideDim, timeDim);
		} else {
			context.fillRect(timePos, slidePos, timeDim, slideDim);
		}
	}

	function lineTo(context, slidePos, timePos) {
		if (self.config.vertical) {
			context.lineTo(slidePos, timePos);
		} else {
			context.lineTo(timePos, slidePos);
		}
	}

	function moveTo(context, slidePos, timePos) {
		if (self.config.vertical) {
			context.moveTo(slidePos, timePos);
		} else {
			context.moveTo(timePos, slidePos);
		}
	}

	function arc(context, slidePos, timePos, radius, start, end) {
		if (self.config.vertical) {
			context.arc(slidePos, timePos, radius, start, end);
		} else {
			context.arc(timePos, slidePos, radius, start, end);
		}
	}

	function getSlidePositionCoord(position) {
		if (self.config.vertical) {
			return self.config.slideGridDimHalf + self.config.slideGridDim * position;
		} else {
			return self.config.slideGridDimHalf + self.config.slideGridDim * (6 - position);
		}
	}
	function strokeText(context, text, slidePos, timePos) {
		if (self.config.vertical) {
			context.strokeText(text, slidePos, timePos);
		} else {
			context.strokeText(text, timePos, slidePos);
		}
	}

	self.renderNotes = function(notes) {
		var canvas = document.createElement('canvas')
		canvas[axes.dimSlide] = self.config.sizeSlide;
		canvas[axes.dimTime] = notes.length * self.config.timeGridDim;
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
		var t;
		var p;
		var lastNoteGood;
		context.strokeStyle = "#000000";
		context.lineWidth = 4;
		context.globalAlpha = 1.0;
		context.font = "14px sans-serif";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.clearRect(0, 0, canvas.width, canvas.height);

		// Draw the grid
		t = 0;
		_.each(notes, function(note, i) {
			if (note.positions) {
				var pos = note.positions[note.selectedPosition];
				context.fillStyle = partialColors[pos.partial].odd;
			} else {
				context.fillStyle = partialColors["INVALID"].odd;
			}
			for (i = 1; i < 7; i += 2) {
				fillRect(context, self.config.slideGridDim * i + self.config.slideGridSpacing, t + self.config.timeGridSpacing, self.config.slideGridDim - self.config.timeGridSpacing, self.config.timeGridDim - self.config.timeGridSpacing);
			}
			if (note.positions) {
				context.fillStyle = partialColors[pos.partial].even;
			} else {
				context.fillStyle = partialColors["INVALID"].even;
			}
			for (i = 0; i < 7; i += 2) {
				fillRect(context, self.config.slideGridDim * i + 1, t + 1, self.config.slideGridDim - 1, self.config.timeGridDim - 1);
			}
			if (note.measureIndex == 0) {
				context.beginPath();
				moveTo(context, 0, t);
				lineTo(context, self.config.sizeSlide, t);
				context.stroke();
			}
			t += self.config.timeGridDim;
			if (i == (note.length - 1)) {
				context.beginPath();
				moveTo(context, 0, t);
				lineTo(context, self.config.sizeSlide, t);
				context.stroke();
			}
		});

		// Draw the lines to show slide movement
		t = self.config.timeGridDimHalf;
		context.globalAlpha = 0.7;
		context.lineWidth = 2;
		context.beginPath();
		lastNoteGood = false;
		_.each(notes, function(note, i) {
			if (note.positions) {
				var pos = note.positions[note.selectedPosition];
				p = getSlidePositionCoord(pos.position);
				if (i) {
					if (lastNoteGood) {
						lineTo(context, p, t);
					} else {
						moveTo(context, p, t);
					}
				} else {
					moveTo(context, p, t);
				}
				lastNoteGood = true;
			} else {
				lastNoteGood = false;
			}
			t += self.config.timeGridDim;
		});
		context.stroke();

		// Draw the note markers
		t = self.config.timeGridDimHalf;
		context.globalAlpha = 1;
		context.fillStyle = "#ffffff";
		_.each(notes, function(note, i) {
			if (note.positions) {
				var pos = note.positions[note.selectedPosition];
				p = getSlidePositionCoord(pos.position);
				context.beginPath();
				arc(context, p, t, 14, 0, Math.PI * 2);
				context.fill();
				context.stroke();
				var text = pos.name;
				var offset = 0;
				if (pos.alter > 0) {
					offset = 1;
					text += String.fromCharCode(9839);
				} else if (pos.alter < 0) {
					offset = 2;
					text += String.fromCharCode(9837);
				}
				strokeText(context, text, p, t+offset);
			}
			t += self.config.timeGridDim;
		});

		return o;
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
