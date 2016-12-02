function onFrame(event) {
	// iterate each lollipop in the view
	rotationStep(mLayer);
}

function rotationStep(_item) {
	if (_item.hasChildren()) {
		for (var i = 0; i < _item.children.length; i++) {
			rotationStep(_item.children[i]);
		}
	} else if (_item.name != 'rod') {
		if (doubleParent(_item) != null) {
			_item.rotate(angularPerFrame(doubleParent(_item)), _item.parent.position);
			if (_item.name == 'dot') {
				if (_item.intersects(dot2rod(_item))) {
					if (!_item.data.hit) {
						_item.data.hit = true;
						dot2rod(_item).visible = true;
						console.log('hit');
						console.log(_item.rotation + _item.data.initAngle);
					}
				} else if (_item.data.hit) {
					_item.data.hit = false;
				}
			}
		}
	}
}

function angularPerFrame(_item) {
	var playback = _item.data.playback;
	var orientation = _item.data.orientation;
	var speed = _item.data.speed;
	return playback * orientation * speed;
}