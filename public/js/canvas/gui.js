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
var rootSelector = new Path.Circle({
	center: view.center,
	radius: 10,
	fillColor: 'red',
	visible: false
});
var reverbSelector = new Path.Rectangle({
	topLeft: view.center + new Point(-22, -22),
	bottomRight: view.center + new Point(42, 22),
	radius: 5,
	strokeColor: 'red',
	strokeWidth: 3,
	visible: false
});
menu.addChildren([panel, close, keySelector, rootSelector, reverbSelector]);
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
	var drum = createInstrumentButton('drum', '#ECE9E6', view.center + new Point(0, -120));
	mStep.addChildren(drum);
	// piano
	var piano = createInstrumentButton('piano', '#ECE9E6', view.center + new Point(0, -20));
	mStep.addChildren(piano);
	// other
	var other = createInstrumentButton('other', '#ECE9E6', view.center + new Point(0, 80));
	mStep.addChildren(other);
	// menu old
	if (isNew) {
		var next = createNextButton('next', '#ECE9E6', view.center + new Point(0, 240), 0);
		mStep.addChildren(next);
	}
	// show current menu
	steps.push(mStep);
	keySelector.visible = false;
	rootSelector.visible = false;
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
	var middleText = text.clone();
	middleText.content = 'and starting note';
	middleText.point = view.center + new Point(0, 50);
	mStep.addChild(middleText);
	var roots = [];
	var scaleNum = 7;
	for (var i = 0; i < scaleNum; i++) {
		roots.push(createRootButton(i, view.center + new Point(-120 + i * 40, 120)));
		mStep.addChild(roots[i]);
	}
	// show current menu2
	steps.push(mStep);
	reverbSelector.visible = false;
	menu.lastChild.remove();
	menu.addChild(steps[1]);
}

function selectBPM() {
	text = new PointText({
		point: view.center - new Point(0, 200),
		justification: 'center',
		content: 'Drag to adjust volume',
		fillColor: 'black',
		fontFamily: 'Courier New',
		fontWeight: 'bold',
		fontSize: 18
	});
	var mStep = new Group();
	mStep.addChild(text);
	var scaling = mLollipopContainer.data.gain * 1.5 + 0.3;
	var volume = new Path.Circle({
		center: view.center + new Point((scaling - 1) * 200, -100),
		radius: 30 * scaling,
		fillColor: '#cbe86b',
		alpha: 0.7
	});
	// Install a drag event handler that moves the path along.
	volume.onMouseDrag = function(event) {
		volume.position.x += event.delta.x;
		if (volume.position.x > (view.center.x + 120)) volume.position.x = view.center.x + 120;
		if (volume.position.x < (view.center.x - 120)) volume.position.x = view.center.x - 120;
		volume.scale(1 / scaling); // 0.4~1.6, -0.6 + 0.6
		scaling = 1 + (volume.position.x - view.center.x) / 200;
		volume.scale(scaling);
	}
	volume.onMouseUp = function(event) {
		mLollipopContainer.data.gain = (scaling - 0.3) / 1.5;
	}
	mStep.addChild(volume);
	text = new PointText({
		point: view.center + new Point(0, 50),
		justification: 'center',
		content: 'Choose Reverb',
		fillColor: 'black',
		fontFamily: 'Courier New',
		fontWeight: 'bold',
		fontSize: 18
	});
	mStep.addChild(text);
	// reverb
	var reverbs = [];
	reverbs.push(createReverbButton('None', -1, view.center + new Point(-180, 120)));
	reverbs.push(createReverbButton('Dry', 0, view.center + new Point(-60, 120)));
	reverbs.push(createReverbButton('Hall', 1, view.center + new Point(60, 120)));
	reverbs.push(createReverbButton('Space', 2, view.center + new Point(180, 120)));
	for (var i = 0; i < reverbs.length; i++) mStep.addChildren(reverbs[i]);
	// old menu
	if (!isNew) {
		var next = createNextButton('next', '#ECE9E6', view.center + new Point(0, 240), 0);
		mStep.addChildren(next);
	}

	steps.push(mStep);
	keySelector.visible = false;
	rootSelector.visible = false;
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
	closeGUI();
}

var closeGUI = function() {
	menu.lastChild.remove();
	mGUI.visible = false;
	mGUI.sendToBack();
}

var updateInstrument = function(_ins) {
	_item = mLollipopContainer;
	if (_ins == 'drum') {
		_item.data.instrument = 'drum';
		mColor.hue = 28;
		mColor.brightness = 0.2;
	} else if (_ins == 'piano') {
		_item.data.instrument = 'piano';
		mColor.hue = 1;
		mColor.brightness = 0.98;
	} else {
		_item.data.instrument = 'other';
		mColor.hue = 255;
		mColor.brightness = 0.5;
	}
	for (var i = 1; i < _item.children.length; i++)
		_item.children[i].lastChild.lastChild.fillColor = mColor;
	// mColor.saturation = 0.2;
}

var updateRoot = function(_root) { // name 
	_item = mLollipopContainer;
	switch (_root) {
		case 'C':
			mColor.hue = 1;
			break;
		case 'C#':
			mColor.hue = 10;
			break;
		case 'D':
			mColor.hue = 28;
			break;
		case 'E':
			mColor.hue = 50;
			break;
		case 'F':
			mColor.hue = 88;
			break;
		case 'F#':
			mColor.hue = 100;
			break;
		case 'G':
			mColor.hue = 200;
			break;
		case 'A':
			mColor.hue = 330;
			break;
		case 'A#':
			mColor.hue = 300;
			break;
		case 'B':
			mColor.hue = 240;
			break;
		default:
			mColor.hue = 52;
	};
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

function createRootButton(_index, _center) {
	var _button = new Path.Circle({
		center: _center,
		radius: 6,
		fillColor: 'black',
	});
	var _text = text.clone();
	_text.content = _index;
	_text.point = _center + new Point(0, -15);
	_text.visible = false;
	_button.onMouseEnter = function() {
		var keyArray = findKey(mLollipopContainer.data.key);
		_text.content = keyArray[_index];
		_text.visible = true;
	}
	_button.onMouseLeave = function() {
		_text.visible = false;
	}
	if (mLollipopContainer.data.root == _index) {
		rootSelector.position = _center;
		rootSelector.visible = true;
	}
	_button.onClick = function() {
		rootSelector.position = _center;
		mLollipopContainer.data.root = _index;
		var keyArray = findKey(mLollipopContainer.data.key);
		updateRoot(keyArray[_index]);
	}
	return _button;
}

function createReverbButton(_name, _index, _center) {
	var _button = new Path.Rectangle({
		topLeft: _center + new Point(-30, -20),
		bottomRight: _center + new Point(30, 20),
		radius: 5,
		strokeColor: '#ECE9E6',
		strokeWidth: 2
	});
	_button.data.index = _index;
	var _text = text.clone();
	_text.content = _name;
	_text.point = _center + new Point(0, 5);
	if (mLollipopContainer.data.reverb == _index) {
		reverbSelector.position = _center;
		reverbSelector.visible = true;
	}
	_text.onClick = function() {
		reverbSelector.position = _center;
		mLollipopContainer.data.reverb = _button.data.index;
	}
	return [_button, _text];
}