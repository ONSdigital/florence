function createWorkspace(path, collectionId, menu, stopEventListener) {
  var safePath = '';
  $("#working-on").on('click', function () {}); // add event listener to mainNav

  if(stopEventListener) {
    document.getElementById('iframe').onload = function () {
      var browserLocation = document.getElementById('iframe').contentWindow.location.href;
      $('.browser-location').val(browserLocation);
      var iframeEvent = document.getElementById('iframe').contentWindow;
          iframeEvent.removeEventListener('click', Florence.Handler, true);
    };
    return false;
  } else {
    var currentPath = '';
    if (path) {
      currentPath = path;
      safePath = checkPathSlashes(currentPath);
    }

    Florence.globalVars.pagePath = safePath;

    Florence.refreshAdminMenu();

    var workSpace = templates.workSpace(Florence.tredegarBaseUrl + safePath);
     $('.section').html(workSpace);

    //click handlers
    $('.nav--workspace > li').click(function () {
      menu = '';
      if (Florence.Editor.isDirty) {
        var result = confirm("You have unsaved changes. Are you sure you want to continue");
        if (result === true) {
          Florence.Editor.isDirty = false;
          processMenuClick(this);
        } else {
          return false;
        }
      } else {
        processMenuClick(this);
      }
    });

    function processMenuClick(clicked) {
      var menuItem = $(clicked);

      $('.nav--workspace li').removeClass('selected');
      menuItem.addClass('selected');

      if (menuItem.is('#browse')) {
        loadBrowseScreen(collectionId, 'click');
      } else if (menuItem.is('#create')) {
        loadCreateScreen(Florence.globalVars.pagePath, collectionId);
      } else if (menuItem.is('#edit')) {
        Florence.globalVars.pagePath = getPathName();
        loadPageDataIntoEditor(Florence.globalVars.pagePath, Florence.collection.id);
      } else {
        loadBrowseScreen(collectionId);
      }
    }

    $('.workspace-menu').on('click', '.btn-browse-create', function () {
      var dest = $('.tree-nav-holder ul').find('.selected').attr('data-url');
      Florence.globalVars.pagePath = dest;
      $('.nav--workspace li').removeClass('selected');
      $("#create").addClass('selected');
      loadCreateScreen(Florence.globalVars.pagePath, collectionId);
    });

    $('.workspace-menu').on('click', '.btn-browse-edit', function () {
      var dest = $('.tree-nav-holder ul').find('.selected').attr('data-url');
      Florence.globalVars.pagePath = dest;
      $('.nav--workspace li').removeClass('selected');
      $("#edit").addClass('selected');
      loadPageDataIntoEditor(Florence.globalVars.pagePath, collectionId);
    });

    document.getElementById('iframe').onload = function () {
      var browserLocation = document.getElementById('iframe').contentWindow.location.href;
      $('.browser-location').val(browserLocation);
      var iframeEvent = document.getElementById('iframe').contentWindow;
      iframeEvent.addEventListener('click', Florence.Handler, true);
    };

    if (menu === 'edit') {
      $('.nav--workspace li').removeClass('selected');
      $("#edit").addClass('selected');
      loadPageDataIntoEditor(Florence.globalVars.pagePath, collectionId);
    } else {
      //browse screen by default
      $('.nav--workspace li').removeClass('selected');
      $("#browse").addClass('selected');
      loadBrowseScreen(collectionId, 'click');
    }
  }
}



