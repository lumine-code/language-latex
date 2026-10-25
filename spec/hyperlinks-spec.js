const fs = require("fs");
const path = require("path");

const URI_SCOPE = "markup.underline.link.url.latex";
const PROSE_SCOPE = "markup.underline.link.hyperlink";

const packagePath = (name) => {
  const sibling = path.resolve(__dirname, "..", "..", name);
  return fs.existsSync(sibling) ? sibling : name;
};

describe("LaTeX hyperlink ranges", () => {
  let editor;

  beforeEach(async () => {
    for (const name of ["language-latex", "language-hyperlink"]) {
      await lumine.packages.activatePackage(packagePath(name));
    }
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("text.tex.latex"));
  });

  afterEach(() => editor?.destroy());

  function scopesAt(index) {
    const position = editor.getBuffer().positionForCharacterIndex(index);
    return editor.scopeDescriptorForBufferPosition(position).getScopesArray();
  }

  async function expectRange(source, uri, scope = URI_SCOPE) {
    editor.setText(source);
    expect(await editor.whenGrammarSettled()).toBe(true);
    const start = source.indexOf(uri);
    expect(start).toBeGreaterThanOrEqual(0);
    for (let index = 0; index < source.length; index++) {
      const highlighted = scopesAt(index).includes(scope);
      expect(highlighted)
        .withContext(`${JSON.stringify(source)} at ${index}`)
        .toBe(index >= start && index < start + uri.length);
    }
  }

  it("scopes only the destination of url and href commands", async () => {
    const pdf =
      "https://dot.ca.gov/-/media/dot-media/programs/engineering/documents/structureconstruction/201906-sc-trenchingshoring-a11y.pdf";
    for (const [source, uri] of [
      [String.raw`\url{https://example.com/manual.pdf}`, "https://example.com/manual.pdf"],
      [`\\href{${pdf}}{Caltrans, Trenching and Shoring Manual, rozdział 8}`, pdf],
      [
        String.raw`\href{https://example.com/path}{A \textbf{formatted} label}`,
        "https://example.com/path",
      ],
      [String.raw`\href{mailto:reader@example.com}{Email}`, "mailto:reader@example.com"],
      [String.raw`\url{ftp://example.com/manual.pdf}`, "ftp://example.com/manual.pdf"],
    ]) {
      await expectRange(source, uri);
      const root = editor.languageMode.tree.rootNode;
      expect(root.hasError).withContext(source).toBe(false);
      expect(root.descendantsOfType("uri").map((node) => node.text)).toEqual([uri]);
    }
  });

  it("retains encoded braces, TeX escapes and destination punctuation", async () => {
    for (const uri of [
      "https://example.com/%7Bitem%7D?q=one&next=two#part",
      String.raw`https://example.com/a\_b?q=one\&next=two\#part`,
      String.raw`https://example.com/?q=100\%`,
      "https://example.com/a_(b).",
    ]) {
      await expectRange(`\\href{${uri}}{Visible label}`, uri);
    }
  });

  it("excludes href options and labels from destinations with URI punctuation", async () => {
    for (const [source, uri, options] of [
      [
        String.raw`\href[page=2,pdfnewwindow=true]{https://example.com/manual.pdf}{Visible title}`,
        "https://example.com/manual.pdf",
        "[page=2,pdfnewwindow=true]",
      ],
      [
        String.raw`\href[page=3]{https://example.com/?filter[name]=value&next=%7Bitem%7D}{Filtered result}`,
        "https://example.com/?filter[name]=value&next=%7Bitem%7D",
        "[page=3]",
      ],
      [
        String.raw`\url{https://[2001:db8::1]:8080/path?q=[value]}`,
        "https://[2001:db8::1]:8080/path?q=[value]",
        null,
      ],
      [
        String.raw`\href[page=4]{https://example.com/a_(b).}{Punctuation in the destination}`,
        "https://example.com/a_(b).",
        "[page=4]",
      ],
    ]) {
      await expectRange(source, uri);
      const root = editor.languageMode.tree.rootNode;
      expect(root.hasError).withContext(source).toBe(false);
      const hyperlink = root.descendantsOfType("hyperlink")[0];
      expect(hyperlink.childForFieldName("options")?.text ?? null).toBe(options);
      expect(hyperlink.childForFieldName("uri").childForFieldName("uri").text).toBe(uri);
    }
  });

  it("treats commented TeX commands as prose and excludes their argument braces", async () => {
    const uri = "https://example.com/manual.pdf";
    for (const source of [
      `% \\url{${uri}} next`,
      `% \\href{${uri}}{Visible label}`,
      `\\iffalse\n\\href{${uri}}{Visible label}\n\\fi`,
    ]) {
      await expectRange(source, uri, PROSE_SCOPE);
      expect(editor.languageMode.tree.rootNode.descendantsOfType("uri")).toEqual([]);
      for (let index = 0; index < source.length; index++) {
        expect(scopesAt(index)).not.toContain(URI_SCOPE);
      }
    }
  });
});
