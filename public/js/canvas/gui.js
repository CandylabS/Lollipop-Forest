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
function selectInstrument(_item, _isNew) {
	var text = new PointText({
		point: view.center - new Point(0, 200),
		justification: 'center',
		content: 'Choose your instrument',
		fillColor: 'black',
		fontFamily: 'Courier New',
		fontWeight: 'bold',
		fontSize: 18
	});
	var mStep = new Group();
	mStep.addChild(text);
	// drum
	var drum_button = new Path.Rectangle({
		topLeft: view.center + new Point(-50, -100),
		bottomRight: view.center + new Point(50, -140),
		radius: 5,
		fillColor: '#d6ecfa'
	});
	var drum_text = text.clone();
	drum_text.content = 'DRUM';
	drum_text.point = drum_button.position + new Point(0, 5);
	drum_button.onClick = function() {
		updateInstrument(_item, 'drum');
	}
	drum_text.onClick = function() {
		updateInstrument(_item, 'drum');
	}
	mStep.addChildren([drum_button, drum_text]);
	// piano
	var piano_button = new Path.Rectangle({
		topLeft: view.center + new Point(-50, -40),
		bottomRight: view.center + new Point(50, 0),
		radius: 5,
		fillColor: '#feee7d'
	});
	var piano_text = text.clone();
	piano_text.content = 'PIANO';
	piano_text.point = piano_button.position + new Point(0, 5);
	piano_button.onClick = function() {
		updateInstrument(_item, 'piano');
	}
	piano_text.onClick = function() {
		updateInstrument(_item, 'piano');
	}
	mStep.addChildren([piano_button, piano_text]);
	// other
	var other_button = new Path.Rectangle({
		topLeft: view.center + new Point(-50, 60),
		bottomRight: view.center + new Point(50, 100),
		radius: 5,
		fillColor: '#BDB7D1'
	});
	var other_text = text.clone();
	other_text.content = 'OTHER';
	other_text.point = other_button.position + new Point(0, 5);
	other_button.onClick = function() {
		updateInstrument(_item, 'other');
	}
	other_text.onClick = function() {
		updateInstrument(_item, 'other');
	}
	mStep.addChildren([other_button, other_text]);
	// menu old
	if (_isNew) {
		var button = new Path.Rectangle({
			topLeft: view.center + new Point(-50, 220),
			bottomRight: view.center + new Point(50, 260),
			radius: 5,
			fillColor: '#ECE9E6'
		});
		var next_text = text.clone();
		next_text.content = 'NEXT';
		next_text.point = button.position + new Point(0, 5);
		button.onClick = function() {
			selectScale(_item, _isNew);
		}
		next_text.onClick = function() {
			selectScale(_item, _isNew);
		}
		mStep.addChildren([button, next_text]);
	}
	steps.push(mStep);
	if (_isNew) menu.addChild(steps[0]);
	else {
		menu.lastChild.remove();
		menu.addChild(steps[2]);
	}
}

function selectScale(_item, _isNew) {
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
	// old menu
	if (_isNew) {
		button.onClick = function() {
			selectBPM(_item, _isNew);
		}
	} else {
		button.onClick = function() {
			selectInstrument(_item, _isNew);
		}
	}
	var mStep = new Group();
	mStep.addChild(text);
	mStep.addChild(button);
	steps.push(mStep);
	menu.lastChild.remove();
	menu.addChild(steps[1]);
}

function selectBPM(_item, _isNew) {
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
	// old menu

	if (!_isNew) {
		var button = new Path.Rectangle({
			topLeft: view.center + new Point(-50, 220),
			bottomRight: view.center + new Point(50, 260),
			radius: 5,
			fillColor: '#ECE9E6'
		});
		button.onClick = function() {
			selectScale(_item, _isNew);
		}
		mStep.addChild(button);
	}

	steps.push(mStep);

	if (_isNew) {
		menu.lastChild.remove();
		menu.addChild(steps[2]);
	} else menu.addChild(steps[0]);
}

function showGUI(_item, _isNew) {
	mGUI.visible = true;
	mGUI.bringToFront();
	steps = [];
	console.log(_item.data.instrument);
	if (_isNew) selectInstrument(_item, _isNew);
	else selectBPM(_item, _isNew);
}

close.onMouseDown = function() {
	menu.lastChild.remove();
	mGUI.visible = false;
	mGUI.sendToBack();
}

function updateInstrument(_item, _ins) {
	if (_ins == 'drum') {
		_item.data.instrument = 'drum';
		mColor.hue = 202;
		mColor.saturation = 0.2;
	} else if (_ins == 'piano') {
		_item.data.instrument = 'piano';
		mColor.hue = 52;
		mColor.saturation = 0.4;
	} else {
		_item.data.instrument = 'other';
		mColor.hue = 255;
		mColor.saturation = 0.2;
	}
	for (var i = 1; i < _item.children.length; i++)
		_item.children[i].lastChild.lastChild.fillColor = mColor;
	// mColor.saturation = 0.2;
}