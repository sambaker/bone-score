
function BoneNotes() {
	var self = this;

	self.notesByIndex = {};

	self.noteIndex = function(note, octave, alter) {
		return self.noteLookup[note] + octave * 12 + alter;
	}

	self.addNote = function(note, octave, alter, partial, position, score) {
		index = self.noteIndex(note, octave, alter);
		self.notesByIndex[index] = self.notesByIndex[index] || [];
		self.notesByIndex[index].push({
			partial: partial,
			position: position,
			name: note,
			alter: alter
		});
	}

	self.canPlayNoteByIndex = function(index) {
		return self.notesByIndex[index] && self.notesByIndex[index].length;
	}

	self.canPlayNote = function(note, octave, alter) {
		return self.canPlayNoteByIndex(self.noteIndex(note, octave, alter));
	}

	self.slidePositionsByIndex = function(index) {
		return self.notesByIndex[index];
	}

	self.slidePositions = function(note, octave, alter) {
		return self.slidePositionsByIndex(self.noteIndex(note, octave, alter));
	}

	// Generate the trombone definition

	// Pedal tones
	self.addNote("B", 1, -1, -1, 0, 100);
	self.addNote("A", 1, 0, -1, 1, 100);
	self.addNote("A", 1, -1, -1, 2, 100);
	self.addNote("G", 1, 0, -1, 3, 100);
	self.addNote("F", 1, 1, -1, 4, 100);
	self.addNote("F", 1, 0, -1, 5, 100);
	self.addNote("E", 1, 0, -1, 6, 100);

	// 1st partial
	self.addNote("B", 2, -1, 0, 0, 100);
	self.addNote("A", 2, 0, 0, 1, 100);
	self.addNote("A", 2, -1, 0, 2, 100);
	self.addNote("G", 2, 0, 0, 3, 100);
	self.addNote("F", 2, 1, 0, 4, 100);
	self.addNote("F", 2, 0, 0, 5, 100);
	self.addNote("E", 2, 0, 0, 6, 100);

	// 2nd partial
	self.addNote("F", 3, 0, 1, 0, 100);
	self.addNote("E", 3, 0, 1, 1, 100);
	self.addNote("E", 3, -1, 1, 2, 100);
	self.addNote("D", 3, 0, 1, 3, 100);
	self.addNote("D", 3, -1, 1, 4, 100);
	self.addNote("C", 3, 0, 1, 5, 100);
	self.addNote("B", 2, 0, 1, 6, 100);

	// 3rd partial
	self.addNote("B", 3, -1, 2, 0, 100);
	self.addNote("A", 3, 0, 2, 1, 100);
	self.addNote("A", 3, -1, 2, 2, 100);
	self.addNote("G", 3, 0, 2, 3, 100);
	self.addNote("F", 3, 1, 2, 4, 100);
	self.addNote("F", 3, 0, 2, 5, 100);
	self.addNote("E", 3, 0, 2, 6, 100);

	// 4th partial
	self.addNote("D", 4, 0, 3, 0, 100);
	self.addNote("D", 4, -1, 3, 1, 100);
	self.addNote("C", 4, 0, 3, 2, 100);
	self.addNote("B", 3, 0, 3, 3, 100);
	self.addNote("B", 3, -1, 3, 4, 100);
	self.addNote("A", 3, 0, 3, 5, 100);
	self.addNote("A", 3, -1, 3, 6, 100);

	// 5th partial
	self.addNote("F", 4, 0, 4, 0, 100);
	self.addNote("E", 4, 0, 4, 1, 100);
	self.addNote("E", 4, -1, 4, 2, 100);
	self.addNote("D", 4, 0, 4, 3, 100);
	self.addNote("D", 4, -1, 4, 4, 100);
	self.addNote("C", 4, 0, 4, 5, 100);
	self.addNote("B", 3, 0, 4, 6, 100);

	// 6th partial
	self.addNote("A", 4, -1, 5, 0, 100);
	self.addNote("G", 4, 0, 5, 1, 100);
	self.addNote("F", 4, 1, 5, 2, 100);
	self.addNote("F", 4, 0, 5, 3, 100);
	self.addNote("E", 4, 0, 5, 4, 100);
	self.addNote("E", 4, -1, 5, 5, 100);
	self.addNote("D", 4, 0, 5, 6, 100);

	// 7th partial
	self.addNote("B", 4, -1, 6, 0, 100);
	self.addNote("A", 4, 0, 6, 1, 100);
	self.addNote("A", 4, -1, 6, 2, 100);
	self.addNote("G", 4, 0, 6, 3, 100);
	self.addNote("F", 4, 1, 6, 4, 100);
	self.addNote("F", 4, 0, 6, 5, 100);
	self.addNote("E", 4, 0, 6, 6, 100);

	// 8th partial
	self.addNote("C", 5, 0, 7, 0, 100);
	self.addNote("B", 4, 0, 7, 1, 100);
	self.addNote("B", 4, -1, 7, 2, 100);
	self.addNote("A", 4, 0, 7, 3, 100);
	self.addNote("A", 4, -1, 7, 4, 100);
	self.addNote("G", 4, 0, 7, 5, 100);
	self.addNote("F", 4, 1, 7, 6, 100);
}

BoneNotes.prototype.noteLookup = {
	C: 0,
	D: 2,
	E: 4,
	F: 5,
	G: 7,
	A: 9,
	B: 11
};
