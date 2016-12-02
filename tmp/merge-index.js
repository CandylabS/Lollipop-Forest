/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/global.js
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
var mLollipopContainer, mDotContainer;
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
var circle, mRod;
var _dot = new Path.Circle({
    center: new Point(0, 0),
    radius: 5,
    fillColor: 'white',
    strokeColor: 'black',
    strokeWidth: 0.5
}); // Class for dots, presets
var dot = new SymbolDefinition(_dot); // Create a symbol definition from the path

/*********** MODE **********/
var MODE = 0;   // if inner cicle can be dragged
var drawState = false;

/*********** GLOBAL VARIABLES *************/
// global mouseEvent tools
var draw = new Tool(); //create-lollipop.js
var edit = new Tool(); // edit-lollipop.js

// global color
var mColor = {
    hue: 360 * Math.random(),
    saturation: 0.5,
    brightness: 1,
    alpha: 0.3
}

// octave band
bandsInit(3);

function bandsInit(num) {
    for (var i = 0; i < num; i++) {
        band = new Shape.Rectangle({
            point: [0, view.size.height / num * i],
            size: [view.size.width, view.size.height / num],
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

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/misc.js
 * ===========================================================================================
 */

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
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/create-lollipop.js
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
        // initialize
        lollipopInit(mLollipopContainer);
        // wrap containers up
        mDotContainer.addChild(circle);
        mLollipopContainer.addChild(mDotContainer);
        mForest.addChild(mLollipopContainer);
        // rod
        mRod = createRod(mLollipopContainer);
        mLollipopContainer.appendBottom(mRod);
        // dotContainerInit(mDotContainer);
        // draw state
        drawState = false;
    }
    console.log(project.layers);
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
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/edit-lollipop.js
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
        hitResult.item.selected = true;
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
    }
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/animation.js
 * ===========================================================================================
 */

function onFrame(event) {
	// iterate each lollipop in the view
	rotationStep(mForest);
}

function rotationStep(_item) {
	if (_item.hasChildren()) {
		for (var i = 0; i < _item.children.length; i++) {
			rotationStep(_item.children[i]);
		}
	} else if (_item.name != 'rod') {
		if (doubleParent(_item) != null) {
			_item.rotate(angularPerFrame(doubleParent(_item)), _item.parent.position);
			if (_item.name == 'dot') {
				if (_item.intersects(dot2rod(_item))) {
					if (!_item.data.hit) {
						dot2rod(_item).visible = true;
						_item.data.hit = true;
						console.log('hit');
						console.log(_item.rotation + _item.data.initAngle);
					}
				} else if (_item.data.hit) {
					_item.data.hit = false;
					dot2rod(_item).visible = false;
				}
			}
		}
	}
}

function angularPerFrame(_item) {
	var playback = _item.data.playback;
	var orientation = _item.data.orientation;
	var speed = _item.data.speed;
	return playback * orientation * speed;
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/timing.js
 * ===========================================================================================
 */

;

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/sampler.js
 * ===========================================================================================
 */

;