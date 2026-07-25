exports.activate = function () {
  // No injection points needed for LaTeX
};

exports.consumeHyperlinkInjection = (hyperlink) => {
  hyperlink.addInjectionPoint("text.tex.latex", {
    types: ["line_comment", "block_comment"],
  });
};

exports.consumeTodoInjection = (todo) => {
  todo.addInjectionPoint("text.tex.latex", {
    types: ["line_comment", "block_comment"],
  });
};
