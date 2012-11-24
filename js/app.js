
goog.provide('bonescore.app');

goog.require('ScoreLibrary');
goog.require('ScoreLibrary.MusicXMLLoader');
goog.require('ScoreLibrary.Score.Source');
goog.require('ScoreLibrary.Score.ElementIterFactory');
goog.require('ScoreLibrary.ScoreDiv');

noteLookup = {
	C: 0,
	D: 2,
	E: 4,
	F: 5,
	G: 7,
	A: 9,
	B: 11
};

function noteIndex(note, octave, alter) {
	return noteLookup[note] + octave * 12 + alter;
}

boneDef = {
	notesByIndex: {},

	addNote: function(note, octave, alter, partial, position, score) {
		index = noteIndex(note, octave, alter);
		this.notesByIndex[index] = this.notesByIndex[index] || [];
		this.notesByIndex[index].push({
			partial: partial,
			position: position,
			score: score
		});
	},

	canPlayNoteByIndex: function(index) {
		return this.notesByIndex[index] && this.notesByIndex[index].length;
	},

	canPlayNote: function(note, octave, alter) {
		return this.canPlayNoteByIndex(noteIndex(note, octave, alter));
	},

	slidePositionsByIndex: function(index) {
		return this.notesByIndex[index];
	},

	slidePositions: function(note, octave, alter) {
		return this.slidePositionsByIndex(noteIndex(note, octave, alter));
	},

	init: function() {
		// Pedal tones
		this.addNote("B", 1, -1, -1, 0, 100);
		this.addNote("A", 1, 0, -1, 1, 100);
		this.addNote("A", 1, -1, -1, 2, 100);
		this.addNote("G", 1, 0, -1, 3, 100);
		this.addNote("F", 1, 1, -1, 4, 100);
		this.addNote("F", 1, 0, -1, 5, 100);
		this.addNote("E", 1, 0, -1, 6, 100);

		// 1st partial
		this.addNote("B", 2, -1, 0, 0, 100);
		this.addNote("A", 2, 0, 0, 1, 100);
		this.addNote("A", 2, -1, 0, 2, 100);
		this.addNote("G", 2, 0, 0, 3, 100);
		this.addNote("F", 2, 1, 0, 4, 100);
		this.addNote("F", 2, 0, 0, 5, 100);
		this.addNote("E", 2, 0, 0, 6, 100);

		// 2nd partial
		this.addNote("F", 3, 0, 1, 0, 100);
		this.addNote("E", 3, 0, 1, 1, 100);
		this.addNote("E", 3, -1, 1, 2, 100);
		this.addNote("D", 3, 0, 1, 3, 100);
		this.addNote("D", 3, -1, 1, 4, 100);
		this.addNote("C", 3, 0, 1, 5, 100);
		this.addNote("B", 2, 0, 1, 6, 100);

		// 3rd partial
		this.addNote("B", 3, -1, 2, 0, 100);
		this.addNote("A", 3, 0, 2, 1, 100);
		this.addNote("A", 3, -1, 2, 2, 100);
		this.addNote("G", 3, 0, 2, 3, 100);
		this.addNote("F", 3, 1, 2, 4, 100);
		this.addNote("F", 3, 0, 2, 5, 100);
		this.addNote("E", 3, 0, 2, 6, 100);

		// 4th partial
		this.addNote("D", 4, 0, 3, 0, 100);
		this.addNote("D", 4, -1, 3, 1, 100);
		this.addNote("C", 4, 0, 3, 2, 100);
		this.addNote("B", 3, 0, 3, 3, 100);
		this.addNote("B", 3, -1, 3, 4, 100);
		this.addNote("A", 3, 0, 3, 5, 100);
		this.addNote("A", 3, -1, 3, 6, 100);

		// 5th partial
		this.addNote("F", 4, 0, 4, 0, 100);
		this.addNote("E", 4, 0, 4, 1, 100);
		this.addNote("E", 4, -1, 4, 2, 100);
		this.addNote("D", 4, 0, 4, 3, 100);
		this.addNote("D", 4, -1, 4, 4, 100);
		this.addNote("C", 4, 0, 4, 5, 100);
		this.addNote("B", 3, 0, 4, 6, 100);

		// 6th partial
		this.addNote("A", 4, -1, 5, 0, 100);
		this.addNote("G", 4, 0, 5, 1, 100);
		this.addNote("F", 4, 1, 5, 2, 100);
		this.addNote("F", 4, 0, 5, 3, 100);
		this.addNote("E", 4, 0, 5, 4, 100);
		this.addNote("E", 4, -1, 5, 5, 100);
		this.addNote("D", 4, 0, 5, 6, 100);

		// 7th partial
		this.addNote("B", 4, -1, 6, 0, 100);
		this.addNote("A", 4, 0, 6, 1, 100);
		this.addNote("A", 4, -1, 6, 2, 100);
		this.addNote("G", 4, 0, 6, 3, 100);
		this.addNote("F", 4, 1, 6, 4, 100);
		this.addNote("F", 4, 0, 6, 5, 100);
		this.addNote("E", 4, 0, 6, 6, 100);

		// 8th partial
		this.addNote("C", 5, 0, 7, 0, 100);
		this.addNote("B", 4, 0, 7, 1, 100);
		this.addNote("B", 4, -1, 7, 2, 100);
		this.addNote("A", 4, 0, 7, 3, 100);
		this.addNote("A", 4, -1, 7, 4, 100);
		this.addNote("G", 4, 0, 7, 5, 100);
		this.addNote("F", 4, 1, 7, 6, 100);
	}
}

boneDef.init();

function parsePart(part) {
	var o = {
		allNotes: [],
		measures: []
	};

	// Create plain_elements
	var iterator = ScoreLibrary.Score.ElementIterFactory.create(part);

	while (iterator.hasNext()) {
		// Parse a measure
		var m = iterator.next();
		var measureIndex = 0;
		var measure = [];
		o.measures.push(measure);
        var child_iterator = ScoreLibrary.Score.ElementIterFactory.create(m);
		while (child_iterator.hasNext()) {
			var note = child_iterator.next();
			if (ScoreLibrary.Score.Note.prototype.isPrototypeOf(note)) {
				var positions = boneDef.slidePositions(note.step, note.octave, note.alter);
				if (positions && positions.length) {
					console.log(note.type + " note at partial " + (positions[0].partial+1) + ", position " + (positions[0].position+1));
					var note = {
						positions: positions,
						note: note,
						selectedPosition: 0,
						measureIndex: measureIndex
					};
					measure.push(note);
					o.allNotes.push(note);
				} else {
					return "This music can not be played on trombone in this key!";
				}
			}
		}
	}

	return o;
}

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

var posW = 80;
var posWHalf = posW >> 1;
var noteW = posW * 7;
var noteWHalf = noteW >> 1;
var noteH = 50;

function renderPart(part, noteHeight) {

	var canvas = document.createElement('canvas')
	canvas.width = noteW;
	canvas.height = part.allNotes.length * noteH;
	var context = canvas.getContext('2d');

	var o = {
		canvas: canvas,
		context: context,
		part: part,

		render: function() {
			var i;
			var y;
			context.globalAlpha = 1.0;
			context.clearRect(0, 0, canvas.width, canvas.height);
			y = 0;
			_.each(part.allNotes, function(note, i) {
				var p = note.positions[note.selectedPosition];
				context.fillStyle = partialColors[p.partial].odd;
				for (i = 1; i < 7; i += 2) {
					context.fillRect(posW * i + 1, y + 1, posW - 1, noteH - 1);
				}
				context.fillStyle = partialColors[p.partial].even;
				for (i = 0; i < 7; i += 2) {
					context.fillRect(posW * i + 1, y + 1, posW - 1, noteH - 1);
				}
				y += noteH;
			});
			y = noteH >> 1;
			context.lineWidth = 2;
			context.globalAlpha = 0.7;
			context.beginPath();
			_.each(part.allNotes, function(note, i) {
				var p = note.positions[note.selectedPosition];
				var x = posWHalf + posW * p.position;
				if (i) {
					context.lineTo(x, y);
				} else {
					context.moveTo(x, y);
				}
				y += noteH;
			});
			context.stroke();
			y = noteH >> 1;
			context.fillStyle = "#000000";
			context.globalAlpha = 1.0;
			_.each(part.allNotes, function(note, i) {
				var p = note.positions[note.selectedPosition];
				var x = posWHalf + posW * p.position;
				context.beginPath();
				context.arc(x, y, 4, 0, Math.PI * 2);
				context.fill();
				y += noteH;
			});
		}
	};

	_.bindAll(o);

	return o;
}

function scoreLoaded(xml) {
	//console.log("loaded",arguments);
	var root = $('#root');

    source = new ScoreLibrary.Score.Source(xml);
	credits = source.getCreditInfos();
	credits = _.map(credits, function(credit) {
		return credit.credits[0].text;
	});
	$('<div/>').text(credits.join(' - ')).css({
		fontSize: "24px",
		fontWeight: "bold",
		textAlign: "center",
		width: noteW + "px",
		padding: "15px 50px"
	}).appendTo(root);

    parts = source.getParts();
    var part = parts[0];
    if (part) {
    	bonePart = parsePart(part);
    	renderer = renderPart(bonePart);
    	renderer.render();
    	$(renderer.canvas).css({
    		paddingLeft: "50px"
    	});
    	root.append(renderer.canvas);
    }
}

function scoreLoadError() {
	console.log("error",arguments);
}

$(document).ready(function() {
	//var file = "scores/backatown.xml";
	var file = "scores/wenceslas.xml";

    ScoreLibrary.MusicXMLLoader.create(
        file,
        null, scoreLoaded, scoreLoadError);

//	div = new ScoreLibrary.ScoreDiv($('#root'), 'scores/backatown.xml', false, true);

});

//ScoreLibrary.Score.ElementIterFactory.create(part);