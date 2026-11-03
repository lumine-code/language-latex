const path = require("path");

describe("LaTeX semantic argument delimiters", () => {
  let editor;

  beforeEach(async () => {
    jasmine.useRealClock();
    await lumine.packages.activatePackage(path.resolve(__dirname, ".."));
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("text.tex.latex"));
    editor.setSoftWrapped(false);
  });

  afterEach(() => editor?.destroy());

  function scopesAt(index) {
    const position = editor.getBuffer().positionForCharacterIndex(index);
    return editor.scopeDescriptorForBufferPosition(position).getScopesArray();
  }

  function styleHierarchy(scopes) {
    return scopes.filter((scope, index) => scope !== scopes[index - 1]);
  }

  function renderedScopes() {
    const result = [];
    const { displayLayer } = editor;
    for (let row = 0; row <= editor.getLastBufferRow(); row++) {
      const line = editor.screenLineForScreenRow(row);
      expect(line.lineText).toBe(editor.lineTextForBufferRow(row));
      const scopes = [];
      for (const tag of line.tags) {
        if (displayLayer.isOpenTag(tag)) {
          scopes.push(
            displayLayer
              .classNameForTag(tag)
              .split(" ")
              .map((className) => className.replace(/^syntax--/, ""))
              .join("."),
          );
        } else if (displayLayer.isCloseTag(tag)) {
          scopes.pop();
        } else if (tag > 0) {
          for (let index = 0; index < tag; index++) result.push(scopes.slice());
        }
      }
      if (row < editor.getLastBufferRow()) result.push(null);
    }
    return result;
  }

  async function expectArgumentContents(source, scope, contents) {
    editor.setText(source);
    expect(await editor.whenGrammarSettled())
      .withContext(source)
      .toBe(true);
    expect(editor.languageMode.tree.rootNode.hasError).withContext(source).toBe(false);

    const ranges = contents.map((content) => {
      const start = source.indexOf(content);
      expect(start)
        .withContext(content + " in " + source)
        .toBeGreaterThanOrEqual(0);
      return [start, start + content.length];
    });

    const rendered = renderedScopes();
    for (let index = 0; index < source.length; index++) {
      if (source[index] === "\n") continue;
      const scopes = scopesAt(index);
      expect(styleHierarchy(rendered[index]))
        .withContext(source + " rendered scopes at " + index)
        .toEqual(styleHierarchy(scopes));
      if (ranges.some(([start, end]) => index >= start && index < end)) {
        expect(scopes)
          .withContext(source + " at " + index)
          .toContain(scope);
        expect(rendered[index])
          .withContext(source + " rendered scopes at " + index)
          .toContain(scope);
      }
      if ("{}[]".includes(source[index])) {
        expect(scopes.at(-1))
          .withContext(source + " at " + index)
          .toBe("punctuation.bracket.latex");
        expect(rendered[index].at(-1))
          .withContext(source + " rendered scopes at " + index)
          .toBe("punctuation.bracket.latex");
      }
    }
    return rendered;
  }

  it("keeps citation keys separate from braces and optional-note brackets", async () => {
    await expectArgumentContents(
      String.raw`\cite[6.5.1(4)P]{pn-en_1991-2:2007}`,
      "markup.underline.link.citation.latex",
      ["pn-en_1991-2:2007"],
    );
  });

  it("highlights every citation key while retaining punctuation on argument braces", async () => {
    await expectArgumentContents(
      String.raw`\cite[see][pp.~1--2]{first:2007,second_2020,third-key}`,
      "markup.underline.link.citation.latex",
      ["first:2007", "second_2020", "third-key"],
    );
    await expectArgumentContents(String.raw`\cite{}`, "markup.underline.link.citation.latex", []);
    expect(scopesAt(1)).toContain("keyword.control.citation.latex");
  });

  it("keeps citation braces and list separators outside the underlined key ranges", async () => {
    const scope = "markup.underline.link.citation.latex";
    for (const [source, keys] of [
      [String.raw`\cite{roz_kol_2018}`, ["roz_kol_2018"]],
      [
        String.raw`\cite{first:2007,second_2020,third-key}`,
        ["first:2007", "second_2020", "third-key"],
      ],
    ]) {
      const rendered = await expectArgumentContents(source, scope, keys);
      for (let index = 0; index < source.length; index++) {
        if (!"{},".includes(source[index])) continue;
        expect(scopesAt(index))
          .withContext(source + " at " + index)
          .not.toContain(scope);
        expect(rendered[index])
          .withContext(source + " rendered scopes at " + index)
          .not.toContain(scope);
      }
    }
  });

  it("keeps command and environment argument counts separate from brackets", async () => {
    for (const source of [
      String.raw`\newcommand{\sample}[2][default]{#1#2}`,
      String.raw`\newenvironment{sample}[2]{#1#2}{}`,
    ]) {
      await expectArgumentContents(source, "variable.parameter.latex", ["2"]);
    }
  });

  it("keeps label argument braces styled as punctuation", async () => {
    for (const [source, names] of [
      [String.raw`\label{fig:example}`, ["fig:example"]],
      [String.raw`\cref{fig:first,fig:second}`, ["fig:first", "fig:second"]],
      [String.raw`\crefrange{fig:first}{fig:last}`, ["fig:first", "fig:last"]],
    ]) {
      await expectArgumentContents(source, "markup.underline.link.label.latex", names);
    }
  });

  it("keeps macro placeholders inside complete label arguments", async () => {
    const source = String.raw`\newcommand{\labele}[1]{\label{e:#1}}`;
    const scope = "markup.underline.link.label.latex";
    const rendered = await expectArgumentContents(source, scope, ["e:#1"]);
    const tree = editor.languageMode.tree.rootNode;
    const labels = tree.descendantsOfType("label_definition");
    expect(labels.length).toBe(1);
    expect(labels[0]?.childForFieldName("name")?.text).toBe("{e:#1}");
    const parameter = source.indexOf("#1");
    for (const index of [parameter, parameter + 1]) {
      expect(scopesAt(index)).toContain("variable.other.placeholder.latex");
      expect(rendered[index]).toContain("variable.other.placeholder.latex");
    }
    for (let index = 0; index < source.length; index++) {
      if (!"{}".includes(source[index])) continue;
      expect(scopesAt(index))
        .withContext(source + " at " + index)
        .not.toContain(scope);
      expect(rendered[index])
        .withContext(source + " rendered scopes at " + index)
        .not.toContain(scope);
    }
  });

  it("keeps environment and glossary names separate from their argument braces", async () => {
    for (const [source, scope, name] of [
      [
        String.raw`\begin{document}Text\end{document}`,
        "entity.name.type.environment.latex",
        "document",
      ],
      [String.raw`\gls{term}`, "markup.underline.link.glossary.latex", "term"],
      [String.raw`\acrshort{fem}`, "markup.underline.link.acronym.latex", "fem"],
      [String.raw`\textcolor{accent}{Text}`, "constant.other.color.latex", "accent"],
    ]) {
      await expectArgumentContents(source, scope, [name]);
    }
  });

  it("keeps counter names and numeric values separate from their argument delimiters", async () => {
    await expectArgumentContents(
      String.raw`\newcounter{example}[chapter]`,
      "variable.other.counter.latex",
      ["example", "chapter"],
    );
    await expectArgumentContents(String.raw`\setcounter{example}{4}`, "constant.numeric.latex", [
      "4",
    ]);
  });

  it("keeps nested bold and color group braces styled as punctuation", async () => {
    await expectArgumentContents(
      String.raw`\textbf{{\color{green}warunek spełniony}}`,
      "markup.bold.latex",
      ["warunek spełniony"],
    );
  });

  it("keeps equation commands and delimiters inside their math scope", async () => {
    const source = String.raw`\begin{equation*}
{\Delta}{{\sigma}}_{E,2}={\lambda}\ {\Delta}{{\sigma}}_{p}\ {{\Phi}}_{2}=43.7\,\mathrm{MPa}
\end{equation*}`;
    const rendered = await expectArgumentContents(source, "markup.raw.math.latex", ["43.7"]);
    for (const [token, scope] of [
      ["\\begin", "keyword.control.environment.latex"],
      ["\\end", "keyword.control.environment.latex"],
      ["equation*", "entity.name.type.environment.latex"],
      ["\\Delta", "support.function.latex"],
    ]) {
      let start = source.indexOf(token);
      while (start !== -1) {
        for (let index = start; index < start + token.length; index++) {
          expect(scopesAt(index).at(-1))
            .withContext(token + " at " + index)
            .toBe(scope);
          expect(rendered[index].at(-1))
            .withContext(token + " rendered scopes at " + index)
            .toBe(scope);
        }
        start = source.indexOf(token, start + token.length);
      }
    }
  });
});
