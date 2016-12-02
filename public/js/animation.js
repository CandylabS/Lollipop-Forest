function onFrame(event) {
	// iterate each lollipop in the view
	rotationStep(mLayer);
}

function rotationStep(_item) {
	if (_item.hasChildren()) {
		for (var i=0; i< _item.children.length; i++){
			rotationStep(_item.children[i]);
		}
	} else if (_item.name != 'rod') {
		if (_item.parent.parent != null) {
			_item.rotate(angularPerFrame(_item.parent.parent), _item.parent.position);
		}
	}
}
function angularPerFrame(_item) {
	var playback = _item.data.playback;
	var orientation = _item.data.orientation;
	var speed = _item.data.speed;
	return playback * orientation * speed;
}

// initialization
function lollipopInit(_lollipopContainer) {
	_lollipopContainer.data = {
		rod: 90,
		playback: 1,
		speed: 1,
		orientation: 1,
	}
	// console.log("lollipop init");
}

// function dotContainerInit(_dotContainer) {
// 	// console.log("dot init");
// }

function createRod(_lollipopContainer) {
	var length = _lollipopContainer.firstChild.lastChild.toShape(false).radius;
	var angle = _lollipopContainer.data.rod;
	var from = _lollipopContainer.position;
	var to = new Point(from.x + length * 1.8, from.y);
	// to.rotate(angle, from);
	console.log("from, to: " + from + '-' + to);
	var mRod = new Path.Line(from, to).rotate(angle, from);
	mRod.strokeColor = 'black';
	mRod.name = 'rod';
	return mRod;
}

// intersection and hide/show
// Hide the path:
// path.visible = false;
// Check whether the bounding box of the two circle
// shaped paths intersect:
// if (largeCircle.bounds.intersects(circle.bounds)

function setPlayback(_lollipopContainer) {
	_lollipopContainer.data.playback = 1 - _lollipopContainer.data.playback;
}