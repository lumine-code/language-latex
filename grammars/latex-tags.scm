; Sections
(chapter
  text: (curly_group
    (_) @name)) @definition.section

(part
  text: (curly_group
    (_) @name)) @definition.section

(section
  text: (curly_group
    (_) @name)) @definition.section

(subsection
  text: (curly_group
    (_) @name)) @definition.section

(subsubsection
  text: (curly_group
    (_) @name)) @definition.section

(paragraph
  text: (curly_group
    (_) @name)) @definition.section

(subparagraph
  text: (curly_group
    (_) @name)) @definition.section

; Labels
(label_definition
  name: (curly_group_label
    (_) @name)) @definition.label

; Environments
(environment_definition
  name: (curly_group_text
    (_) @name)) @definition.environment

; Command definitions
(new_command_definition
  command: _ @name) @definition.function

(old_command_definition
  command: _ @name) @definition.function

; Title
(title_declaration
  text: (curly_group
    (_) @name)) @definition.section
