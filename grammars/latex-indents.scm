; An exact \verb command followed by text whose opening delimiter has not
; reappeared still quotes the immediately following brace. Trailing prose
; need not equal the opener's text, and later real groups keep their hints.
(source_file
  (generic_command command: (command_name) @_verb)
  . (text) @_delimiter
  . (ERROR ["{" "[" "}" "]"] @_IGNORE_)
  (#match? @_verb "^\\\\verb\\*?$")
  (#match? @_delimiter "^([^\\s])(?:(?!\\1)[^\\r\\n])*$")
  (#is? test.first)
  (#set! capture.final true))

; The same inline sequence can be flattened inside an unfinished environment.
(ERROR
  (generic_command command: (command_name) @_verb)
  . (text) @_delimiter
  . ["{" "[" "}" "]"] @_IGNORE_
  (#match? @_verb "^\\\\verb\\*?$")
  (#match? @_delimiter "^([^\\s])(?:(?!\\1)[^\\r\\n])*$")
  (#is? test.typeAt "previousSibling text")
  (#set! capture.final true))

; Preserve the exact contents of multiline literals during explicit reindent.
([(verbatim_environment) (comment) (block_comment)] @preserve
  (#is? indent.reindent true)
  (#is-not? indent.matchesCurrentRow startPosition)
  (#set! indent.force true))

; Capture the command tokens rather than their whole name groups, so the
; braces in \begin{...} and \end{...} balance normally on the same row.
(begin "\\begin" @indent)
(end "\\end" @dedent)

["{" "["] @indent
["}" "]"] @dedent
