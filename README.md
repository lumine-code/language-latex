# language-latex

LaTeX language support.

## Features

- **Grammars**: provides a Tree-sitter grammar built from [tree-sitter-latex](https://github.com/latex-lsp/tree-sitter-latex).
- **Syntax highlighting**: commands, environments, math, sections, citations, labels and more.
- **Code folding**: folds sections, environments, equations and comments.
- **Auto-indentation**: indents inside environments and brace groups.
- **Symbol navigation**: sections, labels and command definitions.
- **Log grammar**: the central `language-log` package highlights LaTeX engine diagnostics and common warning levels.
- **Snippets**: 166 snippets for common LaTeX constructs (environments, sections, math, etc.).

## Installation

To install `language-latex` search for it in the Install pane of the Lumine settings, or run the command `lumine --install lumine-code/language-latex`.

## Usage

This package handles LaTeX and TeX source files. The central `language-log` package supplies the `text.log.latex` grammar for compiler logs.

## Services

- `hyperlink.injection`: consumed to detect hyperlinks inside LaTeX comments.
- `todo.injection`: consumed to highlight TODO-style keywords inside LaTeX comments.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
