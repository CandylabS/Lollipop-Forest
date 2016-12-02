function onFrame(event) {
	// Rotate the group by 1 degree from
	// the centerpoint of the view:
	if (layer.hasChildren()) {
		for (var i = 0; i < layer.children.length; i++) {
			if (layer.children[i].hasChildren()) {
				for (var j = 0; j < layer.children[i].children.length; j++) {
					if (layer.children[i].children[j].hasChildren()) {
						for (var k = 0; k < layer.children[i].children[j].children.length; k++) {
							layer.children[i].children[j].children[k].rotate(angularPerFrame(i, j), layer.children[i].children[j].position); // layer.children.[i].children[j].center;
						}
					}
				}
			}
		}
	}
}

function angularPerFrame(_i, _j) {
	var playback = layer.children[_i].data.playback;
	var orientation = layer.children[_i].data.orientation;
	var speed = layer.children[_i].data.speed;
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
	var to = new Point(from.x + length * 2, from.y);
	// to.rotate(angle, from);
	console.log("from, to: " + from + '-' + to);
	var mRod = new Path.Line(from, to).rotate(angle, from);
	mRod.strokeColor = 'black';
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