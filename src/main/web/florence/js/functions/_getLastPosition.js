function getLastPosition () {
  var position = Florence.globalVars.pagePos;
  if (position > 0) {
    setTimeout(function() {
      $(".workspace-edit").scrollTop(position + 100);
      Florence.globalVars.pagePos = '';
    }, 200);
  }
}

