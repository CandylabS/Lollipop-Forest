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

            if (!tripleParent(hitResult.item).data.zoomed) {
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
                            if (event.point.isClose(divisionGroup.children[i].position, path.bounds.width / 10)) {
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
            } else {
                tripleParent(hitResult.item).data.mute = !tripleParent(hitResult.item).data.mute;
                if (tripleParent(hitResult.item).data.mute) {
                    var mask = hitResult.item.clone();
                    mask.fillColor = 'white';
                    mask.opacity = 0.5;
                    mask.removeOnDown();
                }
            }

        } else if (path.name == 'dot') {
            // remove dots
            path.parent.data.dotNum -= 1;
            doubleParent(path).data.dotNum -= 1;
            console.log("dotRemain: " + doubleParent(path).data.dotNum);
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
    if (!mGUI.visible) {
        mBands.visible = true;
        mBands.sendToBack();
    }
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
        setPan(tripleParent(path));
        console.log("octave: " + tripleParent(path).data.octave);
        console.log("pan: " + tripleParent(path).data.pan);
        if (mDot) mDot.visible = true;
    }
}

// add circle and remove circle
edit.onKeyDown = function(event) {
    if (event.key == 'enter') {
        draw.activate();
    }
    //test key
    if (event.key == 'o') {
        console.log("init rotation " + metaBall.data.delta);
    }
    if (hitResult && hitResult.item.name == 'circle') {
        if (event.key == 'backspace') {
            deleteAll();
        }
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
        // speed up
        if (event.key == 'a') {
            var speed = tripleParent(hitResult.item).data.speed + 0.1;
            setSpeed(tripleParent(hitResult.item), speed);
        }
        // speed down
        if (event.key == 'z') {
            var speed = tripleParent(hitResult.item).data.speed - 0.1;
            setSpeed(tripleParent(hitResult.item), speed);
        }
        // zoom in/out
        if (event.key == 'control') {
            if (tripleParent(hitResult.item).data.zoomed) {
                tripleParent(hitResult.item).scale(2);
                tripleParent(hitResult.item).data.zoomed = false;
            } else {
                tripleParent(hitResult.item).scale(0.5);
                tripleParent(hitResult.item).data.zoomed = true;
            }
        }
        // meta ball sync
        if (Key.isDown('b')) {
            if (!meta) {
                generateMeta(hitResult.item.position);
                console.log("metaBall!");
            }
            meta = !meta;
        }
        // show menu
        if (Key.isDown('m')) {
            mLollipopContainer = tripleParent(hitResult.item);
            showGUI(false);
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
        if (event.key == 'a') {
            forestSpeed += 0.1;
            for (var i = 0; i < mForest.children.length; i++) {
                setSpeed(mForest.children[i], forestSpeed)
            }
        }
        if (event.key == 'z') {
            forestSpeed -= 0.1;
            for (var i = 0; i < mForest.children.length; i++) {
                setSpeed(mForest.children[i], forestSpeed)
            }
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