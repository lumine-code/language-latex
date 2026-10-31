describe("Literal recovery in latex", () => {
  let editor;
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-latex");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("text.tex.latex"));
    editor.update({ tabLength: 4, softTabs: true });
    await editor.whenGrammarSettled();
  });
  afterEach(() => editor?.destroy());

  async function enterAfter(source, columns, row) {
    editor.setText(source);
    await editor.whenGrammarSettled();
    row ??= editor.getLastBufferRow();
    editor.setCursorBufferPosition([row, Infinity]);
    editor.insertText("\n", { autoIndent: true, autoIndentNewline: true });
    await editor.whenGrammarSettled();
    expect(editor.lineTextForBufferRow(row + 1))
      .withContext(source)
      .toBe(" ".repeat(columns));
    expect(editor.getCursorBufferPosition().column).withContext(source).toBe(columns);
  }

  for (const [source, columns] of [
    ["\\verb|{|", 0],
    ["\\verb*|{|", 0],
    ["\\verb+{+", 0],
    ["\\verb|{| is a brace.", 0],
    ["\\verb|text {|", 0],
    ["\\verb+text {+ trailing", 0],
    ["\\verb|text {| \\textbf{bold}", 0],
    ["\\begin{itemize}\n    \\verb|{|", 4],
    ["\\begin{itemize}\n    \\verb|text {| trailing", 4],
  ]) {
    it("keeps the literal margin for " + JSON.stringify(source), async () => {
      await enterAfter(source, columns);
    });
  }

  for (const source of [
    "\\verb|{| \\textbf{",
    "\\verb|{| is a brace. \\textbf{",
    "\\verb|text {| \\textbf{",
    "\\verb+text {+ trailing \\textbf{",
    "\\verb|text| {",
    "\\verb|text| \\textbf{",
    "\\begin{itemize}",
    "\\textbf{",
  ]) {
    it("still indents a real container in " + JSON.stringify(source), async () => {
      await enterAfter(source, 4);
    });
  }

  for (const literal of ["\\verb|{| is a brace.", "\\verb|text {|", "\\verb+text {+ trailing"]) {
    it("keeps a later real group inside an environment after " + literal, async () => {
      await enterAfter("\\begin{itemize}\n    " + literal + " \\textbf{", 8);
    });
    it(
      "keeps the literal margin before an existing environment close after " + literal,
      async () => {
        await enterAfter("\\begin{itemize}\n    " + literal + "\n\\end{itemize}", 4, 1);
      },
    );
  }
});
