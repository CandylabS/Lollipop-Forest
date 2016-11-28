// lollipop prototype
// HIERARCHY
// Layer(active): current editing lollipop
// Group: circle of lollipop, one lollipop can have several groups
// Dots: basic symbol
var index;
// a layer for lollipop
var layer = new Layer();

// Class for dots
var _dot = new Path.Circle({
	center: new Point(0, 0),
	radius: 5,
	fillColor: 'white',
	strokeColor: 'black'
});
// Create a symbol definition from the path:
var dot = new SymbolDefinition(_dot);


// TOOLs
var tool = new Tool();
var tool2 = new Tool();
var outline;

// draw lollipop outline
tool.onMouseDrag = function(event) {
	outline = new Path.Circle({
		center: event.downPoint,
		radius: (event.downPoint - event.point).length,
		fillColor: 'white'
			// strokeColor: 'black'
	});
	// Remove this path on the next drag event:
	outline.removeOnDrag();
	layer.addChild(outline);
	console.log("children: " + layer.children.length);
}

// adjust lollipop outline size
tool.onKeyDown = function(event) {
	if (event.key == '=') {
		// Scale the path by 110%:
		layer.lastChild.scale(1.1);

		// Prevent the key event from bubbling
		return false;
	}
	if (event.key == '-') {
		layer.lastChild.scale(0.9);
		return false;
	}
	if (event.key == 'enter') {
		tool2.activate();
	}
}

tool2.onKeyDown = function(event) {
	if (event.key == 'space') {
		tool.activate();
	}
}

// tool2.onMouseDrag = function(event) {
// 	layer.lastChild.position += event.delta;
// }
var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};
var segment, path;

tool2.onMouseDown = function(event) {
    segment = path = null;
    var hitResult = project.hitTest(event.point, hitOptions);

    if (event.modifiers.shift) {
        if (hitResult.type == 'segment') {
            hitResult.segment.remove();
        };
        return;
    }

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

tool2.onMouseMove = function(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
    project.activeLayer.selected = false;
    if (hitResult && hitResult.item)
        hitResult.item.selected = true;
}

tool2.onMouseDrag = function(event) {
    if (segment) {
        segment.point += event.delta;
        path.smooth();
    } else if (path) {
        path.position += event.delta;
    }
}


