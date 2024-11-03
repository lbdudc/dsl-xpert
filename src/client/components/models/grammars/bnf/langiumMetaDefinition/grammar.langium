// This is the grammar definition of the BNF language
// It is used to define the grammar of the language itself
// It is not used in the project, but for generating the parser and the language server

grammar Bnf

entry Model:
    (rules+=Rule)*;

Rule:
    name=ID WS? '::=' WS? alternatives+=Alternative (WS? WS? alternatives+=Alternative)* EOL?;

Alternative:
    (WS? '|'? WS? elements+=Element)+ SPECIAL_CHAR?;

Element:
    // Reference also can include < and > characters
    terminal=STRING | terminal=NUMBER | terminal=CHAR | group=Group | reference=ID | optional=OptionalGroup | special=SPECIAL_CHAR;

Group:
    // Group can be either a sequence of elements or a single element, separated by a | character
    '(' WS? elements+=Element+ (WS? '|'? WS? elements+=Element+)* WS? ')';

OptionalGroup:
    // They can have a "-" character between the elements
    // for example [a-z]
    '[' WS? elements+=Element+ (WS? '-' WS? elements+=Element+)* WS? ']';

terminal STRING: '"' ('\\' . | !('\\' | '"'))* '"';
terminal NUMBER: ('0'..'9')+;
terminal CHAR: ('a'..'z' | 'A'..'Z' | '0'..'9' | '_');
terminal ID: ('<') ('a'..'z' | 'A'..'Z' | '_') ('a'..'z' | 'A'..'Z' | '0'..'9' | '_')* ('>');
terminal WS: (' ' | '\t' | '\r')+;
terminal SPECIAL_CHAR: '*' | '+' | '?';
terminal EOL: '\r'? '\n';