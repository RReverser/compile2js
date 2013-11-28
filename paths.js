var fs = require('fs'),
	path = require('path'),
	extension = /\.\w*$/,
	pathSep = /\\/g,
	outPath = './out/';

var paths = module.exports = {
	src: '',

	syntax: './syntax.jison',
	parser: './syntax.js',
	VM: './VM.js',
	
	dest: {
		get path() { return outPath },
		set path(newPath) { outPath = './' + path.relative(process.cwd(), newPath) + '/' },

		get src() { return path.relative(this.path, paths.src).replace(pathSep, '/') },
		get VM() { return path.relative(this.path, paths.VM).replace(pathSep, '/') },
		
		get code() { return this.path + path.basename(paths.src).replace(extension, '.js') },
		get map() { return this.code + '.map' },
		get ast() { return this.code + 'on' },
		get html() { return this.path + 'index.html' }
	},

	readSync: function (type) {
		return fs.readFileSync(this[type], {encoding: 'utf-8'});
	},
	writeSync: function (type, text) {
		return fs.writeFileSync(this[type], text, {encoding: 'utf-8'});
	},
	getBaseName: function (type) {
		return path.basename(this[type]);
	}
};

['readSync', 'writeSync', 'getBaseName'].forEach(function (methodName) {
	this.dest[methodName] = this[methodName];
}, paths);
