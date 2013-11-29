var options = require('./options'),
	Parser = require('jison').Parser,
	path = require('path'),
	fs = require('fs'),
	SourceNode = require('source-map').SourceNode;

function read(path) {
	return fs.readFileSync(path, {encoding: 'utf-8'});
}

function write(path, text) {
	fs.writeFileSync(path, String(text), {encoding: 'utf-8'});
}

// converting syntax to parser code
write(
	'syntax.js',
	new Parser(read('syntax.jison'), {debug: options.debug}).generate()
);

// and using it since Jison doesn't use JS code directly from .jison syntax
var ast =
	require('./syntax')
	.parse(read(options.input))
	.prepend([
		'var VM = (function (VM) {\n',
		read('VM.js'),
		'return VM;\n',
		'})({});\n'
	])
;

if (options.ast) {
	write(options.ast, JSON.stringify(ast, null, '\t'));
}

if (options.sourceMap) {
	ast.add('//# sourceMappingURL=' + options.relative('output', 'sourceMap'));

	var generated = ast.toStringWithSourceMap({
		file: options.relative('sourceMap', 'output')
	});

	write(options.output, generated.code);
	write(options.sourceMap, generated.map);
} else {
	write(options.output, ast);
}

if (options.runner) {
	write(options.runner, '<script src="' + options.relative('runner', 'output') + '"></script>');
}
