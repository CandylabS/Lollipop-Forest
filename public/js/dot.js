// Class for dots
var _dot = new Path.Circle({
    center: new Point(0, 0),
    radius: 5,
    fillColor: 'white',
    strokeColor: 'black'
});
// Create a symbol definition from the path:
var dot = new SymbolDefinition(_dot);