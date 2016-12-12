const F_MAJOR = ['F', 'G', 'A', 'A#', 'C', 'D', 'E'];
const D_MINOR = ['D', 'E', 'F', 'G', 'A', 'A#', 'C'];

const C_MAJOR = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const A_MINOR = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const G_MAJOR = ['G', 'A', 'B', 'C', 'D', 'E', 'F#'];
const E_MINOR = ['E', 'F#', 'G', 'A', 'B', 'C', 'D'];

const D_MAJOR = ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'];
const B_MINOR = ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'];

const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SAMPLE_LIBRARY = {
	'Grand Piano': [{
		note: 'A',
		octave: 4,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-a4.wav'
	}, {
		note: 'A',
		octave: 5,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-a5.wav'
	}, {
		note: 'A',
		octave: 6,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-a6.wav'
	}, {
		note: 'C',
		octave: 4,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-c4.wav'
	}, {
		note: 'C',
		octave: 5,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-c5.wav'
	}, {
		note: 'C',
		octave: 6,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-c6.wav'
	}, {
		note: 'D#',
		octave: 4,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-ds4.wav'
	}, {
		note: 'D#',
		octave: 5,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-ds5.wav'
	}, {
		note: 'D#',
		octave: 6,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-ds6.wav'
	}, {
		note: 'F#',
		octave: 4,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-fs4.wav'
	}, {
		note: 'F#',
		octave: 5,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-fs5.wav'
	}, {
		note: 'F#',
		octave: 6,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-fs6.wav'
	}]
};

// ======================PITCH SHIFT=========================
function flatToSharp(note) {
	switch (note) {
		case 'Bb':
			return 'A#';
		case 'Db':
			return 'C#';
		case 'Eb':
			return 'D#';
		case 'Gb':
			return 'F#';
		case 'Ab':
			return 'G#';
		default:
			return note;
	}
};

function noteValue(note, octave) {
	return octave * 12 + OCTAVE.indexOf(note);
};

function getNoteDistance(note1, octave1, note2, octave2) {
	return noteValue(note1, octave1) - noteValue(note2, octave2);
}

// this is very useful sort
function getNearestSample(sampleBank, note, octave) {
	// didn't quite understand..
	let sortedBank = sampleBank.slice().sort((sampleA, sampleB) => {
		let distanceA = Math.abs(getNoteDistance(note, octave, sampleA.note, sampleA.octave));
		let distanceB = Math.abs(getNoteDistance(note, octave, sampleB.note, sampleB.octave));
		return distanceA - distanceB;
	});
	console.log("sortedBank " + sortedBank[0].note + sortedBank[0].octave);
	return sortedBank[0];
}