function setupFlorence() {
  //florence menu
  var florence_menu =
    '<nav class="fl-panel fl-panel--admin-bar">' +
    '  <ul class="fl-admin-menu">' +
    '    <li class="fl-admin-menu__item fl-admin-menu__item--collections">' +
    '      <a href="#" class="fl-admin-menu__link">Collections</a>' +
    '    </li>' +
    '    <li class="fl-admin-menu__item fl-admin-menu__item--useradmin">' +
    '      <a href="#" class="fl-admin-menu__link">Users and access</a>' +
    '    </li>' +
    '    <li class="fl-admin-menu__item fl-admin-menu__item--publish">' +
    '      <a href="#" class="fl-admin-menu__link">Publish</a>' +
    '    </li>' +
    '    <li class="fl-admin-menu__item fl-admin-menu__item--login hidden">' +
    '      <a href="#" class="fl-admin-menu__link">login</a>' +
    '    </li>' +
    '    <li class="fl-admin-menu__item fl-admin-menu__item--logout hidden">' +
    '      <a href="#" class="fl-admin-menu__link">logout</a>' +
    '    </li>' +
    '  </ul>' +
    '</nav>' +
    '<div class="fl-view">' +
    '</div>';

  //florence browse menu

  //florence create menu


  $('head').prepend('<link href="/florence/css/main.min.css" rel="stylesheet" type="text/css">');
  $('head').prepend('<link href="/florence/css/jquery-ui.min.css" rel="stylesheet" type="text/css">');
  $('head').prepend('<link href="/florence/css/third-party/pagedown.css" rel="stylesheet" type="text/css">');
  var bodycontent = $('body').html();

  // $('body').wrapInner('<section class="fl-panel fl-panel--preview"><div class="fl-panel--preview__inner"></div></section>');
  // $('body').wrapInner('<section class="fl-container"></section>');
  $('body').prepend(florence_menu);

  $('.fl-admin-menu__link').on('click', function() {
    console.log('admin menu clicked...');
    if(Florence.Editor.isDirty) {
      var result = confirm("You have unsaved changes. Are you sure you want to continue");
      if (result == true) {
        Florence.Editor.isDirty = false;
        return true;
      } else {
        return false;
      }
    }
  });

  window.onbeforeunload = function(){
    if(Florence.Editor.isDirty) {
      return 'You have unsaved changes.';
    }
  };

  //click handlers
  $('.fl-admin-menu__link').click(function() {
    if ($(this).parent().hasClass('fl-admin-menu__item--collections')){
      viewController('collections');
    }
  });

  $('.fl-admin-menu__item--useradmin').click(function() {
    viewController('users-and-access');
  });

  var loginLink = $('.fl-admin-menu__item--login');
  loginLink.addClass('hidden');
  loginLink.click(function() {
    viewController('login');
  });
  var logoutLink = $('.fl-admin-menu__item--logout')
  logoutLink.removeClass('hidden');
  logoutLink.click(function() {
    logoutLink.addClass('hidden');
    loginLink.removeClass('hidden');
    logout();
    viewController('login');
  });

  $('.fl-admin-menu__item--publish').click(function() {
    viewController('publish');
  });



  viewController();

}


