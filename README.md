# language-latex

LaTeX language support with tree-sitter and TextMate grammars.

## Features

- **Grammars**: provides both Tree-sitter and TextMate grammars, built from [tree-sitter-latex](https://github.com/latex-lsp/tree-sitter-latex).
- **Syntax highlighting**: commands, environments, math, sections, citations, labels and more.
- **Code folding**: folds sections, environments, equations and comments.
- **Auto-indentation**: indents inside environments and brace groups.
- **Symbol navigation**: sections, labels and command definitions.
- **Companion grammars**: TextMate grammars for TeX, Beamer, Memoir and LaTeX log files.
- **Snippets**: 166 snippets for common LaTeX constructs (environments, sections, math, etc.).

## Installation

To install `language-latex` search for _language-latex_ in the Install pane of the Lumine settings or run `lumine --install lumine-code/language-latex`.

## Usage

The Tree-sitter grammar is based on [tree-sitter-latex](https://github.com/latex-lsp/tree-sitter-latex) and is used by default. The TextMate grammars are derived from the [TextMate LaTeX bundle](https://github.com/textmate/latex.tmbundle) and cover:

- LaTeX (`text.tex.latex`)
- TeX (`text.tex`)
- Beamer (`text.tex.latex.beamer`)
- Memoir (`text.tex.latex.memoir`)
- LaTeX log (`text.log.latex`)

## Services

- **hyperlink.injection** (`^1.0.0`): consumed to detect hyperlinks inside LaTeX comments.
- **todo.injection** (`^1.0.0`): consumed to highlight TODO-style keywords inside LaTeX comments.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
