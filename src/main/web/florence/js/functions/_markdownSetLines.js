function markDownEditorSetLines() {
  var textarea = $("#wmd-input");
  // var linesHolder = $('.markdown-editor-line-numbers');
  var textareaWidth = textarea.width();
  var charWidth = 7;
  var lineHeight = 21;
  var textareaMaxChars = Math.floor(textareaWidth / charWidth);
  var lines = textarea.val().split('\n');
  var linesLi = '';
  var cursorEndPos = textarea.prop('selectionEnd');
  var charMapArray = [];
  var charMapArrayJoin = [];
  var lineLengthArray = [];
  var contentLength = textarea.val().length;
  var cumulativeLineLength = 0;
  // var cursorLine = textarea.prop('selectionStart').split('\n').length;
  $.each(lines, function(index){
    var lineNumber = index + 1;
    var lineLength = this.length;
    var lineWrap = Math.round(lineLength / textareaMaxChars);
    // var lineWrap = Math.floor(lineLength / textareaMaxChars);
    // var lineWrap = Math.ceil(lineLength / textareaMaxChars);

    //console.log('max chars: ' + textareaMaxChars);
    //console.log('line length: ' + lineLength);

    var numberOfLinesCovered = StringUtils.textareaLines(this, textareaMaxChars, 0, 0);
    var liPaddingBottom = numberOfLinesCovered * lineHeight;

    if(lineNumber === 1) {
      cumulativeLineLength += lineLength;
    } else {
      cumulativeLineLength += lineLength + 1;
      // console.log('+1');
    }

    linesLi += '<li id="markdownEditorLine-' + lineNumber + '" style="padding-bottom:' + liPaddingBottom +'px">&nbsp;</li>';
    lineLengthArray.push(cumulativeLineLength);

    //push to charmap
    // charMapArray.push(this.replace(this.split(''), lineNumber));
    // console.log(this.selectionStart);
    //console.log('line wrap: ' + lineWrap + ' (' + lineLength / textareaMaxChars + ')');
  });

  if(linesLi) {
    var linesOl = '<ol>' + linesLi + '</ol>';
    $('.markdown-editor-line-numbers').html(linesOl);
    // console.log(linesOl);
  }

  //sync scroll
  // $('.markdown-editor-line-numbers ol').css('margin-top', -textarea.scrollTop());
  // textarea.on('scroll', function () {
  //   // var editorHeight = $('.wmd-input').height();
  //   // var previewHeight = $('.wmd-preview').height();
  //   // console.log(editorHeight);
  //   var marginTop = $(this).scrollTop();
  //   $('.markdown-editor-line-numbers ol').css('margin-top', -marginTop);
  //   $('.wmd-preview').scrollTop(marginTop);
  // });


  //proportional scroll
  //var $wmdscrollsync = $('.wmd-input, .wmd-preview');
  //var wmdsync = function(e){
  //    var $other = $wmdscrollsync.not(this).off('scroll'), other = $other.get(0);
  //    var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);
  //    other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight);
  //    setTimeout( function(){ $other.on('scroll', wmdsync ); },10);
  //}
  //$wmdscrollsync.on( 'scroll', wmdsync);



  for (var i = 0; i < lineLengthArray.length; i++) {
    if(cursorEndPos <= lineLengthArray[i]) {
      // console.log(i + 1);
      var activeLine = i + 1;
      $('#markdownEditorLine-' + activeLine).addClass('active');
      break;
    }
    // console.log(lineLengthArray[i]);
    //Do something
  }



}
