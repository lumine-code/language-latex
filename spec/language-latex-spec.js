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
    editor.setText("This is pdfTeX, Version 3.141592653\nOverfull \\hbox (1.0pt too wide)\n");
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

  it("highlights specialized counter commands", async () => {
    const editor = await lumine.workspace.open("document.tex");
    const commands = [
      "\\newcounter{example}[chapter]",
      "\\counterwithin*{figure}{chapter}",
      "\\counterwithout{figure}{chapter}",
      "\\value{figure}",
      "\\setcounter{secnumdepth}{4}",
      "\\addtocounter{section}{1}",
      "\\stepcounter{section}",
      "\\arabic{section}",
    ];
    editor.setText(commands.join("\n"));
    await editor.getBuffer().getLanguageMode().ready;

    for (let row = 0; row < commands.length; row++) {
      const scopes = editor.scopeDescriptorForBufferPosition([row, 1]).getScopesArray();
      expect(scopes).toContain("support.function.latex");
    }

    expect(editor.scopeDescriptorForBufferPosition([0, 12]).getScopesArray()).toContain(
      "variable.other.counter.latex",
    );
    expect(editor.scopeDescriptorForBufferPosition([0, 21]).getScopesArray()).toContain(
      "variable.other.counter.latex",
    );
    expect(editor.scopeDescriptorForBufferPosition([4, 25]).getScopesArray()).toContain(
      "constant.numeric.latex",
    );
  });

  it("highlights the remaining parser-specific commands", async () => {
    const editor = await lumine.workspace.open("document.tex");
    const cases = [
      {
        text: "\\definecolorset{rgb}{prefix}{suffix}{red,1,0,0}",
        nodeType: "color_set_definition",
        scope: "keyword.control.definition.latex",
      },
      { text: "\\todo{fix}", nodeType: "todo", scope: "support.function.latex" },
      { text: "\\FXtodo[inline]{fix}", nodeType: "todo", scope: "support.function.latex" },
      {
        text: "\\replaced{new}{old}",
        nodeType: "changes_replaced",
        scope: "support.function.latex",
      },
      {
        text: "\\item* Starred item",
        nodeType: "enum_item",
        scope: "punctuation.special.item.latex",
      },
    ];
    editor.setText(cases.map(({ text }) => text).join("\n"));
    const languageMode = editor.getBuffer().getLanguageMode();
    await languageMode.ready;

    for (let row = 0; row < cases.length; row++) {
      const { nodeType, scope } = cases[row];
      expect(languageMode.tree.rootNode.descendantsOfType(nodeType).length).toBeGreaterThan(0);
      expect(editor.scopeDescriptorForBufferPosition([row, 1]).getScopesArray()).toContain(scope);
    }
  });

  it("highlights raw environments and minted language names", async () => {
    const editor = await lumine.workspace.open("document.tex");
    editor.setText(
      [
        "\\begin{verbatim}",
        "raw { text }",
        "\\end{verbatim}",
        "\\begin{lstlisting}",
        "const value = 1;",
        "\\end{lstlisting}",
        "\\begin{minted}{python}",
        'print("value")',
        "\\end{minted}",
      ].join("\n"),
    );
    await editor.getBuffer().getLanguageMode().ready;

    for (const row of [1, 4, 7]) {
      expect(editor.scopeDescriptorForBufferPosition([row, 1]).getScopesArray()).toContain(
        "markup.raw.block.latex",
      );
    }
    expect(editor.scopeDescriptorForBufferPosition([6, 16]).getScopesArray()).toContain(
      "storage.modifier.language.python.latex",
    );
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
