compile2js
==========

This is bootstrap package for easy extending to own compilers from any language to JavaScript, inspired by [article in Mozilla blog](https://hacks.mozilla.org/2013/05/compiling-to-javascript-and-debugging-with-source-maps/).

It uses [Jison](http://zaach.github.io/jison/) as parser and Mozilla's [source-map](https://github.com/mozilla/source-map) library for generating JavaScript code with source map. Earlier used [ast-types](https://github.com/benjamn/ast-types) + [escodegen](https://github.com/Constellation/escodegen) but those were more efficient for manipulating existing JavaScript AST and not that much for generating completely new code.

Inside
------
This bootstrap consists of:
* [package.json](https://github.com/RReverser/compile2js/blob/master/package.json) - obviously, basic npm manifest with needed modules.
* [syntax.jison](https://github.com/RReverser/compile2js/blob/master/syntax.jison) - syntax of your language in Jison format with minimal needed helpers for building JS source nodes.
* [VM.js](https://github.com/RReverser/compile2js/blob/master/VM.js) - "virtual machine" object for initialization logic and methods or properties that can be used by generated code; in most cases you will need such object for simplicity of actual generated code.
* [sample.txt](https://github.com/RReverser/compile2js/blob/master/sample.txt) - sample input file for compiler.
* [options.js](https://github.com/RReverser/compile2js/blob/master/options.js) - command line option handler, it can be used "as is" in almost any child project but you can add own options if needed here.
* [index.js](https://github.com/RReverser/compile2js/blob/master/index.js) - actually compiler runner; currently it generates parser from .jison syntax on each execution, and for better performance it's recommended to disable this in release when your syntax is completely defined.

Syntax
------
[Sample "language"](https://github.com/RReverser/compile2js/blob/master/syntax.jison) skips any whitespaces and parses identifiers splitted by semicolon from [input file](https://github.com/RReverser/compile2js/blob/master/sample.txt) and converts those to string values being assigned to `VM.current` property.

Usage
-----
    compile2js> node .

      Usage: compile2js [options]

      Options:

        -h, --help              output usage information
        -V, --version           output the version number
        -i, --input <source>    specify input file
        -o, --output <js>       specify output file (default: <input>.js)
        -a, --ast [json]        save AST (default path: <output>.json)
        -m, --source-map [map]  generate source map (default path: <output>.js.map)
        -r, --runner [html]     generate HTML runner (default path: <output>.html)
        -d, --debug             output debug information