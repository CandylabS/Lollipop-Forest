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
    // wrap containers up
    dotContainer.addChild(circle);
    lollipopContainer.addChild(dotContainer);
    layer.addChild(lollipopContainer);
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
}