function setupFlorence () {
  window.templates = Handlebars.templates;
  Handlebars.registerPartial("browseNode", templates.browseNode);

  localStorage.setItem('activeTab', false); // do we need this?

  // load main florence template
  var florence = templates.florence;
  $('body').append(florence);

  Florence.refreshAdminMenu();
  var adminMenu = $('.admin-nav');

  // dirty checks on admin menu
  adminMenu.on('click', '.nav--admin-item', function () {
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

  adminMenu.on('click', '.nav--admin-item', function () {
    $('.nav--admin-item').removeClass('selected');
    $(this).addClass('selected');
  });

  adminMenu.on('click', '.nav--admin__collections', function () {
    viewController('collections');
  });

  adminMenu.on('click', '.nav--admin__users', function () {
    viewController('users-and-access');
  });

  adminMenu.on('click', '.nav--admin__publish', function () {
    viewController('publish');
  });

  adminMenu.on('click', '.nav--admin__login', function () {
    viewController('login');
  });

  adminMenu.on('click', '.nav--admin__logout', function () {
    logout();
    viewController();
  });

  viewController();
}

