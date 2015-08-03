function setupFlorence() {
  window.templates = Handlebars.templates;
  Handlebars.registerPartial("browseNode", templates.browseNode);
  Handlebars.registerPartial("editNav", templates.editNav);
  Handlebars.registerPartial("editNavCompendium", templates.editNavCompendium);
  Handlebars.registerHelper('select', function( value, options ){
    var $el = $('<select />').html( options.fn(this) );
    $el.find('[value="' + value + '"]').attr({'selected':'selected'});
    return $el.html();
  });
  Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });
  // Add two values together. Primary usage was '@index + 1' to create numbered lists
  Handlebars.registerHelper('plus', function(value1, value2) {
    return value1 + value2;
  });
  // Add two values together. Primary usage was '@index + 1' to create numbered lists
  Handlebars.registerHelper('lastEditedBy', function(array) {
    var event = array[array.length-1];
    return 'Last edited ' + StringUtils.formatIsoDateString(new Date(event.date)) + " by " + event.email;
  });
  Handlebars.registerHelper('createdBy', function(array) {
    var event = getCollectionCreatedEvent(array);
    console.log(event);
    if(event) {
      return 'Created ' + StringUtils.formatIsoDateString(new Date(event.date)) + " by " + event.email + '';
    } else {
      return "";
    }
  });




  Florence.globalVars.activeTab = false;

  // load main florence template
  var florence = templates.florence;

  $('body').append(florence);
  Florence.refreshAdminMenu();

  var adminMenu = $('.admin-nav');
  // dirty checks on admin menu
  adminMenu.on('click', '.nav--admin__item', function () {
    if (Florence.Editor.isDirty) {
      var result = confirm("You have unsaved changes. Are you sure you want to continue");
      if (result === true) {
        Florence.Editor.isDirty = false;
        processMenuClick(this);
        return true;
      } else {
        return false;
      }
    } else {
      processMenuClick(this);
    }
  });


  window.onbeforeunload = function () {
    if (Florence.Editor.isDirty) {
      return 'You have unsaved changes.';
    }
  };
  viewController();


  function processMenuClick(clicked) {
    Florence.collection = {};

    $('.nav--admin__item--collection').hide();
    $('.nav--admin__item').removeClass('selected');
    var menuItem = $(clicked);

    menuItem.addClass('selected');


    if (menuItem.hasClass("nav--admin__item--collections")) {
      viewController('collections');
    } else if (menuItem.hasClass("nav--admin__item--collection")) {
      var thisCollection = CookieUtils.getCookieValue("collection");
      viewCollections(thisCollection);
      $(".nav--admin__item--collections").addClass('selected');
    } else if (menuItem.hasClass("nav--admin__item--users")) {
      viewController('users-and-access');
    } else if (menuItem.hasClass("nav--admin__item--publish")) {
      viewController('publish');
    } else if (menuItem.hasClass("nav--admin__item--login")) {
      viewController('login');
    } else if (menuItem.hasClass("nav--admin__item--logout")) {
      logout();
      viewController();
    }
  }

  //var interval = setTimeout(ping, 60000);
  //ping();
}

