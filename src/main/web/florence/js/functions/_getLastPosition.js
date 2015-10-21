/**
 * Gives the last position when on a page
 */

function getLastPosition () {
  var position = Florence.globalVars.pagePos;
  if (position > 0) {
    setTimeout(function() {
      $(".workspace-edit").scrollTop(position + 100);
    }, 200);
  }
}

