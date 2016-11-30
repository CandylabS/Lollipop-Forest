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
var lollipopContainer, dotContainer;
var circle;
var _dot = new Path.Circle({
    center: new Point(0, 0),
    radius: 5,
    fillColor: 'white',
    strokeColor: 'black'
});	// Class for dots, presets
var dot = new SymbolDefinition(_dot);	// Create a symbol definition from the path

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
    dotContainer = new Group();
    lollipopContainer = new Group();
    // Remove this path on the next drag event:
    circle.removeOnDrag();
    lollipopContainer.removeOnDrag();
    // wrap up
    dotContainer.addChild(circle);
    lollipopContainer.addChild(dotContainer);
    layer.addChild(lollipopContainer);
    console.log(dotContainer.firstChild);
    console.log("dot has children: " + dotContainer.children.length);
    console.log("lollipop has children: " + lollipopContainer.children.length);
    console.log("layer has children: " + layer.children.length);
}

// change color on next lollipop
draw.onMouseDown = function(event) {
    mColor.hue = 360 * Math.random();
}

// add circle and remove circle
draw.onKeyDown = function(event) {
    if (event.key == '=') {
        // add circle
        lollipopContainer = layer.lastChild;
        circle = lollipopContainer.lastChild.firstChild.clone();
        circle.scale(0.8);
        dotContainer = new Group();
        dotContainer.addChild(circle);
        lollipopContainer.addChild(dotContainer);
        console.log("layer has children: " + layer.children.length);
        // Prevent the key event from bubbling
        return false;
    }
    if (event.key == '-') {
        // remove circle
        if (layer.lastChild.children.length <= 1) {
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
    if (event.key == 'space') {
        layer.removeChildren(layer.children.length - 1);
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
        path.position += event.delta;
    }
}

// add circle and remove circle
edit.onKeyDown = function(event) {
    if (event.key == 'space') {
        draw.activate();
    }
    if (event.key == '=') {
        if (hitResult) {
            console.log(hitResult.item.parent);
            // console.log(hitResult.item.parent.children.length);
            circle = hitResult.item.parent.parent.lastChild.lastChild.clone();
            circle.scale(0.8);
            dotContainer = new Group();
            dotContainer.addChild(circle);
            hitResult.item.parent.parent.addChild(dotContainer);
        }
    }
    if (event.key == '-') {
        if (hitResult) {
            if (hitResult.item.parent.parent.children.length <= 1) {
                hitResult.item.parent.parent.remove();
            } else {
                hitResult.item.parent.parent.removeChildren(hitResult.item.parent.parent.children.length - 1);
            }
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
            for (var j = 0; j < layer.children[i].children.length; j++) {
                layer.children[i].children[j].rotate(1, layer.children[i].children[j].center);
            }
        }
    }
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