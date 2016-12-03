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

function tripleLastChild(_item) {
	return _item.lastChild.lastChild.lastChild;
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
	var center = circle.position;
	var rr = circle.bounds.width / 2; // must be ceiled to make sure reference touch with outer circle
	for (var i = 3; i < 8; i++) {
		geometry = new Path.RegularPolygon(center, i, rr);
		geometry.strokeColor = "black";
		geometry.visible = false;
		mReference.addChild(geometry);
	}
	mReference.addChild(circle);
}

function showGeo(_item, _index) {
	var ref = _item.parent.children[_index];
	console.log("geolength: " + _item.parent.children.length);
	if (!ref.visible) {
		ref.visible = true;
		lastGeo = ref;
		// console.log(ref.radius);
	}
}

function hideGeo(ref) {
	// var ref = _item.parent.children[_index];
	if (ref) {
		if (ref.visible) {
			ref.visible = false;
		}
		if (intersectionGroup.hasChildren()) intersectionGroup.removeChildren(); // make sure all reference dots are removed)
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

// // We're going to be working with a third of the length
// // of the path as the offset:
// var offset = path.length / 3;

// // Find the point on the path:
// var point = path.getPointAt(offset);

function intersections() {
	intersectionGroup.removeChildren();
	if (hitResult) {
		if (Key.modifiers.shift) {
			var index = 3; // sides
			var path = hitResult.item.parent.children[index - 3];
			var offset = path.length / index;
			// var _path2 = hitResult.item;
			// var intersections = _path1.getIntersections(_path2);
			// // console.log("sides: " + _path1.sides);
			// console.log("intersects: " + intersections.length);

			for (var i = 0; i < index; i++) {
				var intersectionPath = new Path.Circle({
					center: path.getPointAt(offset * i),
					radius: 4,
					parent: intersectionGroup
				});
				if (i == 0)
					intersectionPath.fillColor = 'red';		// starting point
				else
					intersectionPath.fillColor = 'white';
			}
		}
	}
}