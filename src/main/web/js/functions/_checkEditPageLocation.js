function checkEditPageLocation() {
  if (pageurl != window.location.href) {
    pageurl = window.location.href;
    $(window.location).trigger("change", {
      newpage: loadPageDataIntoEditor()
    });
  }
}