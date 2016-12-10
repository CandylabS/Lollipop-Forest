var menu = new Group();
var panel = new Path.Rectangle({
	topLeft: view.center - 300,
	bottomRight: view.center + 300,
	radius: 10,
	fillColor: 'White',
	opacity: 0.5
});
panel.seleted = false;
var close = new Path.Circle({
	center: view.center - 285,
	radius: 5,
	fillColor: 'red'
});
menu.addChild(panel);
menu.addChild(close);
mGUI.addChild(menu);
mGUI.visible = false;

var steps;
// first step:
function selectInstrument() {
	var text = new PointText({
		point: view.center - new Point(0, 200),
		justification: 'center',
		content: 'Choose your instrument',
		fillColor: 'black',
		fontFamily: 'Courier New',
		fontWeight: 'bold',
		fontSize: 18
	});
	var button = new Path.Rectangle({
		topLeft: view.center + new Point(-50, 220),
		bottomRight: view.center + new Point(50, 260),
		radius: 5,
		fillColor: '#ECE9E6'
	});
	button.onClick = function(){
		selectScale();
	}
	var mStep = new Group();
	mStep.addChild(text);
	mStep.addChild(button);
	steps.push(mStep);
	menu.addChild(steps[0]);
}

function selectScale() {
	var text = new PointText({
		point: view.center - new Point(0, 200),
		justification: 'center',
		content: 'Choose your scale',
		fillColor: 'black',
		fontFamily: 'Courier New',
		fontWeight: 'bold',
		fontSize: 18
	});
	var button = new Path.Rectangle({
		topLeft: view.center + new Point(-50, 220),
		bottomRight: view.center + new Point(50, 260),
		radius: 5,
		fillColor: '#ECE9E6'
	});
	button.onClick = function(){
		selectBPM();
	}
	var mStep = new Group();
	mStep.addChild(text);
	mStep.addChild(button);
	steps.push(mStep);
	menu.lastChild.remove();
	menu.addChild(steps[1]);
}

function selectBPM() {
	var text = new PointText({
		point: view.center - new Point(0, 200),
		justification: 'center',
		content: 'Choose your BPM',
		fillColor: 'black',
		fontFamily: 'Courier New',
		fontWeight: 'bold',
		fontSize: 18
	});
	var mStep = new Group();
	mStep.addChild(text);
	// mStep.addChild(button);
	steps.push(mStep);
	menu.lastChild.remove();
	menu.addChild(steps[2]);
}

function showGUI() {
	mGUI.visible = true;
	mGUI.bringToFront();
	steps = [];
	selectInstrument();
}

close.onMouseDown = function() {
	menu.lastChild.remove();
	mGUI.visible = false;
	mGUI.sendToBack();
}