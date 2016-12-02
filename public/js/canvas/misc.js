function dot2rod(_dot) {
	return _dot.parent.parent.firstChild;
}

function doubleParent(_item) {
	return _item.parent.parent;
}

function setPlayback(_lollipopContainer) {
	_lollipopContainer.data.playback = 1 - _lollipopContainer.data.playback;
}

// initialization
function lollipopInit(_lollipopContainer) {
	_lollipopContainer.data = {
		rod: 90,
		playback: 1,
		speed: 1,
		orientation: 1,
	}
	setOctave(_lollipopContainer);
	console.log("octave: " + _lollipopContainer.data.octave);
}

function createRod(_lollipopContainer) {
	var length = _lollipopContainer.firstChild.lastChild.toShape(false).radius;
	var angle = _lollipopContainer.data.rod;
	var from = _lollipopContainer.position;
	var to = new Point(from.x + length * 1.8, from.y);
	// to.rotate(angle, from);
	console.log("from, to: " + from + '-' + to);
	var mRod = new Path.Line(from, to).rotate(angle, from);
	mRod.name = 'rod';
	mRod.style = {
		strokeColor: '#9C9C9A',
		dashArray: mDashArray,
		visible: true
	}
	mRod.data.from = from;
	return mRod;
}

function setRod() {
	if (hitResult) {
		if (Key.isDown('up')) {
			doubleParent(hitResult.item).firstChild.rotate(-1, doubleParent(hitResult.item).firstChild.data.from);
			doubleParent(hitResult.item).data.rod -= 1;
		}
		if (Key.isDown('down')) {
			doubleParent(hitResult.item).firstChild.rotate(1, doubleParent(hitResult.item).firstChild.data.from);
			doubleParent(hitResult.item).data.rod += 1;
		}
	}
	// console.log("deltaAngle: " + deltaAngle);
	// _lollipopContainer.firstChild.rotate(_deltaAngle, _lollipopContainer.firstChild.data.from);
}

function setOctave(_lollipopContainer) {
	_lollipopContainer.data.octave = bandCeil - Math.round(_lollipopContainer.lastChild.position.y / bandWidth);
}