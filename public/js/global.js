// lollipop prototype

/********** HIERARCHY *********/
// <layer>
// 	<lollipopContainer>
// 		<dotContainer>
// 			<dot></dot>
// 		</dotContainer>
// 	</lollipopContainer>
// </layer>
var mLayer = new Layer();
var mForest = new Group();
var mBands = new Group();
mLayer.addChild(mForest);
mLayer.addChild(mBands);
var mLollipopContainer, mDotContainer;
/*
_lollipopContainer.data = {
	playback: [0, 1],
	speed: 	[1x, 2x, 3x],
	orientation: [1, -1],
    octave: [2, 3, 4, 5, 6],
    key: 	[C, F, G, A],
    chord: 	[1, 3, 5],
    instrument: ['piano']
};
_dotContainer.data = {
    rod : 0,
    audioBuffer: 'sound.wav',
    reverb: 'room.wav',
    delay: 2s,
    echo: 6s,
    synth: true/false,
    ...
};
*/
var circle, mRod;
var _dot = new Path.Circle({
    center: new Point(0, 0),
    radius: 5,
    fillColor: 'white',
    strokeColor: 'black',
    strokeWidth: 0.5
}); // Class for dots, presets
var dot = new SymbolDefinition(_dot); // Create a symbol definition from the path

/*********** MODE **********/
var MODE = 0;
var drawState = false;

/*********** GLOBAL VARIABLES *************/
// global mouseEvent tools
var draw = new Tool(); //create-lollipop.js
var edit = new Tool(); // edit-lollipop.js

// global color
var mColor = {
    hue: 360 * Math.random(),
    saturation: 0.5,
    brightness: 1,
    alpha: 0.3
}

// octave band
bandsInit(3);
        // var band = new Shape.Rectangle({
        //     point: [0, view.size.height / 3 * 1],
        //     size: [view.size.width, view.size.height / 3],
        //     dashArray: [10, 10],
        //     strokeColor: 'black'
        // });

function bandsInit(num) {
    for (var i = 0; i < num; i++) {
        band = new Shape.Rectangle({
            point: [0, view.size.height / num * i],
            size: [view.size.width, view.size.height / num],
            dashArray: [10, 10],
            strokeColor: 'black'
        });
        mBands.addChild(band);
    }
}


/********** edit-lollipop.js **********/
// edit tool path editing
var hitOptions = {
    segments: false,
    stroke: true,
    fill: true,
    tolerance: 5
};
var segment, path, hitResult;