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
}