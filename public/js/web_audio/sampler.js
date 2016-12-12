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


	return fetchSample(sample.file).then(audioBuffer => ({
		audioBuffer: audioBuffer,
		distance: distance
	}));
}

function playSample(instrument, note, gain, pan, convolver, delaySeconds = 0) {
	getSample(instrument, note).then(({
		audioBuffer,
		distance
	}) => {
		let playbackRate = Math.pow(2, distance / 12);
		let bufferSource = audioContext.createBufferSource();
		bufferSource.buffer = audioBuffer;
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
	});
}

var mConvolver = [];
for (var i = 0; i < CONVOLVER.length; i++) {
	fetchSample(CONVOLVER[i]).then(convolverBuffer => {
		let convolver = audioContext.createConvolver();
		convolver.buffer = convolverBuffer;
		mConvolver.push(convolver);
	})
}