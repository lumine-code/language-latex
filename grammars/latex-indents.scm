; Indent inside environments
(generic_environment
  (begin) @indent
  (#set! indent.matchIndentOf parent.startPosition))

(generic_environment
  (end) @dedent
  (#set! indent.matchIndentOf parent.startPosition))

; Indent inside math environments
(math_environment
  (begin) @indent
  (#set! indent.matchIndentOf parent.startPosition))

(math_environment
  (end) @dedent
  (#set! indent.matchIndentOf parent.startPosition))

; Indent inside curly groups
("{" @indent)
("}" @dedent)

; Indent inside bracket groups
("[" @indent)
("]" @dedent)
