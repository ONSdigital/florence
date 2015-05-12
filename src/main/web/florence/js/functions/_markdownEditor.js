function markdownEditor() {

  var converter = new Markdown.Converter(); //Markdown.getSanitizingConverter();

  converter.hooks.chain("preBlockGamut", function (text) {
    var newText = text.replace(/(<ons-chart\spath="[-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)*[\]$]+"?\s?\/>)/ig, function (match, capture) {

      var path = $(match).attr('path');
      //console.log("ons chart: " + text + " " + match + " " + path) ;
      var output = '<iframe src="http://localhost:8081/florence/chart.html?path=' + path + '.json"></iframe>';
      //console.log(output);

      return '[chart path="' + path + '" ]';
    });

    return newText;
  });

  Markdown.Extra.init(converter, {
    extensions: "all"
  });
  var editor = new Markdown.Editor(converter);
  Florence.Editor.markdownEditor = editor;
  editor.hooks.chain("onPreviewRefresh", function () {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  });
  editor.run();
}
