var source = 'sample.txt';

exports.src = source;

var extension = /\.\w*$/;

exports.dest = {
	src: source,
	path: './out/',
	code: source.replace(extension, '.js'),
	map: source.replace(extension, '.js.map'),
	ast: source.replace(extension, '.json'),
	html: 'index.html'
};
