var path = new Path.Rectangle(new Point(30, 25), new Size(50, 50));
path.strokeColor = 'black';

var secondPath = path.clone();
var intersectionGroup = new Group();

function onFrame(event) {
    secondPath.rotate(1);

    var intersections = path.getIntersections(secondPath);
    intersectionGroup.removeChildren();

    for (var i = 0; i < intersections.length; i++) {
        var intersectionPath = new Path.Circle({
            center: intersections[i].point,
            radius: 4,
            fillColor: 'red',
            parent: intersectionGroup
        });
    }
}