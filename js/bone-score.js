
function BoneScore(boneNotes, score, transpose) {
	var self = this;

	transpose = transpose || 0;
	self.allNotes = [];
	self.measures = [];

	// score-library parsing
	self.parsePart = function(part) {
		self.allNotes = [];
		self.measures = [];
		self.error = null;

		// Create plain_elements
		var iterator = ScoreLibrary.Score.ElementIterFactory.create(part);

		while (iterator.hasNext()) {
			// Parse a measure
			var m = iterator.next();
			var measureIndex = 0;
			var measure = [];
			self.measures.push(measure);
	        var child_iterator = ScoreLibrary.Score.ElementIterFactory.create(m);
			while (child_iterator.hasNext()) {
				var note = child_iterator.next();
				if (ScoreLibrary.Score.Note.prototype.isPrototypeOf(note)) {
					var index = boneNotes.noteIndex(note.step, note.octave, note.alter);
					var positions = boneNotes.slidePositionsByIndex(index + transpose);
					//console.log(note.type + " note at partial " + (positions[0].partial+1) + ", position " + (positions[0].position+1));
					var note = {
						positions: positions,
						note: note,
						selectedPosition: 0,
						measureIndex: measureIndex++
					};
					measure.push(note);
					self.allNotes.push(note);
				}
			}
		}
	}

	if (ScoreLibrary.Score.Part.prototype.isPrototypeOf(score)) {
		self.parsePart(score);
	} else {
		self.error = "Unrecognized score format";
	}
}
