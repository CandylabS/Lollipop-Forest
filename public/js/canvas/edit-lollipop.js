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
        if (event.key == 'a') {
            console.log("angle now:" + doubleParent(hitResult.item).data.rod);
        }
    }
}