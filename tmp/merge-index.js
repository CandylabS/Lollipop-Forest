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
var circle;


// // global color
// var mColor = {
//     hue: 360 * Math.random(),
//     saturation: 1,
//     brightness: 1,
//     alpha: 0.1
// }

// Global TOOL
// var draw = new Tool();
// var edit = new Tool();

// // draw lollipop outline
// draw.onMouseDrag = function(event) {
//     outline = new Path.Circle({
//         center: event.downPoint,
//         radius: (event.downPoint - event.point).length,
//         fillColor: mColor
//     });
//     var group = new Group();
//     // Remove this path on the next drag event:
//     outline.removeOnDrag();
//     group.removeOnDrag();
//     group.addChild(outline);
//     layer.addChild(group);
//     console.log("group has children: " + group.children.length);
//     console.log("layer has children: " + layer.children.length);
// }

// // change color on next lollipop
// draw.onMouseDown = function(event) {
//     mColor.hue = 360 * Math.random();
// }

// // add circle and remove circle
// draw.onKeyDown = function(event) {
//     if (event.key == '=') {
//         // Scale the path by 110%:
//         circle = layer.lastChild.lastChild.clone();
//         circle.scale(0.8);
//         layer.lastChild.addChild(circle);
//         console.log("layer has children: " + layer.children.length);
//         // Prevent the key event from bubbling
//         return false;
//     }
//     if (event.key == '-') {
//         if (layer.lastChild.children.length <= 1) {
//             layer.lastChild.remove();
//         } else {
//             layer.lastChild.removeChildren(layer.lastChild.children.length - 1);
//         }
//         console.log("layer has children: " + layer.children.length);
//         return false;
//     }
//     if (event.key == 'enter') {
//         tool2.activate();
//     }
//     if (event.key == 'space') {
//         layer.removeChildren(layer.children.length - 1);
//     }
// }


// tool2 path editing
// var hitOptions = {
//     segments: true,
//     stroke: true,
//     fill: true,
//     tolerance: 5
// };
// var segment, path, hitResult;

// edit.onMouseDown = function(event) {
//     segment = path = null;
//     hitResult = project.hitTest(event.point, hitOptions);

//     // if (event.modifiers.shift) {
//     //     if (hitResult.type == 'segment') {
//     //         hitResult.segment.remove();
//     //     };
//     //     return;
//     // }

//     if (hitResult) {
//         path = hitResult.item;
//         if (hitResult.type == 'segment') {
//             segment = hitResult.segment;
//         } else if (hitResult.type == 'stroke') {
//             var location = hitResult.location;
//             segment = path.insert(location.index + 1, event.point);
//             path.smooth();
//         }
//         hitResult.item.bringToFront();
//     }
// }


// edit.onMouseMove = function(event) {
//     hitResult = project.hitTest(event.point, hitOptions);
//     project.activeLayer.selected = false;
//     ** FOR LATER USE ONLY **
//     // This is for dragging event
//     if (hitResult && hitResult.item)
//         hitResult.item.selected = true;
// }

// edit.onMouseDrag = function(event) {
//     if (segment) {
//         segment.point += event.delta;
//         path.smooth();
//     } else if (path) {
//         path.position += event.delta;
//     }
// }

// // add circle and remove circle
// edit.onKeyDown = function(event) {
//     if (event.key == 'space') {
//         tool.activate();
//     }
//     if (event.key == '=') {
//         if (hitResult) {
//             circle = hitResult.item.parent.lastChild.clone();
//             circle.scale(0.8);
//             hitResult.item.parent.addChild(circle);
//         }
//     }
//     if (event.key == '-') {
//         if (hitResult) {
//             if (hitResult.item.parent.children.length <= 1) {
//                 hitResult.item.parent.remove();
//             } else {
//                 hitResult.item.parent.removeChildren(layer.lastChild.children.length - 1);
//             }
//         }
//     }
// };

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
    var group = new Group();
    // Remove this path on the next drag event:
    circle.removeOnDrag();
    group.removeOnDrag();
    group.addChild(circle);
    layer.addChild(group);
    console.log("group has children: " + group.children.length);
    console.log("layer has children: " + layer.children.length);
}

// change color on next lollipop
draw.onMouseDown = function(event) {
    mColor.hue = 360 * Math.random();
}

// add circle and remove circle
draw.onKeyDown = function(event) {
    if (event.key == '=') {
        // Scale the path by 110%:
        circle = layer.lastChild.lastChild.clone();
        circle.scale(0.8);
        layer.lastChild.addChild(circle);
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
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};
var segment, path, hitResult;

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
        if (hitResult.type == 'segment') {
            segment = hitResult.segment;
        } else if (hitResult.type == 'stroke') {
            var location = hitResult.location;
            segment = path.insert(location.index + 1, event.point);
            path.smooth();
        }
        hitResult.item.bringToFront();
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
            circle = hitResult.item.parent.lastChild.clone();
            circle.scale(0.8);
            hitResult.item.parent.addChild(circle);
        }
    }
    if (event.key == '-') {
        if (hitResult) {
            if (hitResult.item.parent.children.length <= 1) {
                hitResult.item.parent.remove();
            } else {
                hitResult.item.parent.removeChildren(layer.lastChild.children.length - 1);
            }
        }
    }
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/dot.js
 * ===========================================================================================
 */

// Class for dots
var _dot = new Path.Circle({
    center: new Point(0, 0),
    radius: 5,
    fillColor: 'white',
    strokeColor: 'black'
});
// Create a symbol definition from the path:
var dot = new SymbolDefinition(_dot);

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