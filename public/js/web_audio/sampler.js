// =======================SET AUDIO==============================
let audioContext = new AudioContext();
var gainNode = audioContext.createGain();
var panNode = audioContext.createStereoPanner();
// panNode.pan.value = -0.5;
// gainNode.gain.value = 0.5;

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
	let distance = getNoteDistance(requestedNote, requestedOctave, sample.note, sample.octave);
	let note = SAMPLE_LIBRARY[instrument].indexOf(sample);

	return [note, distance];
}

function playPianoSample(instrument, noteAndOctave, gain, pan, convolver, delaySeconds = 0) {
	let map = getSample(instrument, noteAndOctave)
	let bufferSource = mPiano[map[0]];
	let distance = map[1];
	console.log('distance: ' + distance);
	let playbackRate = Math.pow(2, distance / 12);
	bufferSource.playbackRate.value = playbackRate;
	gainNode.gain.value = gain;
	panNode.pan.value = pan;
	if (convolver < 0) {
		bufferSource.connect(panNode);
	} else {
		bufferSource.connect(mConvolver[convolver]);
		mConvolver[convolver].connect(panNode);
	}
	panNode.connect(gainNode);
	gainNode.connect(audioContext.destination);
	bufferSource.start(audioContext.currentTime + delaySeconds);
}

function playDrumSample(note, octave, gain, pan, convolver, delaySeconds = 0) {
	let bufferSource = mDrum[note];
	gainNode.gain.value = gain;
	panNode.pan.value = pan;
	if (convolver < 0) {
		bufferSource.connect(panNode);
	} else {
		bufferSource.connect(mConvolver[convolver]);
		mConvolver[convolver].connect(panNode);
	}
	panNode.connect(gainNode);
	gainNode.connect(audioContext.destination);
	bufferSource.start(audioContext.currentTime + delaySeconds);
}
//****************** Load Samples *********************
var mConvolver = [];
for (var i = 0; i < CONVOLVER.length; i++) {
	fetchSample(CONVOLVER[i]).then(convolverBuffer => {
		let convolver = audioContext.createConvolver();
		convolver.buffer = convolverBuffer;
		mConvolver.push(convolver);
	})
}

var mDrum = [];
for (var i = 0; i < DRUM.length; i++) {
	fetchSample(DRUM[i]).then(audioBuffer => {
		let bufferSource = audioContext.createBufferSource();
		bufferSource.buffer = audioBuffer;
		mDrum.push(bufferSource);
	});
}

var mPiano = [];
for (var i = 0; i < SAMPLE_LIBRARY['Grand Piano'].length; i++) {
	fetchSample(SAMPLE_LIBRARY['Grand Piano'][i].file).then(audioBuffer => {
		let bufferSource = audioContext.createBufferSource();
		bufferSource.buffer = audioBuffer;
		mPiano.push(bufferSource);
	});
}