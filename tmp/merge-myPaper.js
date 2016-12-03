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
        fillColor: mColor
    });

    // Remove this path on the next drag event:
    circle.removeOnDrag();
    if (circle.area > 100) drawState = true;
}

draw.onMouseUp = function(event) {
    // set container
    if (drawState) {
        mDotContainer = new Group();
        mLollipopContainer = new Group();
        mReference = new Group();
        // mReference.name = 'ref';
        // wrap containers up
        mDotContainer.addChild(circle);
        mLollipopContainer.addChild(mDotContainer);
        mForest.addChild(mLollipopContainer);
        // initialize
        lollipopInit(mLollipopContainer);
        // reference group
        mRod = createRod(mLollipopContainer);
        mReference.addChild(mRod);
        mLollipopContainer.appendBottom(mReference);
        referenceInit(mReference);  // add geometry refernce
        // dotContainerInit(mDotContainer);
        // draw state
        drawState = false;
    }
    console.log(project.layers);
    // change tool to edit mode
    edit.activate();
}

// change color on next lollipop
draw.onMouseDown = function(event) {
    mColor.hue = 360 * Math.random();
}

// add circle and remove circle
draw.onKeyDown = function(event) {
    if (event.key == '=') {
        // add circle
        mLollipopContainer = mForest.lastChild;
        circle = mLollipopContainer.lastChild.lastChild.clone();
        circle.scale(0.8);
        mDotContainer = new Group();
        mDotContainer.addChild(circle);
        mLollipopContainer.addChild(mDotContainer);
        // dotContainerInit(mDotContainer);
        console.log("layer has children: " + mForest.children.length);
        // Prevent the key event from bubbling
        return false;
    }
    if (event.key == '-') {
        // remove circle
        if (mForest.lastChild.children.length <= 2) {
            mForest.lastChild.remove();
        } else {
            mLayer.lastChild.removeChildren(mForest.lastChild.children.length - 1);
        }
        console.log("layer has children: " + mForest.children.length);
        return false;
    }
    if (event.key == 'enter') {
        edit.activate();
    }
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
        if (path.name == null) {
            if (hitResult.type == 'segment') {
                segment = hitResult.segment;
            } else if (hitResult.type == 'stroke') {
                var location = hitResult.location;
                segment = path.insert(location.index + 1, event.point);
                path.smooth();
            }
            hitResult.item.bringToFront();

            // draw dots
            var nearestPoint = path.getNearestPoint(event.point);

            // Move the circle to the nearest point:
            var mDot = new SymbolItem(dot);
            mDot.removeOnDrag();
            mDot.position = nearestPoint;
            mDot.data.hit = false;
            mDot.data.initAngle = (mDot.position - path.position).angle - doubleParent(path).data.rod;
            console.log(mDot.data.initAngle);
            console.log(mDot.data.hit);

            // form a group
            console.log(hitResult.item);
            path.parent.appendBottom(mDot);
            mDot.name = 'dot';
            console.log(path.parent.children.length);
        } else {
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
    if (hitResult && hitResult.item)
        if (hitResult.item.name != 'rod') {
            hitResult.item.selected = true;
        }

}

edit.onMouseDrag = function(event) {
    mBands.visible = true;
    mBands.sendToBack();
    if (segment) {
        segment.point += event.delta;
        path.smooth();
    } else if (path) {
        if (MODE == 1) {
            path.parent.position += event.delta;
        } else {
            doubleParent(path).position += event.delta;
        }
    }
}

edit.onMouseUp = function(event) {
    mBands.visible = false;
    setOctave(doubleParent(path));
    console.log("octave: " + doubleParent(path).data.octave);
}

// add circle and remove circle
edit.onKeyDown = function(event) {
    if (event.key == 'enter') {
        draw.activate();
    }
    if (hitResult) {
        if (event.key == '=') {
            console.log(hitResult.item.parent);
            // console.log(hitResult.item.parent.children.length);
            circle = doubleParent(hitResult.item).lastChild.lastChild.clone();
            circle.scale(0.8);
            mDotContainer = new Group();
            mDotContainer.addChild(circle);
            // dotContainerInit(mDotContainer);
            doubleParent(hitResult.item).appendTop(mDotContainer);
        }
        if (event.key == '-') {
            if (doubleParent(hitResult.item).children.length <= 2) {
                doubleParent(hitResult.item).remove();
                draw.activate();
            } else {
                doubleParent(hitResult.item).removeChildren(doubleParent(hitResult.item).children.length - 1);
            }
        }
        if (event.key == 'space') {
            // playback: 1-play, 0-pause
            setPlayback(doubleParent(hitResult.item));
        }
        // press shift to show reference
        if (Key.modifiers.shift) {
            hitResult.item.selected = false;
            showGeo(hitResult.item, 1);
        }
    }
}

// press shift to hide reference
edit.onKeyUp = function(event) {
    if (hitResult) {
        if (!Key.modifiers.shift) {
            hitResult.item.selected = true;
            // hideGeo(hitResult.item, 1);
        }
    }
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/canvas/animation.js
 * ===========================================================================================
 */

function onFrame(event) {
	// iterate each lollipop in the view
	rotationLoop(mForest);
	setRod();
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
		if (_item.parent.index == 0) {
			// this is inside reference group, but do not rotate rod 
			if (_item.index != 0) {
				_item.rotate(angularPerFrame(doubleParent(_item)), doubleParent(_item).data.anchor);
			}
		} else {
			// this is inside dotContainer
			_item.rotate(angularPerFrame(doubleParent(_item)), doubleParent(_item).data.anchor);
		}
		if (_item.name == 'dot') {
			hitDot(_item);
		}
	}
}

// when a dot is hit..
function hitDot(_item) {
	if (_item.intersects(path2rod(_item))) {
		if (!_item.data.hit) {
			// dot2rod(_item).visible = true;
			path2rod(_item).dashArray = [];
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
		path2rod(_item).dashArray = mDashArray;
	}
}

function angularPerFrame(_item) {
	var playback = _item.data.playback;
	var orientation = _item.data.orientation;
	var speed = _item.data.speed;
	return playback * orientation * speed;
};