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
		if (_item.parent.index == 0) {
			// this is inside reference group, but do not rotate rod 
			if (_item.index != 0) {
				_item.rotate(angularPerFrame(doubleParent(_item)), _item.parent.nextSibling.position);
			}
		} else {
			// this is inside dotContainer
			_item.rotate(angularPerFrame(doubleParent(_item)), _item.parent.position);
		}
		if (_item.name == 'dot') {
			hitDot(_item);
		}
	}
}

// when a dot is hit..
function hitDot(_item) {
	if (_item.intersects(path2rod(_item))) {
		if (!_item.data.hit) {
			// dot2rod(_item).visible = true;
			path2rod(_item).dashArray = [];
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
		path2rod(_item).dashArray = mDashArray;
	}
}

function angularPerFrame(_item) {
	var playback = _item.data.playback;
	var orientation = _item.data.orientation;
	var speed = _item.data.speed;
	return playback * orientation * speed;
}