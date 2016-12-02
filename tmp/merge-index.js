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
var layer = new Layer();
var mLollipopContainer, mDotContainer;
var rods = new Group();
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
});	// Class for dots, presets
var dot = new SymbolDefinition(_dot);	// Create a symbol definition from the path

/*********** MODE **********/
var MODE = 0;
var drawState = false;

/*********** GLOBAL VARIABLES *************/
// global mouseEvent tools
var draw = new Tool();	//create-lollipop.js
var edit = new Tool();	// edit-lollipop.js

// global color
var mColor = {
    hue: 360 * Math.random(),
    saturation: 1,
    brightness: 1,
    alpha: 0.1
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
        // wrap containers up
        mDotContainer.addChild(circle);
        mLollipopContainer.addChild(mDotContainer);
        layer.addChild(mLollipopContainer);
        // initialize
        lollipopInit(mLollipopContainer);
        // dotContainerInit(mDotContainer);
        // draw state
        drawState = false;
    }
}

// change color on next lollipop
draw.onMouseDown = function(event) {
    mColor.hue = 360 * Math.random();
}

// add circle and remove circle
draw.onKeyDown = function(event) {
    if (event.key == '=') {
        // add circle
        mLollipopContainer = layer.lastChild;
        circle = mLollipopContainer.lastChild.lastChild.clone();
        circle.scale(0.8);
        mDotContainer = new Group();
        mDotContainer.addChild(circle);
        mLollipopContainer.addChild(mDotContainer);
        // dotContainerInit(mDotContainer);
        console.log("layer has children: " + layer.children.length);
        // Prevent the key event from bubbling
        return false;
    }
    if (event.key == '-') {
        // remove circle
        if (layer.lastChild.children.length <= 2) {
            layer.lastChild.remove();
        } else {
            layer.lastChild.removeChildren(layer.lastChild.children.length - 1);
        }
        console.log("layer has children: " + layer.children.length);
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
            mDot.data.initAngle = (mDot.position - path.position).angle - path.parent.data.rod;
            console.log(mDot.data.initAngle);

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
    if (segment) {
        segment.point += event.delta;
        path.smooth();
    } else if (path) {
        if (MODE == 1) {
            path.parent.position += event.delta;
        } else {
            path.parent.parent.position += event.delta;
        }
    }
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
            circle = hitResult.item.parent.parent.lastChild.lastChild.clone();
            circle.scale(0.8);
            mDotContainer = new Group();
            mDotContainer.addChild(circle);
            // dotContainerInit(mDotContainer);
            hitResult.item.parent.parent.appendTop(mDotContainer);
        }
        if (event.key == '-') {
            if (hitResult.item.parent.parent.children.length <= 2) {
                hitResult.item.parent.parent.remove();
            } else {
                hitResult.item.parent.parent.removeChildren(hitResult.item.parent.parent.children.length - 1);
            }
        }
        if (event.key == 'space') {
            // playback: 1-play, 0-pause
            setPlayback(hitResult.item.parent.parent);
        }
    }
    if (event.key == 'a') {
        for (var i=0; i<layer.firstChild.firstChild.children.length -1; i++) {
            var myHit = layer.firstChild.firstChild.children[i].rotation + layer.firstChild.firstChild.children[i].data.initAngle;
            console.log("rotation angle: " + myHit);
        }
    }
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/animation.js
 * ===========================================================================================
 */

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