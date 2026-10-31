describe("Conservative latex indentation", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-latex");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("text.tex.latex"));
    editor.update({ tabLength: 4, softTabs: true });
    await editor.whenGrammarSettled();
  });

  afterEach(() => editor?.destroy());

  for (const [name, source, row, columns] of [
    ["a complete environment", "\\begin{itemize}\\end{itemize}", 0, 0],
    ["an environment header", "\\begin{itemize}\n\\end{itemize}", 0, 4],
    ["a braced command", "\\textbf{Hello}", 0, 0],
    ["an open braced group", "\\textbf{\n}", 0, 4],
    ["a comment", "% \\begin{itemize} {", 0, 0],
  ]) {
    it(`keeps the intended level after ${name}`, async () => {
      editor.setText(source);
      await editor.whenGrammarSettled();
      editor.setCursorBufferPosition([row, Infinity]);
      editor.insertText("\n", { autoIndent: true, autoIndentNewline: true });
      await editor.whenGrammarSettled();
      expect(editor.lineTextForBufferRow(row + 1)).toBe(" ".repeat(columns));
      expect(editor.getCursorBufferPosition().column).toBe(columns);
    });
  }

  it("dedents a closing delimiter only when it is typed at the start of a row", async () => {
    editor.setText("\\textbf{" + "\n    ");
    await editor.whenGrammarSettled();
    editor.setCursorBufferPosition([1, Infinity]);
    editor.insertText("}", { autoIndent: true, autoDecreaseIndent: true });
    await editor.whenGrammarSettled();
    expect(editor.lineTextForBufferRow(1)).toBe("}");
  });

  it("preserves multiline literal contents during explicit reindent", async () => {
    const source = "\\begin{verbatim}\n\tkeep this tab\n  keep these spaces\n\\end{verbatim}\n";
    editor.setText(source);
    await editor.whenGrammarSettled();
    editor.getBuffer().clearUndoStack();
    editor.autoIndentBufferRows(0, editor.getLastBufferRow() - 1);
    await editor.whenGrammarSettled();
    expect(editor.getText()).toBe(source);
    editor.autoIndentBufferRows(0, editor.getLastBufferRow() - 1);
    expect(editor.getText()).toBe(source);
  });
});
