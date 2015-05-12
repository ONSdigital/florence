function markdownEditor() {
  var converter = new Markdown.Converter(); //Markdown.getSanitizingConverter();

  converter.hooks.chain("postConversion", function (text) {
    return text.replace(/<ons-chart.*>/, function(match, capture) {
      console.log("ons chart: " + match + " " + capture) ;

      var path = $(match).attr('path');

      console.log("ons chart: " + match + " " + path) ;

      return '<iframe src="http://localhost:8081/florence/chart.html?path=' + path + '></iframe>';

    });
  });

  Markdown.Extra.init(converter, {
    extensions: "all"
  });
  var editor = new Markdown.Editor(converter);
  editor.hooks.chain("onPreviewRefresh", function () {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  });
  editor.run();
}
