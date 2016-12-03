function path2rod(_path) {
	return tripleParent(_path).firstChild;
}

function dot2rod(_dot) {
	return doubleParent(_dot).firstChild;
}

function doubleParent(_item) {
	return _item.parent.parent;
}

function tripleParent(_item) {
	return _item.parent.parent.parent;
}

function setPlayback(_lollipopContainer) {
	_lollipopContainer.data.playback = 1 - _lollipopContainer.data.playback;
}

// initialization
function lollipopInit() {
	mLollipopContainer = new Group();
	mLollipopContainer.addChild(mDotContainer);

	mLollipopContainer.data = {
		rod: 90,
		playback: 1,
		speed: 1,
		orientation: 1,
	}
	setOctave(mLollipopContainer);
	console.log("octave: " + mLollipopContainer.data.octave);

	mRod = createRod(mLollipopContainer);
	mLollipopContainer.appendBottom(mRod);
}

function dotContainerInit() {
	mDotContainer = new Group();
	mDotContainer.addChild(mReference);
}

function referenceInit() {
	mReference = new Group();
	mReference.addChild(circle);
	var center = circle.position;
	var rr = circle.bounds.width / 2;
	for (var i = 3; i < 8; i++) {
		geometry = new Path.RegularPolygon(center, i, rr);
		geometry.strokeColor = "black";
		geometry.visible = false;
		mReference.addChild(geometry);
	}
}

function showGeo(_item, _index) {
	var ref = _item.parent.children[_index];
	if (!ref.visible) {
		ref.visible = true;
		// console.log(ref.radius);
	}
}

function hideGeo(_item, _index) {
	var ref = _item.parent.children[_index];
	if (ref.visible) {
		ref.visible = false;
	}
}


function createRod(_lollipopContainer) {
	var length = circle.toShape(false).radius;
	var angle = _lollipopContainer.data.rod;
	var from = _lollipopContainer.position;
	var to = new Point(from.x + length * 1.8, from.y);
	// to.rotate(angle, from);
	console.log("from, to: " + from + '-' + to);
	var mRod = new Path.Line(from, to).rotate(angle, from);
	mRod.style = {
		strokeColor: '#9C9C9A',
		dashArray: mDashArray,
		visible: true
	}
	mRod.name = 'rod';
	return mRod;
}

function setRod() {
	if (hitResult) {
		if (Key.isDown('up')) {
			path2rod(hitResult.item).rotate(-1, path2rod(hitResult.item).nextSibling.position);
			tripleParent(hitResult.item).data.rod -= 1;
		}
		if (Key.isDown('down')) {
			path2rod(hitResult.item).rotate(1, path2rod(hitResult.item).nextSibling.position);
			tripleParent(hitResult.item).data.rod += 1;
		}
	}
	// console.log("deltaAngle: " + deltaAngle);
	// _lollipopContainer.firstChild.rotate(_deltaAngle, _lollipopContainer.firstChild.data.from);
}

function setOctave(_lollipopContainer) {
	_lollipopContainer.data.octave = bandCeil - Math.round(_lollipopContainer.lastChild.firstChild.position.y / bandWidth);
}