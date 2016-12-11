/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/web_audio/sampler.js
 * ===========================================================================================
 */

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
	}],
	'Drum': [{
		note: 'C',
		octave: 4,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/drum/kick.wav'
	}, {
		note: 'D',
		octave: 4,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/drum/snare.wav'
	}, {
		note: 'F',
		octave: 4,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/drum/close_hat.wav'
	}, {
		note: 'A',
		octave: 4,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/drum/open_hat.wav'
	}, ]
};

// ======================SAMPLER=========================
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
	return sortedBank[0];
}


// =======================SET AUDIO==============================
let audioContext = new AudioContext();

function fetchSample(path) {
	return fetch(decodeURIComponent(path))
		.then(response => response.arrayBuffer())
		.then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
}

function getSample(instrument, noteAndOctave) {
	let [, requestedNote, requestedOctave] = /^(\w[b#]?)(\d)$/.exec(noteAndOctave);
	requestedOctave = parseInt(requestedOctave, 10);
	requestedNote = flatToSharp(requestedNote);

	let sampleBank = SAMPLE_LIBRARY[instrument];
	let sample = getNearestSample(sampleBank, requestedNote, requestedOctave);
	let distance = getNoteDistance(sample.note, sample.octave, requestedNote, requestedOctave);


	return fetchSample(sample.file).then(audioBuffer => ({
		audioBuffer: audioBuffer,
		distance: distance
	}));
}

function playSample(instrument, note, destination, delaySeconds = 0) {
	getSample(instrument, note).then(({
		audioBuffer,
		distance
	}) => {
		let playbackRate = Math.pow(2, distance / 12);
		let bufferSource = audioContext.createBufferSource();
		bufferSource.buffer = audioBuffer;
		bufferSource.playbackRate.value = playbackRate;
		bufferSource.connect(audioContext.destination);
		bufferSource.start(audioContext.currentTime + delaySeconds);
	});
}

// playSample('Grand Piano', 'F4',  audioContext.destination);

// ========================TEST=======================
// setTimeout(() => playSample('Grand Piano', 'C4'), 1000);
// function startLoop(instrument, note, destination, loopLengthSeconds, delaySeconds){
// 	playSample(instrument, note);
// 	setInterval(
// 		() => playSample(instrument, note, destination, delaySeconds), 
// 		loopLengthSeconds * 1000
// 	);
// }
// // startLoop('Grand Piano', 'C4', 20, 5);
// fetchSample('Samples/AirportTerminal.wav').then(convolverBuffer => {
// 	let convolver = audioContext.createConvolver();
// 	convolver.buffer = convolverBuffer;
// 	convolver.connect(audioContext.destination);
// 	// Airport Music Eno
// 	startLoop('Grand Piano', 'F4',  convolver, 19.7, 4.0);
//   	startLoop('Grand Piano', 'Ab4', convolver, 17.8, 8.1);
//   	startLoop('Grand Piano', 'C5',  convolver, 21.3, 5.6);
//   	startLoop('Grand Piano', 'Db5', convolver, 22.1, 12.6);
//   	startLoop('Grand Piano', 'Eb5', convolver, 18.4, 9.2);
//   	startLoop('Grand Piano', 'F5',  convolver, 20.0, 14.1);
//   	startLoop('Grand Piano', 'Ab5', convolver, 17.7, 3.1);
// });

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/web_audio/player.js
 * ===========================================================================================
 */

// percussion
function playDrum(_item) {
	if (_item.parent.index == 1) {
		playSample('Drum', 'C4', audioContext.destination);
	} else if (_item.parent.index == 2) {
		playSample('Drum', 'D4', audioContext.destination);
	} else if (_item.parent.index == 3) {
		playSample('Drum', 'F4', audioContext.destination);
	} else {
		playSample('Drum', 'A4', audioContext.destination);
	}
}

// piano and similar
function playPiano(_octave) {
	console.log(_octave);
	if (_octave == 4) {
		playSample('Grand Piano', 'F4', audioContext.destination);
	} else if (_octave == 5) {
		playSample('Grand Piano', 'F5', audioContext.destination);
	} else {
		playSample('Grand Piano', 'F6', audioContext.destination);
	}
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/web_audio/scale.js
 * ===========================================================================================
 */

const F_MAJOR = ['F', 'G', 'A', 'A#', 'C', 'D', 'E'];
const D_MINOR = ['D', 'E', 'F', 'G', 'A', 'A#', 'C'];

const C_MAJOR = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const A_MINOR = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const G_MAJOR = ['G', 'A', 'B', 'C', 'D', 'E', 'F#'];
const E_MINOR = ['E', 'F#', 'G', 'A', 'B', 'C', 'D'];

const D_MAJOR = ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'];
const B_MINOR = ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'];