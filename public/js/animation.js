function onFrame(event) {
    // Rotate the group by 1 degree from
    // the centerpoint of the view:
    if (layer.hasChildren()) {
        for (var i = 0; i < layer.children.length; i++) {
            for (var j = 0; j < layer.children[i].children.length; j++) {
                layer.children[i].children[j].rotate(angularPerFrame(), layer.children[i].children[j].center);
            }
        }
    }
}

function angularPerFrame() {
	return playback * orientation * speed;
}