function onFrame(event) {
	// Rotate the group by 1 degree from
	// the centerpoint of the view:
	if (mLayer.hasChildren()) {
		for (var i = 0; i < mLayer.children.length; i++) {
			if (mLayer.children[i].hasChildren()) {
				for (var j = 0; j < mLayer.children[i].children.length; j++) {
					if (mLayer.children[i].children[j].hasChildren()) {
						for (var k = 0; k < mLayer.children[i].children[j].children.length; k++) {
							// rotationStep(layer.children[i].children[j].children[k]);
							mLayer.children[i].children[j].children[k].rotate(angularPerFrame(i, j), mLayer.children[i].children[j].position); // layer.children.[i].children[j].center;
						}
					}
				}
			}
		}
	}
}

// function onFrame(event) {
// 	// iterate each lollipop in the view
// 	rotationStep(layer);
// }

// function rotationStep(_item) {
// 	if (_item.hasChildren()) {
// 		for (var i=0; i< _item.children.length; i++){
// 			rotationStep(_item.children[i]);
// 		}
// 	} else {
// 		_item.rotate(angularPerFrame(layer.firstChild), _item.parent.position);
// 	}
// }
// function angularPerFrame(_item) {
// 	var playback = _item.data.playback;
// 	var orientation = _item.data.orientation;
// 	var speed = _item.data.speed;
// 	return playback * orientation * speed;
// }

function angularPerFrame(_i, _j) {
	var playback = mLayer.children[_i].data.playback;
	var orientation = mLayer.children[_i].data.orientation;
	var speed = mLayer.children[_i].data.speed;
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
	mRod = createRod(_lollipopContainer);
	_lollipopContainer.appendBottom(mRod);
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