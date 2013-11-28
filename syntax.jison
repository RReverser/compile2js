%{
	var types = require('ast-types'),
		b = types.builders,
		paths = require('./paths');

	types.defineMethod('at', function (loc) {
		this.loc = b.sourceLocation(
			b.position(loc.first_line, loc.first_column),
			b.position(loc.last_line, loc.last_column),
			paths.src
		);
		return this;
	});
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
		return b.program($$).at(@$);
	}
	;

stmts
	: stmt*
	;

stmt
	: e ';' -> b.expressionStatement($$).at(@$)
	;

id
	: ID -> b.identifier($$).at(@$)
	;

e
	: id
	;
