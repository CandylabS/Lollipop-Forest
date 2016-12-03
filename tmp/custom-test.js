   var circle = new Path.Circle({
        center: view.center,
        radius: 200,
        strokeColor: 'black'
    });

   var center = circle.position;

   var geometry = new Path.RegularPolygon(center, 3, 200);
   geometry.strokeColor = 'black';

   function onFrame(event) {
	// iterate each lollipop in the view
	geometry.rotate(1, view.center);
}