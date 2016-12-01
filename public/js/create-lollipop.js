// draw lollipop outline
draw.onMouseDrag = function(event) {
    circle = new Path.Circle({
        center: event.downPoint,
        radius: (event.downPoint - event.point).length,
        fillColor: mColor
    });
    mDotContainer = new Group();
    mLollipopContainer = new Group();
    // Remove this path on the next drag event:
    circle.removeOnDrag();
    mLollipopContainer.removeOnDrag();
    // wrap containers up
    mDotContainer.addChild(circle);
    mLollipopContainer.addChild(mDotContainer);
    lollipopInit(mLollipopContainer);
    dotContainerInit(mDotContainer);
    layer.addChild(mLollipopContainer);
    // console.log("dot has children: " + mDotContainer.children.length);
    // console.log("lollipop has children: " + mLollipopContainer.children.length);
    // console.log("layer has children: " + layer.children.length);
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
        circle = mLollipopContainer.lastChild.firstChild.clone();
        circle.scale(0.8);
        mDotContainer = new Group();
        mDotContainer.addChild(circle);
        mLollipopContainer.addChild(mDotContainer);
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
}