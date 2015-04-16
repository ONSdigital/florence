function loadBrowseScreen() {

  $('.fl-panel--sub-menu').css("overflow","scroll");
  Handlebars.registerPartial("browseNode", Handlebars.templates.browseNode);
  return $.ajax({
    url: "/navigation",
    dataType: 'json',
    type: 'GET',
    success: function (response) {
      var html = Handlebars.templates.browse(response);
      $('.fl-panel--sub-menu').html(html);
    },
    error: function (response) {
      handleApiError(response)
    }
  });
}