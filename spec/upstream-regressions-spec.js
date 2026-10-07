describe("LaTeX upstream parser regressions", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-latex");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("text.tex.latex"));
  });

  afterEach(() => editor?.destroy());

  it("keeps underscores inside label definitions and references", async () => {
    editor.setText("\\label{sec_example}\n\\ref{sec_example}\n");
    expect(await editor.whenGrammarSettled()).toBe(true);
    const root = editor.getSyntaxNodeAtBufferPosition([0, 0], (node) => !node.parent);
    expect(root.hasError).toBe(false);
    expect(root.descendantsOfType("label").map((node) => node.text)).toEqual([
      "sec_example",
      "sec_example",
    ]);
  });
});
