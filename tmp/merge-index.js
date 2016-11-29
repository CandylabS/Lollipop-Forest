/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/global.js
 * ===========================================================================================
 */

// lollipop prototype
// HIERARCHY
// Layer(active): current editing lollipop
// Group: circle of lollipop, one lollipop can have several groups
// Dots: basic symbol

// a layer for lollipop
var layer = new Layer();
// var lollipopContainer = new Group();
// var dotContainer = new Group();
var circle;

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/create-lollipop.js
 * ===========================================================================================
 */

var draw = new Tool();

// global color
var mColor = {
    hue: 360 * Math.random(),
    saturation: 1,
    brightness: 1,
    alpha: 0.1
}

// draw lollipop outline
draw.onMouseDrag = function(event) {
    circle = new Path.Circle({
        center: event.downPoint,
        radius: (event.downPoint - event.point).length,
        fillColor: mColor
    });
    var lollipopContainer = new Group();
    var dotContainer = new Group();
    // Remove this path on the next drag event:
    circle.removeOnDrag();
    // dotContainer.removeOnDrag();
    // lollipopContainer.removeOnDrag();
    dotContainer.addChild(circle);
    lollipopContainer.addChild(dotContainer);
    layer.addChild(lollipopContainer);
    console.log(dotContainer.firstChild);
    console.log("dot has children: " + dotContainer.children.length);
    // console.log("lollipop has children: " + lollipopContainer.children.length);
    // console.log("layer has children: " + layer.children.length);
}

// change color on next lollipop
draw.onMouseDown = function(event) {
    mColor.hue = 360 * Math.random();
}

// add circle and remove circle
draw.onKeyDown = function(event) {
    if (event.key == '=') {
        // Scale the path by 110%:
        var lollipopContainer = layer.lastChild;
        circle = lollipopContainer.lastChild.firstChild.clone();
        circle.scale(0.8);
        var dotContainer = new Group();
        dotContainer.addChild(circle);
        lollipopContainer.addChild(dotContainer);
        console.log("layer has children: " + layer.children.length);
        // Prevent the key event from bubbling
        return false;
    }
    if (event.key == '-') {
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

var edit = new Tool();

// edit tool path editing
var hitOptions = {
    segments: false,
    stroke: true,
    fill: true,
    tolerance: 5
};
var segment, path, hitResult;

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
}
// Class for dots
var _dot = new Path.Circle({
    center: new Point(0, 0),
    radius: 5,
    fillColor: 'white',
    strokeColor: 'black'
});
// Create a symbol definition from the path:
var dot = new SymbolDefinition(_dot);

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
            path.parent.addChild(mDot);
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
            circle = hitResult.item.parent.parent.lastChild.firstChild.clone();
            circle.scale(0.8);
            var dotContainer = new Group();
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
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/dot.js
 * ===========================================================================================
 */

// function onMouseDown(event) {
//     // Create a new circle shaped path at the position
//     // of the mouse:
//     var path = new Path.Circle(event.point, 5);
//     path.fillColor = 'black';

//     // Add the path to the group's children list:
//     group.addChild(path);
// };

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/rod.js
 * ===========================================================================================
 */

;

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/sampler.js
 * ===========================================================================================
 */

;