function getLastPosition () {
  var position = localStorage.getItem("pagePos");
  if (position > 0) {
    setTimeout(function() {
      $(".workspace-edit").scrollTop(position + 100);
      localStorage.removeItem("pagePos");
    }, 100);
  }
}

