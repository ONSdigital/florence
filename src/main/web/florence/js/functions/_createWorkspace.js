function createWorkspace(path, collectionName, menu, stopEventListener) {

  if(stopEventListener) {
    document.getElementById('iframe').onload = function () {
      var browserLocation = document.getElementById('iframe').contentWindow.location.href;
      $('.browser-location').val(browserLocation);
      var iframeEvent = document.getElementById('iframe').contentWindow;
          iframeEvent.removeEventListener('click', Florence.Handler, true);
    }
    return false;
  } else {
    var currentPath = '';
    if (path) {
      currentPath = path;
    }

    localStorage.removeItem("pageurl");
    localStorage.setItem("pageurl", currentPath);

    Florence.refreshAdminMenu();

    var workSpace = templates.workSpace(Florence.tredegarBaseUrl + '/' + path);
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
        loadBrowseScreen(collectionName, 'click');
      } else if (menuItem.is('#create')) {
        loadCreateScreen(collectionName);
      } else if (menuItem.is('#edit')) {
        loadPageDataIntoEditor(getPathName(document.getElementById('iframe').contentWindow.location.href), Florence.collection.id);
      } else {
        loadBrowseScreen(collectionName);
      }
    }

    $('.workspace-menu').on('click', '.btn-browse-create', function () {
      var dest = $('.tree-nav-holder ul').find('.selected').attr('data-url');
      console.log(dest);
      viewWorkspace(dest, Florence.collection.id, 'create');
    });

    $('.workspace-menu').on('click', '.btn-browse-edit', function () {
      var dest = $('.tree-nav-holder ul').find('.selected').attr('data-url');
      viewWorkspace(dest, Florence.collection.id, 'edit');
    });

    document.getElementById('iframe').onload = function () {
      var browserLocation = document.getElementById('iframe').contentWindow.location.href;
      $('.browser-location').val(browserLocation);
        var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.addEventListener('click', Florence.Handler, true);
    }

    viewWorkspace(path, collectionName, menu);

  }
};



