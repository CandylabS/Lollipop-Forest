exports.install = function(){
	F.route('/', viewTheme);
	F.route('/paper/', viewPaper);
	// F.redirect('/', 'paper/examples/Paperjs.org/SatieLikedToDraw.html');
	F.map('/custom/', '~/public/js/')
}

function viewTheme(){
	var self = this;
	self.theme(self.query.theme || 'light');
	self.title('Lollipop Forest');
	this.view('index');
}

function viewPaper(){
	this.view('paper');
}