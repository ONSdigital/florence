/**
 * Manages markdown editor
 * @param content
 * @param onSave
 * @param pageData
 * @param notEmpty - if present, markdown cannot be left empty
 */

function loadMarkdownEditor(content, onSave, pageData, notEmpty) {

  if (content.title == undefined) {
    var html = templates.markdownEditorNoTitle(content);
    $('body').append(html);
    $('.markdown-editor').stop().fadeIn(200);
    $('#wmd-input').focus();
  } else {
    var html = templates.markdownEditor(content);
    $('body').append(html);
    $('.markdown-editor').stop().fadeIn(200);
    $('#wmd-input').focus();
  }

  markdownEditor();

  if (notEmpty) {
    var markdown = $('#wmd-input').val();
  }

  if (notEmpty === true || markdown === '') {
    $('.btn-markdown-editor-cancel').hide();
  } else {
    $('.btn-markdown-editor-cancel').on('click', function () {
      $('.markdown-editor').stop().fadeOut(200).remove();
      clearTimeout(timeoutId);
    });
  }

  $(".btn-markdown-editor-save").click(function () {
    onSave(markdown);
    clearTimeout(timeoutId);
  });

  if (notEmpty) {
    $(".btn-markdown-editor-exit").click(function () {
      var markdown = $('#wmd-input').val();
      if (markdown === '') {
        sweetAlert('Please add some text', "This can't be left empty");
      } else {
        onSave(markdown);
        clearTimeout(timeoutId);
        $('.markdown-editor').stop().fadeOut(200).remove();
      }
    });
  } else {
    $(".btn-markdown-editor-exit").click(function () {
      var markdown = $('#wmd-input').val();
      onSave(markdown);
      clearTimeout(timeoutId);
      $('.markdown-editor').stop().fadeOut(200).remove();
    });
  }

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

  $(".btn-markdown-editor-image").click(function(){
    loadImageBuilder(pageData, function(name, markdown, pageData) {
      onInsertSave(name, markdown);
      refreshImagesList(Florence.collection.id, pageData)
    });
  });

  $("#wmd-input").on('click', function () {
    markDownEditorSetLines();
  });

  $("#wmd-input").on('keyup', function () {
    markDownEditorSetLines();
  });

  $("#wmd-input").on('input', function () {
    autoSave(onSave);
  });

  // http://stackoverflow.com/questions/6140632/how-to-handle-tab-in-textarea
  $("#wmd-input").keydown(function(e) {
    if(e.keyCode === 9) { // tab was pressed
      // get caret position/selection
      var start = this.selectionStart;
      var end = this.selectionEnd;

      var $this = $(this);
      var value = $this.val();

      // set textarea value to: text before caret + tab + text after caret
      $this.val(value.substring(0, start)
      + "\t"
      + value.substring(end));

      // put caret at right position again (add one for the tab)
      this.selectionStart = this.selectionEnd = start + 1;

      // prevent the focus lose
      e.preventDefault();
    }
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

  var converter = new Markdown.getSanitizingConverter();

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

var timeoutId;
function autoSave (onSave) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(function() {
    // Runs 5 second (5000 ms) after the last change
    var markdown = $('#wmd-input').val();
    onSave(markdown);
  }, 5000);
}

