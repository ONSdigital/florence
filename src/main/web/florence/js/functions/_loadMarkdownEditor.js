function loadMarkdownEditor(content, onSave, pageData) {

  var html = templates.markdownEditor(content);
  $('body').append(html);
  $('.markdown-editor').stop().fadeIn(200);

  markdownEditor();

  $('.btn-markdown-editor-cancel').on('click', function () {
    $('.markdown-editor').stop().fadeOut(200).remove();
  });

  $(".btn-markdown-editor-save").click(function () {
    var markdown = $('#wmd-input').val();
    onSave(markdown);
  });

  $(".btn-markdown-editor-exit").click(function () {
    var markdown = $('#wmd-input').val();
    onSave(markdown);
    $('.markdown-editor').stop().fadeOut(200).remove();
  });

  var onInsertSave = function(name, markdown) {
    insertAtCursor($('#wmd-input')[0], markdown);
    Florence.Editor.markdownEditor.refreshPreview();
  };

  $(".btn-markdown-editor-chart").click(function(){
    loadChartBuilder(pageData, onInsertSave);
  });

  $(".btn-markdown-editor-table").click(function(){
    loadTableBuilder(pageData, onInsertSave);
  });

  $("#wmd-input").on('click', function () {
    markDownEditorSetLines();
  });

  $("#wmd-input").on('keyup', function () {
    markDownEditorSetLines();
  });

  // http://stackoverflow.com/questions/11076975/insert-text-into-textarea-at-cursor-position-javascript
  function insertAtCursor(field, value) {
    //IE support
    if (document.selection) {
      field.focus();
      sel = document.selection.createRange();
      sel.text = value;
    }
    //MOZILLA and others
    else if (field.selectionStart || field.selectionStart == '0') {
      var startPos = field.selectionStart;
      var endPos = field.selectionEnd;
      field.value = field.value.substring(0, startPos)
      + value
      + field.value.substring(endPos, field.value.length);
      field.selectionStart = startPos + value.length;
      field.selectionEnd = startPos + value.length;
    } else {
      field.value += value;
    }
  }
}


function markdownEditor() {

  var converter = new Markdown.Converter(); //Markdown.getSanitizingConverter();

  // output chart tag as text instead of the actual tag.
  converter.hooks.chain("preBlockGamut", function (text) {
    var newText = text.replace(/(<ons-chart\spath="[-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)*[\]$]+"?\s?\/>)/ig, function (match) {
      var path = $(match).attr('path');
      return '[chart path="' + path + '" ]';
    });
    return newText;
  });

  // output table tag as text instead of the actual tag.
  converter.hooks.chain("preBlockGamut", function (text) {
    var newText = text.replace(/(<ons-table\spath="[-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)*[\]$]+"?\s?\/>)/ig, function (match) {
      var path = $(match).attr('path');
      return '[table path="' + path + '" ]';
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
  markDownEditorSetLines();
}
