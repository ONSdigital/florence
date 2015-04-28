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
  });

  adminMenu.on('click', '#admin-menu-collections', function () {
    $('#admin-menu-collections').addClass('selected');
    viewController('collections');
  });

  adminMenu.on('click', '#admin-menu-users', function () {
    $('#admin-menu-users').addClass('selected');
    viewController('users-and-access');
  });

  adminMenu.on('click', '#admin-menu-publish', function () {
    $('#admin-menu-publish').addClass('selected');
    viewController('publish');
  });

  adminMenu.on('click', $(menuItems, '.admin-menu-login'), function () {
    viewController();
  });

  adminMenu.on('click', $(menuItems, '.admin-menu-logout'), function () {
    logout();
    viewController();
  });

  viewController();
}

