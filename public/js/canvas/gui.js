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
var keySelector = new Path.Rectangle({
	topLeft: view.center + new Point(-22, -22),
	bottomRight: view.center + new Point(22, 22),
	radius: 5,
	strokeColor: 'red',
	strokeWidth: 3,
	visible: false
});
menu.addChild(panel);
menu.addChild(close);
menu.addChild(keySelector);
mGUI.addChild(menu);
mGUI.visible = false;

var steps;
// first step:
function selectInstrument() {
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
	var drum = createInstrumentButton('drum', '#d6ecfa', view.center + new Point(0, -120));
	mStep.addChildren(drum);
	// piano
	var piano = createInstrumentButton('piano', '#feee7d', view.center + new Point(0, -20));
	mStep.addChildren(piano);
	// other
	var other = createInstrumentButton('other', '#BDB7D1', view.center + new Point(0, 80));
	mStep.addChildren(other);
	// menu old
	if (isNew) {
		var next = createNextButton('next', '#ECE9E6', view.center + new Point(0, 240), 0);
		mStep.addChildren(next);
	}
	// show current menu
	steps.push(mStep);
	keySelector.visible = false;
	if (isNew) menu.addChild(steps[0]);
	else {
		menu.lastChild.remove();
		menu.addChild(steps[2]);
	}
}

// second step
function selectScale() {
	text = new PointText({
		point: view.center - new Point(0, 200),
		justification: 'center',
		content: 'Choose your key',
		fillColor: 'black',
		fontFamily: 'Courier New',
		fontWeight: 'bold',
		fontSize: 18
	});
	var mStep = new Group();
	mStep.addChild(text);
	var next = createNextButton('next', '#ECE9E6', view.center + new Point(0, 240), 1);
	mStep.addChildren(next);
	// keys
	var keys = [];
	keys.push(createKeyButton('F', view.center + new Point(-120, -120)));
	keys.push(createKeyButton('Dm', view.center + new Point(-120, -60)));
	keys.push(createKeyButton('C', view.center + new Point(-40, -120)));
	keys.push(createKeyButton('Am', view.center + new Point(-40, -60)));
	keys.push(createKeyButton('G', view.center + new Point(40, -120)));
	keys.push(createKeyButton('Em', view.center + new Point(40, -60)));
	keys.push(createKeyButton('D', view.center + new Point(120, -120)));
	keys.push(createKeyButton('Bm', view.center + new Point(120, -60)));
	for (var i = 0; i < keys.length; i++) mStep.addChildren(keys[i]);
	// roots
	var roots = [];
	// show current menu2
	steps.push(mStep);
	menu.lastChild.remove();
	menu.addChild(steps[1]);
}

function selectBPM() {
	text = new PointText({
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

	if (!isNew) {
		var next = createNextButton('next', '#ECE9E6', view.center + new Point(0, 240), 0);
		mStep.addChildren(next);
	}

	steps.push(mStep);
	keySelector.visible = false;
	if (isNew) {
		menu.lastChild.remove();
		menu.addChild(steps[2]);
	} else menu.addChild(steps[0]);
}

function showGUI(_isNew) {
	mGUI.visible = true;
	mGUI.bringToFront();
	steps = [];
	isNew = _isNew;
	if (_isNew) selectInstrument();
	else selectBPM();
}

close.onMouseDown = function() {
	menu.lastChild.remove();
	mGUI.visible = false;
	mGUI.sendToBack();
}

var updateInstrument = function(_ins) {
	_item = mLollipopContainer;
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

function createInstrumentButton(_name, _color, _center) {
	var _button = new Path.Rectangle({
		topLeft: _center + new Point(-50, -20),
		bottomRight: _center + new Point(50, 20),
		radius: 5,
		fillColor: _color
	});
	var _text = text.clone();
	_text.content = _name;
	_text.point = _center + new Point(0, 5);
	_button.onClick = function() {
		updateInstrument(_name);
	}
	_text.onClick = function() {
		updateInstrument(_name);
	}
	return [_button, _text];
}

function createNextButton(_name, _color, _center, _id) {
	var _button = new Path.Rectangle({
		topLeft: _center + new Point(-50, -20),
		bottomRight: _center + new Point(50, 20),
		radius: 5,
		fillColor: _color
	});
	var _text = text.clone();
	_text.content = _name;
	_text.point = _center + new Point(0, 5);
	if (_id == 1) {
		if (isNew) {
			_button.onClick = function() {
				selectBPM();
			}
			_text.onClick = function() {
				selectBPM();
			}
		} else {
			_button.onClick = function() {
				selectInstrument();
			}
			_text.onClick = function() {
				selectInstrument();
			}
		}
	} else {
		_button.onClick = function() {
			selectScale();
		}
		_text.onClick = function() {
			selectScale();
		}
	}
	return [_button, _text];
}

function createKeyButton(_name, _center) {
	var _button = new Path.Rectangle({
		topLeft: _center + new Point(-20, -20),
		bottomRight: _center + new Point(20, 20),
		radius: 5,
		strokeColor: '#ECE9E6',
		strokeWidth: 2
	});
	var _text = text.clone();
	_text.content = _name;
	_text.point = _center + new Point(0, 5);
	if (mLollipopContainer.data.key == _name) {
		keySelector.position = _center;
		keySelector.visible = true;
	}
	_text.onClick = function() {
		keySelector.position = _center;
		mLollipopContainer.data.key = _text.content;
	}
	return [_button, _text];
}