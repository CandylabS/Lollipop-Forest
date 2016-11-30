// lollipop prototype

/********** HIERARCHY *********/
// <layer>
// 	<lollipopContainer>
// 		<dotContainer>
// 			<dot></dot>
// 		</dotContainer>
// 	</lollipopContainer>
// </layer>
var layer = new Layer();
var lollipopContainer, dotContainer;
var circle;
var _dot = new Path.Circle({
    center: new Point(0, 0),
    radius: 5,
    fillColor: 'white',
    strokeColor: 'black'
});	// Class for dots, presets
var dot = new SymbolDefinition(_dot);	// Create a symbol definition from the path

/*********** GLOBAL VARIABLES *************/
// global mouseEvent tools
var draw = new Tool();	//create-lollipop.js
var edit = new Tool();	// edit-lollipop.js

// global color
var mColor = {
    hue: 360 * Math.random(),
    saturation: 1,
    brightness: 1,
    alpha: 0.1
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