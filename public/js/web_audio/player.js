// percussion
function playDrum(_item, _data) {
	playDrumSample(_item.parent.index - 1, '',_data.gain, _data.pan, _data.reverb);
}

// piano and similar
function playPiano(_item, _data) {
	// console.log(_item.parent.index);
	var octave = _data.octave;
	var keyArray = findKey(_data.key);
	var index = _item.parent.index + _data.root;
	if (index > 7) {
		note = keyArray[index - 8];
		octave += 1;
	} else {
		note = keyArray[index - 1];
	}
	console.log('note+octave' + note + octave);
	console.log('reverb' + _data.reverb);
	console.log('gain' + _data.gain);
	playPianoSample('Grand Piano', note + octave, _data.gain, _data.pan, _data.reverb);
}

function findKey(_key) {
	var keyArray;
	switch (_key) {
		case 'F':
			keyArray = F_MAJOR;
			break;
		case 'Dm':
			keyArray = D_MINOR;
			break;
		case 'C':
			keyArray = C_MAJOR;
			break;
		case 'Am':
			keyArray = A_MINOR;
			break;
		case 'G':
			keyArray = G_MAJOR;
			break;
		case 'Em':
			keyArray = E_MINOR;
			break;
		case 'D':
			keyArray = F_MAJOR;
			break;
		case 'Bm':
			keyArray = B_MINOR;
			break;
		default:
			keyArray = [];
	};
	return keyArray;
}