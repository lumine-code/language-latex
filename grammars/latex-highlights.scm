; COMMANDS
; ========

(command_name) @support.function.latex

(caption
  command: _ @support.function.latex)

; Text mode commands: \text, \intertext, \shortintertext, etc.
(text_mode
  command: _ @support.function.latex)

(todo
  command: _ @support.function.latex)

(changes_replaced
  command: _ @support.function.latex)

; Counter commands have literal command nodes instead of `command_name` nodes.
(counter_declaration
  command: _ @support.function.latex)

(counter_within_declaration
  command: _ @support.function.latex)

(counter_without_declaration
  command: _ @support.function.latex)

(counter_value
  command: _ @support.function.latex)

(counter_definition
  command: _ @support.function.latex)

(counter_addition
  command: _ @support.function.latex)

(counter_increment
  command: _ @support.function.latex)

(counter_typesetting
  command: _ @support.function.latex)

; VARIABLES & PARAMETERS
; ======================

(placeholder) @variable.other.placeholder.latex

(key_value_pair
  key: (_) @variable.parameter.latex
  value: (_))

(curly_group_spec
  (text) @variable.parameter.latex)

(brack_group_argc) @variable.parameter.latex

(curly_group_word
  (word) @variable.other.counter.latex)

(brack_group_word
  (word) @variable.other.counter.latex)

(curly_group_value
  (value_literal) @constant.numeric.latex)

; OPERATORS
; =========

[
  (operator)
  "="
  "_"
  "^"
] @keyword.operator.latex

(enum_item
  command: _ @punctuation.special.item.latex)

; DELIMITERS
; ==========

(delimiter) @punctuation.delimiter.latex

(math_delimiter
  left_command: _ @punctuation.definition.math.begin.latex
  left_delimiter: _ @punctuation.definition.math.begin.latex
  right_command: _ @punctuation.definition.math.end.latex
  right_delimiter: _ @punctuation.definition.math.end.latex)

[
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket.latex

; ENVIRONMENTS
; ============

(begin
  command: _ @keyword.control.environment.latex
  name: (curly_group_text
    (text) @entity.name.type.environment.latex))

(end
  command: _ @keyword.control.environment.latex
  name: (curly_group_text
    (text) @entity.name.type.environment.latex))

; DEFINITIONS
; ===========

(new_command_definition
  command: _ @keyword.control.definition.latex)

(old_command_definition
  command: _ @keyword.control.definition.latex)

(let_command_definition
  command: _ @keyword.control.definition.latex)

(environment_definition
  command: _ @keyword.control.definition.latex
  name: (curly_group_text
    (_) @entity.name.type.environment.latex))

(theorem_definition
  command: _ @keyword.control.definition.latex
  name: (curly_group_text_list
    (_) @entity.name.type.environment.latex))

(paired_delimiter_definition
  command: _ @keyword.control.definition.latex
  declaration: (curly_group_command_name
    (_) @entity.name.function.latex))

; LABELS & REFERENCES
; ====================

(label_definition
  command: _ @keyword.control.reference.latex
  name: (curly_group_label
    (_) @markup.underline.link.label.latex))

(label_reference_range
  command: _ @keyword.control.reference.latex
  from: (curly_group_label
    (_) @markup.underline.link.label.latex)
  to: (curly_group_label
    (_) @markup.underline.link.label.latex))

(label_reference
  command: _ @keyword.control.reference.latex
  names: (curly_group_label_list
    (_) @markup.underline.link.label.latex))

(label_number
  command: _ @keyword.control.reference.latex
  name: (curly_group_label
    (_) @markup.underline.link.label.latex)
  number: (_) @markup.underline.link.label.latex)

(citation
  command: _ @keyword.control.citation.latex
  keys: (curly_group_text_list) @markup.underline.link.citation.latex)

(hyperlink
  command: _ @support.function.latex
  uri: (curly_group_uri
    (_) @markup.underline.link.url.latex))

; GLOSSARY & ACRONYMS
; ====================

(glossary_entry_definition
  command: _ @keyword.control.definition.latex
  name: (curly_group_text
    (_) @markup.underline.link.glossary.latex))

(glossary_entry_reference
  command: _ @keyword.control.reference.latex
  name: (curly_group_text
    (_) @markup.underline.link.glossary.latex))

(acronym_definition
  command: _ @keyword.control.definition.latex
  name: (curly_group_text
    (_) @markup.underline.link.acronym.latex))

(acronym_reference
  command: _ @keyword.control.reference.latex
  name: (curly_group_text
    (_) @markup.underline.link.acronym.latex))

; COLORS
; ======

(color_definition
  command: _ @keyword.control.definition.latex
  name: (curly_group_text
    (_) @constant.other.color.latex))

(color_set_definition
  command: _ @keyword.control.definition.latex)

(color_reference
  command: _ @support.function.latex
  name: (curly_group_text
    (_) @constant.other.color.latex)?)

; SECTIONING
; ==========

(title_declaration
  command: _ @keyword.control.section.latex
  options: (brack_group
    (_) @markup.heading.title.latex)?
  text: (curly_group
    (_) @markup.heading.title.latex))

(author_declaration
  command: _ @keyword.control.section.latex
  authors: (curly_group_author_list
    (author)+ @markup.heading.author.latex))

(chapter
  command: _ @keyword.control.section.latex
  toc: (brack_group
    (_) @markup.heading.chapter.latex)?
  text: (curly_group
    (_) @markup.heading.chapter.latex))

(part
  command: _ @keyword.control.section.latex
  toc: (brack_group
    (_) @markup.heading.part.latex)?
  text: (curly_group
    (_) @markup.heading.part.latex))

(section
  command: _ @keyword.control.section.latex
  toc: (brack_group
    (_) @markup.heading.section.latex)?
  text: (curly_group
    (_) @markup.heading.section.latex))

(subsection
  command: _ @keyword.control.section.latex
  toc: (brack_group
    (_) @markup.heading.subsection.latex)?
  text: (curly_group
    (_) @markup.heading.subsection.latex))

(subsubsection
  command: _ @keyword.control.section.latex
  toc: (brack_group
    (_) @markup.heading.subsubsection.latex)?
  text: (curly_group
    (_) @markup.heading.subsubsection.latex))

(paragraph
  command: _ @keyword.control.section.latex
  toc: (brack_group
    (_) @markup.heading.paragraph.latex)?
  text: (curly_group
    (_) @markup.heading.paragraph.latex))

(subparagraph
  command: _ @keyword.control.section.latex
  toc: (brack_group
    (_) @markup.heading.subparagraph.latex)?
  text: (curly_group
    (_) @markup.heading.subparagraph.latex))

; BEAMER FRAMES
; =============

(generic_environment
  (begin
    name: (curly_group_text
      (text) @_IGNORE_.env_name)
    (#eq? @_IGNORE_.env_name "frame"))
  .
  (curly_group
    (_) @markup.heading.frame.latex))

((generic_command
  command: (command_name) @_IGNORE_.name
  arg: (curly_group
    (_) @markup.heading.frame.latex))
  (#eq? @_IGNORE_.name "\\frametitle"))

; TEXT FORMATTING
; ===============

((generic_command
  command: (command_name) @_IGNORE_.name
  arg: (curly_group
    (_) @markup.italic.latex))
  (#match? @_IGNORE_.name "^\\\\(emph|textit|mathit)$"))

((generic_command
  command: (command_name) @_IGNORE_.name
  arg: (curly_group
    (_) @markup.bold.latex))
  (#match? @_IGNORE_.name "^\\\\(textbf|mathbf)$"))

; CONDITIONALS
; =============

((generic_command
  (command_name) @keyword.control.conditional.latex)
  (#match? @keyword.control.conditional.latex "^\\\\if"))

((generic_command
  (command_name) @keyword.control.conditional.latex)
  (#match? @keyword.control.conditional.latex "^\\\\(fi|else)$"))

; FILE INCLUSION
; ==============

(class_include
  command: _ @keyword.control.import.latex
  path: (curly_group_path) @string.other.path.latex)

(package_include
  command: _ @keyword.control.import.latex
  paths: (curly_group_path_list) @string.other.path.latex)

(latex_include
  command: _ @keyword.control.import.latex
  path: (curly_group_path) @string.other.path.latex)

(verbatim_include
  command: _ @keyword.control.import.latex
  path: (curly_group_path) @string.other.path.latex)

(import_include
  command: _ @keyword.control.import.latex
  directory: (curly_group_path) @string.other.path.latex
  file: (curly_group_path) @string.other.path.latex)

(bibstyle_include
  command: _ @keyword.control.import.latex
  path: (curly_group_path) @string.other.path.latex)

(bibtex_include
  command: _ @keyword.control.import.latex
  paths: (curly_group_path_list) @string.other.path.latex)

(biblatex_include
  "\\addbibresource" @keyword.control.import.latex
  glob: (curly_group_glob_pattern) @string.regexp.latex)

(graphics_include
  command: _ @keyword.control.import.latex
  path: (curly_group_path) @string.other.path.latex)

(svg_include
  command: _ @keyword.control.import.latex
  path: (curly_group_path) @string.other.path.latex)

(inkscape_include
  command: _ @keyword.control.import.latex
  path: (curly_group_path) @string.other.path.latex)

(tikz_library_import
  command: _ @keyword.control.import.latex
  paths: (curly_group_path_list) @string.other.path.latex)

; RAW CONTENT
; ===========

(source_code) @markup.raw.block.latex

(verbatim_environment
  verbatim: (comment) @markup.raw.block.latex)

(minted_environment
  begin: (begin
    language: (curly_group_text
      (text) @storage.modifier.language._TEXT_.latex)))

; MATH
; ====

[
  (displayed_equation)
  (inline_formula)
] @markup.raw.math.latex

(math_environment
  (_) @markup.raw.math.latex)

; COMMENTS
; ========

[
  (line_comment)
  (block_comment)
  (comment_environment)
] @comment.line.percentage.latex

((line_comment) @keyword.control.directive.latex
  (#match? @keyword.control.directive.latex "^%% !TeX"))

((line_comment) @keyword.control.directive.latex
  (#match? @keyword.control.directive.latex "^%%&"))
