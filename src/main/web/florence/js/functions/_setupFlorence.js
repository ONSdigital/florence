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
  adminMenu.on('click', '.nav--admin__item', function () {
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

  adminMenu.on('click', '.nav--admin__item', function () {
    $('.nav--admin__item').removeClass('selected');
    $(this).addClass('selected');
  });

  adminMenu.on('click', '.nav--admin__item--collections', function () {
    viewController('collections');
  });

  adminMenu.on('click', '.nav--admin__item--users', function () {
    viewController('users-and-access');
  });

  adminMenu.on('click', '.nav--admin__item--publish', function () {
    viewController('publish');
  });

  adminMenu.on('click', '.nav--admin__item--login', function () {
    viewController('login');
  });

  adminMenu.on('click', '.nav--admin__item--logout', function () {
    logout();
    viewController();
  });

  viewController();
}

