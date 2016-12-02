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
			speed: 0.5,
			orientation: 1,
		}
		// console.log("lollipop init");
}

function createRod(_lollipopContainer) {
	var length = _lollipopContainer.firstChild.lastChild.toShape(false).radius;
	var angle = _lollipopContainer.data.rod;
	var from = _lollipopContainer.position;
	var to = new Point(from.x + length * 1.8, from.y);
	// to.rotate(angle, from);
	console.log("from, to: " + from + '-' + to);
	var mRod = new Path.Line(from, to).rotate(angle, from);
	mRod.strokeColor = '#9C9C9A';
	mRod.dashArray = [4, 8];
	mRod.name = 'rod';
	mRod.visible = false;
	return mRod;
}