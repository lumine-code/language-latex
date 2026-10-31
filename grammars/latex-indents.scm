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
