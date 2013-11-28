var fs = require('fs'),
	path = require('path'),
	extension = /\.\w*$/,
	outPath = './out/';

module.exports = {
	src: '',
	syntax: './syntax.jison',
	parser: './syntax.js',
	readSync: function (type) {
		return fs.readFileSync(this[type], {encoding: 'utf-8'});
	},
	writeSync: function (type, text) {
		if (typeof text === 'object') {
			text = JSON.stringify(text, null, '\t');
		}
		return fs.writeFileSync(this[type], text, {encoding: 'utf-8'});
	},
	getBaseName: function (type) {
		return path.basename(this[type]);
	},
	dest: {
		get path() { return outPath },
		set path(newPath) { outPath = './' + path.relative(process.cwd(), newPath) + '/' },
		get src() { return this.path + path.basename(module.exports.src) },
		get code() { return this.src.replace(extension, '.js') },
		get map() { return this.code + '.map' },
		get ast() { return this.src.replace(extension, '.json') },
		get html() { return this.path + 'index.html' }
	}
};

['readSync', 'writeSync', 'getBaseName'].forEach(function (methodName) {
	this.dest[methodName] = this[methodName];
}, module.exports);
