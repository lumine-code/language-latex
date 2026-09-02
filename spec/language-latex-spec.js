describe("language-latex", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-latex");
    await lumine.packages.activatePackage("language-log");
  });

  it("loads the LaTeX grammars", () => {
    const grammars = lumine.grammars
      .getGrammars()
      .filter((grammar) => grammar.scopeName === "text.tex.latex");
    const types = grammars.map((grammar) => grammar.constructor.name).sort();
    expect(grammars.length).toBe(1);
    expect(types).toContain("TreeSitterGrammar");
  });

  it("loads the companion grammars", () => {
    for (const scopeName of ["text.log.latex"]) {
      const grammar = lumine.grammars.grammarForScopeName(scopeName);
      expect(grammar).toBeTruthy();
    }
  });

  it("uses Tree-sitter for LaTeX logs", async () => {
    const editor = await lumine.workspace.open("document.log");
    editor.setText("This is pdfTeX, Version 3.141592653\nWarning: overfull box\n");
    lumine.grammars.autoAssignLanguageMode(editor.getBuffer());
    await editor.languageMode.ready;

    expect(editor.getGrammar().scopeName).toBe("text.log.latex");
    expect(editor.getGrammar().type).toBe("tree-sitter");
    expect(editor.scopeDescriptorForBufferPosition([1, 2]).getScopesArray()).toContain(
      "invalid.deprecated.log.latex",
    );
  });

  it("selects a LaTeX grammar for .tex files", () => {
    const grammar = lumine.grammars.selectGrammar("document.tex", "");
    expect(grammar.scopeName).toBe("text.tex.latex");
  });

  it("uses the tree-sitter grammar in an editor", async () => {
    const editor = await lumine.workspace.open("document.tex");
    editor.setText("\\documentclass{article}\n\\begin{document}\nHello\n\\end{document}\n");
    const languageMode = editor.getBuffer().getLanguageMode();
    expect(languageMode.grammar.scopeName).toBe("text.tex.latex");
    if (languageMode.ready) {
      await languageMode.ready;
      const scopes = editor.scopeDescriptorForBufferPosition([0, 1]).getScopesArray();
      expect(scopes[0]).toBe("text.tex.latex");
    }
  });

  // The per-grammar settings live in the `grammar` namespace; under the
  // legacy `editor` one nothing reads them.
  describe("scoped settings", () => {
    it("soft wraps LaTeX documents", async () => {
      const editor = await lumine.workspace.open("document.tex");
      expect(editor.getGrammar().scopeName).toBe("text.tex.latex");
      expect(editor.isSoftWrapped()).toBe(true);
    });

    it("comments a line with a percent sign", async () => {
      const editor = await lumine.workspace.open("document.tex");
      editor.setText("\\section{Intro}");
      editor.toggleLineCommentsForBufferRows(0, 0);
      expect(editor.lineTextForBufferRow(0)).toBe("% \\section{Intro}");
    });

    it("offers the environment completions", () => {
      const completions = lumine.config.get("editor.completions", {
        scope: [".text.tex.latex"],
      });
      expect(completions).toContain("itemize");
    });
  });
});
