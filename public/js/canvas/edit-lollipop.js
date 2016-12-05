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
            path.parent.data.dotNum -= 1;
            doubleParent(path).data.dotNum -= 1;
            if (doubleParent(hitResult.item).data.dotNum <= 0) {
                doubleParent(hitResult.item).firstChild.lastChild.remove(); // remove startpoint
                doubleParent(hitResult.item).data.dotNum = 0;
            }
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
            addCircle();
        }
        // remove circle
        if (event.key == '-') {
            removeCircle();
        }
        // stop playing
        if (event.key == 'space') {
            // playback: 1-play, 0-pause
            setPlayback(tripleParent(hitResult.item), 1 - tripleParent(hitResult.item).data.playback);
        }
        // reverse playing
        if (event.key == 'r') {
            setOrientation(tripleParent(hitResult.item));
        }
        if (event.key == 'o') {
            console.log("first dot rotation: " + doubleParent(hitResult.item).firstChild.rotation)
            console.log("init rotation " + tripleParent(hitResult.item).firstChild.lastChild.rotation);
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
    } else if (!hitResult) {
        if (event.key == 'space') {
            console.log('start or stop all');
            for (var i = 0; i < mForest.children.length; i++) {
                setPlayback(mForest.children[i], forestButton);
            }
            forestButton = 1 - forestButton;
        }
    }
}

// press shift to hide reference
edit.onKeyUp = function(event) {
    if (!Key.modifiers.shift) {
        if (hitResult) hitResult.item.selected = true;
        hideGeo();
    }
}