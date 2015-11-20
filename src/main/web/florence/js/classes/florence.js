// The florence object is used for storing application state.
var Florence = Florence || {
    tredegarBaseUrl: window.location.origin,
    refreshAdminMenu: function () {
      var mainNavHtml = templates.mainNav(Florence);
      $('.admin-nav').html(mainNavHtml);
    },
    setActiveCollection: function (collection) {
      document.cookie = "collection=" + collection.id + ";path=/";
      if (!collection.publishDate) {
        var formattedDate = null;
      } else {
        var formattedDate = StringUtils.formatIsoDateString(collection.publishDate);
      }
      Florence.collection = {id: collection.id, name: collection.name, date: formattedDate, type: collection.type};
    }
  };

Florence.Editor = {
  isDirty: false,
  data: {}
};

Florence.CreateCollection = {
  selectedRelease:""
};

Florence.collection = {};

Florence.collectionToPublish = {};

Florence.globalVars = {pagePath: '', activeTab: false, pagePos: '', welsh: false};

Florence.Authentication = {
  accessToken: function () {
    return CookieUtils.getCookieValue("access_token");
  },
  isAuthenticated: function () {
    return Florence.Authentication.accessToken() !== '';
  },
  loggedInEmail: function () {
    return localStorage.getItem("loggedInAs")
  }
};

Florence.Handler = function (e) {
  if (Florence.Editor.isDirty) {
    var result = confirm("You have unsaved changes. Are you sure you want to continue");
    if (result === true) {
      Florence.Editor.isDirty = false;
      processPreviewClick(this);
      return true;
    } else {
      e.preventDefault();
      return false;
    }
  } else {
    processPreviewClick(this);
  }

  function processPreviewClick() {
    setTimeout(function () {
      checkForPageChanged(function (newUrl) {
        var safeUrl = checkPathSlashes(newUrl);
        Florence.globalVars.pagePath = safeUrl;
        if ($('.workspace-edit').length) {
          loadPageDataIntoEditor(safeUrl, Florence.collection.id, 'click');
        }
        else if ($('.workspace-browse').length) {
          treeNodeSelect(safeUrl);
        }
      });
    }, 200);
  }
};

// if running in a node environment export this as a module.
if (typeof module !== 'undefined') {
  module.exports = Florence;
}


