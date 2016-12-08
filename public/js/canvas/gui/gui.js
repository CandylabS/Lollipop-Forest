var panel = new Path.Rectangle({
 	topLeft: view.center - 300,
    bottomRight: view.center + 300,
    radius: 10,
    fillColor: 'White',
    opacity: 0.5
});
panel.seleted = false;
var close = new Path.Circle({
	center: view.center -285,
	radius: 5,
	fillColor: 'red'
});
mGUI.addChild(panel);
mGUI.addChild(close);
mGUI.visible = false;

close.onMouseDown = function(){
	mGUI.visible = false;
	mGUI.sendToBack();
}