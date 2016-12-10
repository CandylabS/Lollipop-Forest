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
}