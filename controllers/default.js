exports.install = function(){
	F.route('/');
	F.route('/paper/', viewPaper);
	// F.redirect('/', 'paper/examples/Paperjs.org/SatieLikedToDraw.html');
}

function viewPaper(){
	this.view('paper');
}