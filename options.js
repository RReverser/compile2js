var program =
	require('commander')
	.version(require('./package.json').version)
	.option('-i, --input <source>', 'specify input file')
	.option('-o, --output <js>', 'specify output file (default: <input>.js)')
	.option('-a, --ast [json]', 'save AST (default path: <output>.json)')
	.option('-m, --source-map [map]', 'generate source map (default path: <output>.js.map)')
	.option('-r, --runner [html]', 'generate HTML runner (default path: <output>.html)')
	.option('-d, --debug', 'output debug information')
	.parse(process.argv)
;

if (!('input' in program)) {
	program.help();
}

exports.input = program.input;

var output = program.output ? program.output.replace(/\.js$/, '') : program.input;

exports.output = output + '.js';

function optionalOutput(option, defValue) {
	var value = program[option];
	if (value) {
		exports[option] = typeof value === 'string' ? program[option] : defValue;
	}
}

optionalOutput('ast', output + '.json');
optionalOutput('sourceMap', exports.output + '.map');
optionalOutput('runner', output + '.html');

exports.debug = !!program.debug;

var path = require('path'),
	pathSep = /\\/g;

exports.relative = function (fromType, toType) {
	return path.relative(this[fromType] + '/..', this[toType]).replace(pathSep, '/')
};