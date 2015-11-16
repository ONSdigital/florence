function setShortcuts(field) {
  $(field).select(function (e) {
    $(field).on('keydown', null, 'ctrl+m', function (ev) {
      var inputValue = $(field).val();
      var start = e.target.selectionStart;
      var end = e.target.selectionEnd;
      var outputValue = [inputValue.slice(0, start), "^", inputValue.slice(start, end), "^", inputValue.slice(end)].join('');
      $(field).val(outputValue);
      ev.stopImmediatePropagation();
      ev.preventDefault();
    });
    $(field).on('keyup', null, 'ctrl+q', function (ev) {
      var inputValue = $(field).val();
      var start = e.target.selectionStart;
      var end = e.target.selectionEnd;
      var outputValue = [inputValue.slice(0, start), "~", inputValue.slice(start, end), "~", inputValue.slice(end)].join('');
      $(field).val(outputValue);
      ev.stopImmediatePropagation();
    });
  });
}