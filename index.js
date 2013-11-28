var program = require('commander'),
	Parser = require('jison').Parser,
	paths = require('./paths');

program
	.version(require('./package.json').version)
	.option('-i, --input <path>', 'specify input file')
	.option('-o, --output <path>', 'specify output path (default: "out")', 'out')
	.option('-a, --ast', 'save AST')
	.option('-m, --source-map', 'generate source map')
	.parse(process.argv);

if (!program.input) {
	program.help();
}

// settings paths from command-line options
paths.src = program.input;
paths.dest.path = program.output;

var src = paths.readSync('src');

// converting syntax to parser code
paths.writeSync(
	'parser',
	new Parser(paths.readSync('syntax'), {debug: true}).generate()
);

// and using it since Jison doesn't use JS code directly from .jison syntax
var ast = require(paths.parser).parse(src);

if (program.ast) {
	paths.dest.writeSync('ast', JSON.stringify(ast, null, '\t'));
}

if (program.sourceMap) {
	ast.add('//# sourceMappingURL=' + paths.dest.getBaseName('map'));

	var generated = ast.toStringWithSourceMap({
		file: paths.dest.getBaseName('code')
	});

	paths.dest.writeSync('code', generated.code);
	paths.dest.writeSync('map', generated.map);
} else {
	paths.dest.writeSync('code', ast.toString());
}

paths.dest.writeSync('html', '<script src="' + paths.dest.getBaseName('code') + '"></script>');
