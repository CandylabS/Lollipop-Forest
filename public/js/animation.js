function onFrame(event) {
    // Rotate the group by 1 degree from
    // the centerpoint of the view:
    if (layer.hasChildren()) {
        for (var i = 0; i < layer.children.length; i++) {
            for (var j = 0; j < layer.children[i].children.length; j++) {
                layer.children[i].children[j].rotate(angularPerFrame(i, j), layer.children[i].center);	// layer.children.[i].children[j].center;
            }
        }
    }
}

function angularPerFrame(_i, _j) {
	var playback = layer.children[_i].data.playback;
	var orientation = layer.children[_i].data.orientation;
	var speed = layer.children[_i].data.speed;
	return playback * orientation * speed;
}

// initiation
function lollipopInit(_lollipopContainer) {
	_lollipopContainer.data = {
			playback: 1,
			speed: 	1,
			orientation: 1
	}
}

function dotContainerInit(_dotContainer) {
	_dotContainer.data = {
		rod: -90
	}
}

function setPlayback(_lollipopContainer) {
	_lollipopContainer.data.playback = 1 - _lollipopContainer.data.playback;
}