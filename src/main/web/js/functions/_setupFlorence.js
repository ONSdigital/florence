function setupFlorence(){
	//florence menu
  var florence_menu =
    '<section class="fl-panel fl-panel--admin-bar">' +
      '<nav>' +
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
          '</ul>' +
      '</nav>' +
    '</section>' +
    '<section class="fl-panel fl-panel--menu">' +
      '<nav>' +
        '<ul class="fl-main-menu">' +
            '<li class="fl-main-menu__item fl-main-menu__item--browse">' +
              '<a href="#" class="fl-main-menu__link">Browse</a>' +
            '</li>' +
            '<li class="fl-main-menu__item fl-main-menu__item--create">' +
              '<a href="#" class="fl-main-menu__link">Create</a>' +
            '</li>' +
            '<li class="fl-main-menu__item fl-main-menu__item--edit">' +
              '<a href="#" class="fl-main-menu__link">Edit</a>' +
            '</li>' +
            '<li class="fl-main-menu__item fl-main-menu__item--approve">' +
              '<a href="#" class="fl-main-menu__link">Approve</a>' +
            '</li>' +
          '</ul>' +
      '</nav>' +
  '</section>' +
  '<section class="fl-panel fl-panel--sub-menu">' +
  '</section>';

  //florence browse menu

  //florence create menu



  $('head').prepend('<link href="http://localhost:8081/css/main.min.css" rel="stylesheet" type="text/css">');
  $('head').prepend('<link href="http://localhost:8081/css/jquery-ui.min.css" rel="stylesheet" type="text/css">');
  $('head').prepend('<link href="http://localhost:8081/css/third-party/epiceditor/base/epiceditor.css" rel="stylesheet" type="text/css">');
  $('head').prepend('<link href="http://localhost:8081/css/third-party/epiceditor/editor/epic-dark.css" rel="stylesheet" type="text/css">');
  $('head').prepend('<link href="http://localhost:8081/css/third-party/epiceditor/preview/github.css" rel="stylesheet" type="text/css">');
  var bodycontent = $('body').html();

  $('body').wrapInner('<section class="fl-panel fl-panel--preview"><div class="fl-panel--preview__inner"></div></section>');
  // $('body').wrapInner('<section class="fl-container"></section>');
  $('body').prepend(florence_menu);

  $('.fl-main-menu__link').click(function() {
    setupFlorenceWorkspace($(this));
  });
 }


