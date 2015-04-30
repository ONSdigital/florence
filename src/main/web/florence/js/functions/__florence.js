var Florence = Florence || {
    refreshAdminMenu: function () {
      console.log("refreshing admin menu.." + Florence.Authentication.isAuthenticated())
      var mainNavHtml = templates.mainNav(Florence);
      $('.admin-nav').html(mainNavHtml);
    }
  };

Florence.Editor = {
  isDirty: false,
  data: {}
};

Florence.collection = {};

Florence.Authentication = {
  accessToken: function(){
    function getCookieValue(a, b) {
      b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
      return b ? b.pop() : '';
    }
    return getCookieValue("access_token");
  },
  isAuthenticated: function() { return accessToken() !== '' }
};

Florence.Handler = function () {
  setTimeout(function () {
    var browserLocation = document.getElementById('iframe').contentWindow.location.href;
    $('.browser-location').val(browserLocation);
    if ($('.workspace-edit').length) {
      loadPageDataIntoEditor(getPathName(browserLocation), Florence.collection.id);
    }
    else if ($('.workspace-browse').length) {
      treeNodeSelect(browserLocation);
    }
    checkForPageChanged();
    console.log('iframe inner clicked');
  }, 200);
};