function setupFlorence () {
  window.templates = Handlebars.templates;
  Handlebars.registerPartial("browseNode", templates.browseNode);

  localStorage.setItem('activeTab', false); // do we need this?

  // load main florence template
  var florence = templates.florence;
  $('body').prepend(florence);

  var adminMenu = $('#admin-menu');

  // render the admin menu within the florence template.
  var mainNavHtml = templates.mainNav(Florence);
  adminMenu.html(mainNavHtml);

  // dirty checks on admin menu
  adminMenu.on('click', '.admin-menu', function () {
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

  adminMenu.on('click', '.admin-menu', function () {
    $('.admin-menu').removeClass('selected');
    $(this).addClass('selected');
  });

  adminMenu.on('click', '#admin-menu-collections', function () {
    viewController('collections');
  });

  adminMenu.on('click', '#admin-menu-users', function () {
    viewController('users-and-access');
  });

  adminMenu.on('click', '#admin-menu-publish', function () {
    viewController('publish');
  });

  adminMenu.on('click', '#admin-menu-login', function () {
    viewController('login');
  });

  adminMenu.on('click', '#admin-menu-logout', function () {
    logout();
    viewController();
  });

  viewController();
}

