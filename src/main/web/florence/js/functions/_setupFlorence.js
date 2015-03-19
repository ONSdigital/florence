function setupFlorence(){
	//florence menu
  var florence_menu =
    // '<section>' +
    '<nav class="fl-panel fl-panel--admin-bar">' +
      '<ul class="fl-admin-menu">' +
          '<li class="fl-admin-menu__item fl-admin-menu__item--collections">' +
            '<a href="#" class="fl-admin-menu__link">Collections</a>' +
          '</li>' +
          '<li class="fl-admin-menu__item fl-admin-menu__item--useradmin">' +
            '<a href="#" class="fl-admin-menu__link">Users and access</a>' +
          '</li>' +
          '<li class="fl-admin-menu__item fl-admin-menu__item--publish">' +
            '<a href="#" class="fl-admin-menu__link">Publish</a>' +
          '</li>' +
          '<li class="fl-admin-menu__item fl-admin-menu__item--login">' +
            '<a href="#" class="fl-admin-menu__link">login</a>' +
          '</li>' +
        '</ul>' +
    '</nav>' +
    // '</section>' +
  '<div class="fl-view">' +
  '</div>';

  //florence browse menu

  //florence create menu



  $('head').prepend('<link href="http://localhost:8081/florence/css/main.min.css" rel="stylesheet" type="text/css">');
  $('head').prepend('<link href="http://localhost:8081/florence/css/jquery-ui.min.css" rel="stylesheet" type="text/css">');
  $('head').prepend('<link href="http://localhost:8081/florence/css/third-party/pagedown.css" rel="stylesheet" type="text/css">');
  var bodycontent = $('body').html();

  // $('body').wrapInner('<section class="fl-panel fl-panel--preview"><div class="fl-panel--preview__inner"></div></section>');
  // $('body').wrapInner('<section class="fl-container"></section>');
  $('body').prepend(florence_menu);

  viewController();

 }


