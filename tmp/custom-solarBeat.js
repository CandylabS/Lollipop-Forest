var group = new Group();

function onMouseDown(event) {
    // Create a new circle shaped path at the position
    // of the mouse:
    var path = new Path.Circle(event.point, 5);
    path.fillColor = 'black';

    // Add the path to the group's children list:
    group.addChild(path);
}

function onFrame(event) {
    // Rotate the group by 1 degree from
    // the centerpoint of the view:
    group.rotate(1, view.center);
}