var Parser = require('jison').Parser,
	fs = require('fs'),
	escodegen = require('escodegen'),
	paths = require('./paths'),
	utf8 = {encoding: 'utf-8'},
	src = fs.readFileSync(paths.src, utf8),
	n = require('ast-types').namedTypes;

function output(name, text) {
	return fs.writeFileSync(paths.dest.path + paths.dest[name], text, utf8);
}

output('src', src);

// converting syntax to parser code
fs.writeFileSync(
	'syntax.js',
	new Parser(fs.readFileSync('syntax.jison', utf8), {debug: true}).generate(),
	utf8
);

// and using it since Jison doesn't use JS code directly from .jison syntax
var ast = require('./syntax').parse(src);

console.log(ast);

output('ast', JSON.stringify(ast, null, '\t'));

var generated = escodegen.generate(ast, {
	sourceMap: paths.src,
	sourceMapWithCode: true
});

output('code', generated.code + '\n//# sourceMappingURL=' + paths.dest.map);
output('map', generated.map);
output('html', '<script src="' + paths.dest.code + '"></script>');
