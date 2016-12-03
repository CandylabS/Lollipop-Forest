function onFrame(event) {
	// iterate each lollipop in the view
	rotationLoop(mForest);
	setRod();
}

function rotationLoop(_item) {
	if (_item.hasChildren()) {
		for (var i = 0; i < _item.children.length; i++) {
			rotationLoop(_item.children[i]);
		}
	} else {
		rotationStep(_item);
	}
}

function rotationStep(_item) {
	// all components rotate other than
	if (doubleParent(_item) != null) {
		// this is inside reference group, but do not rotate rod 
		if (_item.name != 'rod') {
			if (_item.name == 'dot') {
				_item.rotate(angularPerFrame(doubleParent(_item)), _item.parent.position);
				hitDot(_item);
			} else {
				_item.rotate(angularPerFrame(tripleParent(_item)), doubleParent(_item).position);
			}
		}
	}
}

// when a dot is hit..
function hitDot(_item) {
	if (_item.intersects(dot2rod(_item))) {
		if (!_item.data.hit) {
			// dot2rod(_item).visible = true;
			dot2rod(_item).dashArray = [];
			_item.data.hit = true;
			if (doubleParent(_item).data.octave == 4) {
				playSample('Grand Piano', 'F4', audioContext.destination);
			} else if (doubleParent(_item).data.octave == 5) {
				playSample('Grand Piano', 'F5', audioContext.destination);
			} else {
				playSample('Grand Piano', 'F6', audioContext.destination);
			}
			console.log('hit');
			console.log(_item.rotation + _item.data.initAngle);
		}
	} else if (_item.data.hit) {
		_item.data.hit = false;
		// dot2rod(_item).visible = false;
		dot2rod(_item).dashArray = mDashArray;
	}
}

function angularPerFrame(_item) {
	var playback = _item.data.playback;
	var orientation = _item.data.orientation;
	var speed = _item.data.speed;
	return playback * orientation * speed;
}