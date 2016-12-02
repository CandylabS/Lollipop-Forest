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
        mForest.addChild(mLollipopContainer);
                // initialize
        lollipopInit(mLollipopContainer);
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
}