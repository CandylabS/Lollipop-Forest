/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/canvas/global.js
 * ===========================================================================================
 */

// lollipop prototype

/********** HIERARCHY *********/
// <layer>
// 	<lollipopContainer>
// 		<dotContainer>
// 			<dot></dot>
// 		</dotContainer>
// 	</lollipopContainer>
// </layer>
var mLayer = new Layer();
var mForest = new Group();
var mBands = new Group();

mLayer.addChild(mForest);
mLayer.addChild(mBands);

/*
_lollipopContainer.data = {
	playback: [0, 1],
	speed: 	[1x, 2x, 3x],
	orientation: [1, -1],
    octave: [2, 3, 4, 5, 6],
    key: 	[C, F, G, A],
    chord: 	[1, 3, 5],
    instrument: ['piano']
};
_dotContainer.data = {
    rod : 0,
    audioBuffer: 'sound.wav',
    reverb: 'room.wav',
    delay: 2s,
    echo: 6s,
    synth: true/false,
    ...
};
*/

/*********** GLOBAL VARIABLES *************/
// common instance
var mLollipopContainer, mDotContainer, mReference;
var circle, mRod;
var _dot = new Path.Circle({
    center: new Point(0, 0),
    radius: 5,
    fillColor: 'white',
    strokeColor: 'black',
    strokeWidth: 0.5
}); // Class for dots, presets
var dot = new SymbolDefinition(_dot); // Create a symbol definition from the path

var intersectionGroup = new Group();
var divisionGroup = new Group();
var lastGeo, div;

// MODE section
var MODE = 0;   // if inner cicle can be dragged

// global mouseEvent tools
var draw = new Tool(); //create-lollipop.js
var edit = new Tool(); // edit-lollipop.js
var drawState = false;  // use when drawing, if circle is too small then it's not a lollipop

// global color
var mColor = {
    hue: 360 * Math.random(),
    saturation: 0.5,
    brightness: 1,
    alpha: 0.3
}
// global styles
mDashArray = [5, 5];

/*********** GLOBAL INITIALIZE *************/
// octave band
var bandNum = 3;
var bandCeil = 6;
var bandWidth = view.size.height / bandNum;
bandsInit(bandNum);

function bandsInit(num) {
    for (var i = 0; i < num; i++) {
        band = new Shape.Rectangle({
            point: [0, bandWidth * i],
            size: [view.size.width, bandWidth],
            fillColor: { hue: 43, saturation: 6/100, brightness: (94-i*2)/100 }
        });
        mBands.addChild(band);
    }
    mBands.visible = false;
}


/********** edit-lollipop.js **********/
// edit tool path editing
var hitOptions = {
    segments: false,
    stroke: true,
    fill: true,
    tolerance: 5
};
var segment, path, hitResult;
var deltaAngle = 0; // use rod position;

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/canvas/geometry.js
 * ===========================================================================================
 */

//definition of mGeometry Group
// mGeometry.style = {
// 	visible: false;
// }

// generate instances of unit polygon
// for (var i = 3; i < 8; i++) {
// 	_geometry = new Path.RegularPolygon(center, i, 1);
// };

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/canvas/misc.js
 * ===========================================================================================
 */

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

function setOrientation(_lollipopContainer) {
	_lollipopContainer.data.orientation *= -1;
}

function drawDot(_point, _path) {
	// Move the circle to the nearest point:
	var mDot = new SymbolItem(dot);
	mDot.removeOnDrag();
	mDot.position = _point;
	mDot.data.hit = false;
	mDot.data.initAngle = (mDot.position - _path.position).angle - tripleParent(_path).data.rod;
	console.log(mDot.data.initAngle);
	console.log(mDot.data.hit);

	// form a group
	console.log(hitResult.item);
	doubleParent(hitResult.item).appendBottom(mDot);
	mDot.name = 'dot';
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
	var rad = circle.bounds.width / 2; // must be ceiled to make sure reference touch with outer circle
	for (var i = 3; i < 8; i++) {
		geometry = new Path.RegularPolygon(center, i, rad);
		geometry.strokeColor = "black";
		geometry.visible = false;
		mReference.addChild(geometry);
	}
	// circle.data.gap = offsetGap(circle, geometry);
	mReference.addChild(circle);
	// console.log("circle offset " + circle.data.gap);
	// console.log("geo offset " + geometry.getPointAt(0));
}

function showGeo(_item, _index) {
	hideGeo();
	_index = (_index + 5) % 5;	// do not exceed bounds
	var ref = _item.parent.children[_index];
	// console.log("geolength: " + _item.parent.children.length);
	if (!ref.visible) {
		ref.visible = true;
		lastGeo = ref;
		// console.log(ref.radius);
	}
}

function hideGeo() {
	var ref = lastGeo;
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
	_lollipopContainer.data.octave = bandCeil - Math.round(tripleLastChild(_lollipopContainer).position.y / bandWidth);
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/canvas/create-lollipop.js
 * ===========================================================================================
 */

// draw lollipop outline
draw.onMouseDrag = function(event) {
    circle = new Path.Circle({
        center: event.downPoint,
        radius: (event.downPoint - event.point).length,
        fillColor: mColor,
        name : 'circle'
    });
    // Remove this path on the next drag event:
    circle.removeOnDrag();
    if (circle.area > 500) drawState = true;
}

draw.onMouseUp = function(event) {
    // set container
    if (drawState) {
        referenceInit();
        dotContainerInit();
        lollipopInit();
        mForest.addChild(mLollipopContainer);
        drawState = false;
    }
    console.log(project.layers);
    // change tool to edit mode
    edit.activate();
}

// change color on next lollipop
draw.onMouseDown = function(event) {
    mColor.hue = 360 * Math.random();
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/canvas/edit-lollipop.js
 * ===========================================================================================
 */

edit.onMouseDown = function(event) {
    segment = path = null;
    hitResult = project.hitTest(event.point, hitOptions);

    // if (event.modifiers.shift) {
    //     if (hitResult.type == 'segment') {
    //         hitResult.segment.remove();
    //     };
    //     return;
    // }

    if (hitResult) {
        path = hitResult.item;
        if (path.name == 'circle') {
            if (hitResult.type == 'segment') {
                segment = hitResult.segment;
            } else if (hitResult.type == 'stroke') {
                var location = hitResult.location;
                segment = path.insert(location.index + 1, event.point);
                path.smooth();
            }
            hitResult.item.bringToFront();

            // draw dots
            if (Key.modifiers.shift) {
                console.log("bounds: " + path.bounds.width);
                if (intersectionGroup.hasChildren())
                    for (var i = 0; i < intersectionGroup.children.length; i++) {
                        if (event.point.isClose(intersectionGroup.children[i].position, path.bounds.width / 5)) {
                            var nearestPoint = path.getNearestPoint(intersectionGroup.children[i].position);
                            drawDot(nearestPoint, path);
                        }
                    }
                if (divisionGroup.hasChildren())
                    for (var i = 0; i < divisionGroup.children.length; i++) {
                        if (event.point.isClose(divisionGroup.children[i].position, path.bounds.width / 5)) {
                            var nearestPoint = divisionGroup.children[i].position;
                            drawDot(nearestPoint, path);
                        }
                    }
                    // var nearestPoint = path.getNearestPoint(event.point);
                console.log('shift!');
            } else {
                var nearestPoint = path.getNearestPoint(event.point);
                drawDot(nearestPoint, path);
            }
            // console.log(tripleParent(path).children.length);
        } else if (path.name == 'dot') {
            // remove dots
            path.remove();
        }
    }
}

edit.onMouseMove = function(event) {
    hitResult = project.hitTest(event.point, hitOptions);
    project.activeLayer.selected = false;
    /*** FOR LATER USE ONLY ***/
    // This is for dragging event
    if (hitResult && hitResult.item) {
        if (hitResult.item.name == 'dot' || hitResult.item.name == 'circle')
            hitResult.item.selected = true;
    }
}

// if (tripleParent(hitResult.item).data.playback == 0)

edit.onMouseDrag = function(event) {
    mBands.visible = true;
    mBands.sendToBack();
    if (path && path.name == 'circle') {
        if (MODE == 1) {
            doubleParent(path).position += event.delta;
        } else {
            tripleParent(path).position += event.delta;
        }
    }
}

edit.onMouseUp = function(event) {
    mBands.visible = false;
    if (path && path.name == 'circle') {
        setOctave(tripleParent(path));
        console.log("octave: " + tripleParent(path).data.octave);
    }
}

// add circle and remove circle
edit.onKeyDown = function(event) {
    if (event.key == 'enter') {
        draw.activate();
    }
    if (hitResult && hitResult.item.name == 'circle') {
        // add circle
        if (event.key == '=') {
            console.log(hitResult.item.parent);
            // console.log(hitResult.item.parent.children.length);
            circle = tripleLastChild(tripleParent(hitResult.item)).clone();
            circle.name = 'circle';
            circle.scale(0.8);
            referenceInit();
            dotContainerInit();
            tripleParent(hitResult.item).appendTop(mDotContainer);
        }
        // remove circle
        if (event.key == '-') {
            if (tripleParent(hitResult.item).children.length <= 2) {
                tripleParent(hitResult.item).remove();
                if (!mForest.hasChildren()) draw.activate(); // when there is no lollipop, switch into draw tool
            } else {
                tripleParent(hitResult.item).removeChildren(tripleParent(hitResult.item).children.length - 1);
            }
        }
        // stop playing
        if (event.key == 'space') {
            // playback: 1-play, 0-pause
            setPlayback(tripleParent(hitResult.item));
        }
        // reverse playing
        if (event.key == 'r') {
            setOrientation(tripleParent(hitResult.item));
        }
        if (event.key == 'o') {
            console.log("circle offset " + circle.getPointAt(0));
            console.log("geo offset " + geometry.getPointAt(0));
        }
        // press shift to show reference
        if (Key.modifiers.shift) {
            var index = (lastGeo) ? (lastGeo.index) : 0;
            div = 1;
            if (Key.isDown('left')) {
                index -= 1;
            } else if (Key.isDown('right')) {
                index += 1;
            }
            if (Key.isDown('@')) {
                div = 2;
                console.log('2');
            }
            if (Key.isDown('#')) {
                div = 3;
            }
            if (Key.isDown('$')) {
                div = 4;
            }
            hitResult.item.selected = false;
            showGeo(hitResult.item, index);
        }
    }
}

// press shift to hide reference
edit.onKeyUp = function(event) {
    if (!Key.modifiers.shift) {
        if (hitResult) hitResult.item.selected = true;
        hideGeo();
    }
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/canvas/animation.js
 * ===========================================================================================
 */

function onFrame(event) {
	// iterate each lollipop in the view
	rotationLoop(mForest); // defalut
	setRod(); // when key == "up" || key == "down"
	intersections(); // when key.modifier.shift
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
		// this is inside reference group, but do not rotate rod 
		if (_item.name != 'rod') {
			if (_item.name == 'dot') {
				_item.rotate(angularPerFrame(doubleParent(_item)), _item.parent.lastChild.position);
				hitDot(_item);
			} else {
				_item.rotate(angularPerFrame(tripleParent(_item)), _item.parent.lastChild.position);
			}
		}
	}
}

// when a dot is hit..
function hitDot(_item) {
	if (_item.intersects(dot2rod(_item))) {
		if (!_item.data.hit) {
			// dot2rod(_item).visible = true;
			dot2rod(_item).dashArray = [];
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
		dot2rod(_item).dashArray = mDashArray;
	}
}

function angularPerFrame(_item) {
	var playback = _item.data.playback;
	var orientation = _item.data.orientation;
	var speed = _item.data.speed;
	return playback * orientation * speed;
}



function intersections() {
	intersectionGroup.removeChildren();
	divisionGroup.removeChildren();
	if (hitResult && hitResult.item.name == 'circle') {
		if (Key.modifiers.shift) {
			// reference geometry vertex points
			var index = (lastGeo) ? (lastGeo.index + 3) : 3;
			var path1 = hitResult.item.parent.children[index - 3];
			var path2 = hitResult.item;
			var offset1 = path1.length / index;
			var offset2 = path2.length / (index * div);

			for (var i = 0; i < index; i++) {
				// var center = path1.getPointAt(offset1 * i)
				var intersectionPath = new Path.Circle({
					center: path1.getPointAt(offset1 * i),
					radius: 4,
					parent: intersectionGroup
				});
				intersectionPath.fillColor = (i == 0) ? 'red' : 'white';
				if (div > 1) {
					var start = path2.getOffsetOf(path2.getNearestPoint(path1.getPointAt(offset1 * i)));
					for (var j = 1; j < div; j++) {
						start = ((start + offset2 * j )> path2.length) ? (start-path2.length):start;
						var divisionPath = new Path.Circle({
							center: path2.getPointAt(start + offset2 * j),
							radius: 3,
							fillColor: 'white',
							parent: divisionGroup
						});
					}
				}
			}
		}
	}
};