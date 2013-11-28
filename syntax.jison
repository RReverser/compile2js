%{
	var paths = require('./paths'),
		SourceNode = require('source-map').SourceNode,
		val = JSON.stringify;

	function js(chunk, location, name) {
		return new SourceNode(
			location && location.first_line,
			location && location.first_column,
			paths.src,
			chunk,
			name && String(name === true ? chunk : name)
		);
	}
%}

%lex

%%
\s+							/* skip whitespace */
[A-Za-z_]\w+				return 'ID';
';'							return yytext;
<<EOF>>						return 'EOF';

/lex

%left ';'

%start program

%ebnf

%%

program
	: stmts EOF {
		return js(['RESULT = "";', $$], @$);
	}
	;

stmts
	: stmt*
	;

stmt
	: e ';' -> js(['RESULT=', $1, js(';\n', @2)], @$)
	;

id
	: ID -> js(val($$), @$, $$)
	;

e
	: id
	;
