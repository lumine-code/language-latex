describe("language-latex", () => {
  beforeEach(async () => {
    await atom.packages.activatePackage("language-latex");
  });

  it("loads the LaTeX grammars", () => {
    const grammars = atom.grammars
      .getGrammars({ includeTreeSitter: true })
      .filter((grammar) => grammar.scopeName === "text.tex.latex");
    const types = grammars.map((grammar) => grammar.constructor.name).sort();
    expect(grammars.length).toBe(2);
    expect(types).toContain("WASMTreeSitterGrammar");
  });

  it("loads the companion TextMate grammars", () => {
    for (const scopeName of [
      "text.tex",
      "text.bibtex",
      "text.tex.latex.beamer",
      "text.tex.latex.memoir",
      "text.log.latex",
    ]) {
      const grammar = atom.grammars.grammarForScopeName(scopeName);
      expect(grammar).toBeTruthy();
    }
  });

  it("selects a LaTeX grammar for .tex files", () => {
    const grammar = atom.grammars.selectGrammar("document.tex", "");
    expect(grammar.scopeName).toBe("text.tex.latex");
  });

  it("selects the BibTeX grammar for .bib files", () => {
    const grammar = atom.grammars.selectGrammar("references.bib", "");
    expect(grammar.scopeName).toBe("text.bibtex");
  });

  it("uses the tree-sitter grammar in an editor", async () => {
    const editor = await atom.workspace.open("document.tex");
    editor.setText("\\documentclass{article}\n\\begin{document}\nHello\n\\end{document}\n");
    const languageMode = editor.getBuffer().getLanguageMode();
    expect(languageMode.grammar.scopeName).toBe("text.tex.latex");
    if (languageMode.ready) {
      await languageMode.ready;
      const scopes = editor.scopeDescriptorForBufferPosition([0, 1]).getScopesArray();
      expect(scopes[0]).toBe("text.tex.latex");
    }
  });

  it("tokenizes BibTeX entries", () => {
    const grammar = atom.grammars.grammarForScopeName("text.bibtex");
    const { tokens } = grammar.tokenizeLine("@article{key,");
    const scopes = tokens.flatMap((token) => token.scopes);
    expect(scopes.some((scope) => scope.includes("bibtex"))).toBe(true);
  });
});
