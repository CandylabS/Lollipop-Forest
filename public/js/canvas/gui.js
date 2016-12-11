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
	text = new PointText({
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
	var drum = createButton('drum', '#d6ecfa', view.center + new Point(0, -120));
	drum[0].onClick = function() { updateInstrument(_item, 'drum'); }
	drum[1].onClick = function() { updateInstrument(_item, 'drum'); }
	mStep.addChildren(drum);
	// piano
	var piano = createButton('piano', '#feee7d', view.center + new Point(0, -20));
	piano[0].onClick = function() { updateInstrument(_item, 'piano'); }
	piano[1].onClick = function() { updateInstrument(_item, 'piano'); }
	mStep.addChildren(piano);
	// other
	var other = createButton('other', '#BDB7D1', view.center + new Point(0, 80));
	other[0].onClick = function() { updateInstrument(_item, 'other'); }
	other[1].onClick = function() { updateInstrument(_item, 'other'); }
	mStep.addChildren(other);
	// menu old
	if (_isNew) {
		var next = createButton('next', '#ECE9E6', view.center + new Point(0, 240));
		next[0].onClick = function() { selectScale(_item, _isNew); }
		next[1].onClick = function() { selectScale(_item, _isNew); }
		mStep.addChildren(next);
	}
	// show current menu
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

function createButton(_name, _color, _center) {
	var _button = new Path.Rectangle({
		topLeft: _center + new Point(-50, -20),
		bottomRight: _center + new Point(50, 20),
		radius: 5,
		fillColor: _color
	});
	var _text = text.clone();
	_text.content = _name;
	_text.point = _button.position + new Point(0, 5);
	return [_button, _text];
}