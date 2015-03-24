function markdownEditor() {
  var converter = Markdown.getSanitizingConverter();

  Markdown.Extra.init(converter, {
    extensions: "all"
  });
  var editor = new Markdown.Editor(converter);
  editor.hooks.chain("onPreviewRefresh", function () {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  });
  editor.run();
}
