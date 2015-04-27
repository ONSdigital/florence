function setupFlorence () {
  window.templates = Handlebars.templates;
  Handlebars.registerPartial("browseNode", templates.browseNode);

  localStorage.setItem('activeTab', false);

  var florence = '<div class="wrapper">'+'</div>';
  $('body').prepend(florence);

  var mainNavHtml = templates.mainNav;
  $('.wrapper').append(mainNavHtml);

  $('.fl-admin-menu__link').on('click', function () {
    console.log('admin menu clicked...');
    if(Florence.Editor.isDirty) {
      var result = confirm("You have unsaved changes. Are you sure you want to continue");
      if (result === true) {
        Florence.Editor.isDirty = false;
        return true;
      } else {
        return false;
      }
    }
  });

  window.onbeforeunload = function () {
    if(Florence.Editor.isDirty) {
      return 'You have unsaved changes.';
    }
  };

  //click handlers
  $('.fl-admin-menu__link').click(function () {
    if ($(this).parent().hasClass('fl-admin-menu__item--collections')) {
      viewController('collections');
    }
  });

  $('.fl-admin-menu__item--useradmin').click(function () {
    viewController('users-and-access');
  });

  var loginLink = $('.fl-admin-menu__item--login');
  loginLink.addClass('hidden');
  loginLink.click(function () {
    viewController('login');
  });
  var logoutLink = $('.fl-admin-menu__item--logout');
  logoutLink.removeClass('hidden');
  logoutLink.click(function () {
    logoutLink.addClass('hidden');
    loginLink.removeClass('hidden');
    logout();
    viewController('login');
  });

  var $nav = $('.nav');

  $nav.on('click', '#publish', function () {
    console.log('once?!');
    viewController('publish');
  });

  viewController();
}

