%{
	var b = require('ast-types').builders,
		paths = require('./paths');

	function at(node, loc) {
		node.loc = b.sourceLocation(
			b.position(loc.first_line, loc.first_column),
			b.position(loc.last_line, loc.last_column),
			paths.src
		);
		return node;
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
		return b.program($$.body);
	}
	;

stmts
	: stmt* -> b.blockStatement($$)
	;

stmt
	: e ';' -> at(b.expressionStatement($$), @$)
	;

id
	: ID -> b.identifier($$)
	;

e
	: id
	;
