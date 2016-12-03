function path2rod(_path) {
	return _path.parent.parent.firstChild.firstChild;
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
		anchor : circle.position,
		rod: 90,
		playback: 1,
		speed: 1,
		orientation: 1,
	}
	setOctave(_lollipopContainer);
	console.log("octave: " + _lollipopContainer.data.octave);
}

function referenceInit(_reference) {
	// console.log(_reference.nextSibling);
	var center = circle.position;
	var rr = circle.bounds.width/2;
	for (var i = 3; i < 8; i++) {
		geometry = new Path.RegularPolygon(center, i, rr);
		geometry.strokeColor = "black";
		// geometry.visible = false;
		_reference.addChild(geometry);
	}
}

// function showGeo(_item, _index) {
// 	// radius = _item.bounds.width/2;
// 	doubleParent(_item).firstChild.children[_index].visible = true;
// 	// doubleParent(_item).firstChild.children[_index].scale(100);
// }
function showGeo(_item, _index) {
	var ref = doubleParent(_item).firstChild.children[_index];
	if (!ref.visible) {
		ref.visible = true;
		ref.scale(_item.bounds.width / 2, ref.position);
	}
}

function hideGeo(_item, _index) {
	var ref = doubleParent(_item).firstChild.children[_index];
	if (ref.visible) {
		ref.visible = false;
		ref.scale(2 / _item.bounds.width);
	}
}


function createRod(_lollipopContainer) {
	var length = _lollipopContainer.firstChild.lastChild.toShape(false).radius;
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
	return mRod;
}

function setRod() {
	if (hitResult) {
		if (Key.isDown('up')) {
			path2rod(hitResult.item).rotate(-1, path2rod(hitResult.item).parent.nextSibling.position);
			doubleParent(hitResult.item).data.rod -= 1;
		}
		if (Key.isDown('down')) {
			path2rod(hitResult.item).rotate(1, path2rod(hitResult.item).parent.nextSibling.position);
			doubleParent(hitResult.item).data.rod += 1;
		}
	}
	// console.log("deltaAngle: " + deltaAngle);
	// _lollipopContainer.firstChild.rotate(_deltaAngle, _lollipopContainer.firstChild.data.from);
}

function setOctave(_lollipopContainer) {
	_lollipopContainer.data.octave = bandCeil - Math.round(_lollipopContainer.lastChild.position.y / bandWidth);
}