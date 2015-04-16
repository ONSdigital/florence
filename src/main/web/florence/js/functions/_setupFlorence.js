function setupFlorence() {
  window.templates = Handlebars.templates;
  var florence = '<div class="wrapper">'+'</div>';
  $('body').prepend(florence);

  var mainNavHtml = templates.mainNav;
  $('.wrapper').append(mainNavHtml);

  viewController();
}


