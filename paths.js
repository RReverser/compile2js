var source = 'sample.pas';

exports.src = source;

var extension = /\.\w*$/;

exports.dest = {
	src: source,
	path: './out/',
	code: source.replace(extension, '.js'),
	map: source.replace(extension, '.js.map'),
	ast: source.replace(extension, '.json')
};
