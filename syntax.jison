%{
    var options = require('./options'),
        destSrc = options.relative('output', 'input'),
        SourceNode = require('source-map').SourceNode;

    function js(chunk, location, name) {
        return new SourceNode(
            location && location.first_line,
            location && location.first_column,
            location && destSrc,
            chunk,
            name
        );
    }

    function val(literal, location, name) {
        return js(JSON.stringify(literal), location, name);
    }
%}

%lex

%%
\s+                         /* skip whitespace */
[A-Za-z_]\w*                return 'ID';
';'                         return yytext;
<<EOF>>                     return 'EOF';

/lex

%left ';'

%start program

%ebnf

%%

program
    : stmts EOF {
        return js($$);
    }
    ;

stmts
    : stmt*
    ;

stmt
    : e ';' -> js(['VM.current=', $1, ';\n'], @$)
    ;

id
    : ID -> val($$, @$, $$)
    ;

e
    : id
    ;
