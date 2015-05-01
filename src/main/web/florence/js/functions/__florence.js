var Florence = Florence || {
    tredegarBaseUrl: baseURL = 'http://' + window.location.host + '/index.html#!',
    refreshAdminMenu: function () {
      console.log("refreshing admin menu.." + Florence.Authentication.isAuthenticated())
      var mainNavHtml = templates.mainNav(Florence);
      $('.admin-nav').html(mainNavHtml);
    },
    setActiveCollection: function (collection) {
      document.cookie = "collection=" + collection.id + ";path=/";
      var formattedDate = StringUtils.formatIsoDateString(collection.publishDate);
      Florence.collection = {id: collection.id, name: collection.name, date: formattedDate};
    }
  };

Florence.Editor = {
  isDirty: false,
  data: {}
};

Florence.collection = {};

Florence.Authentication = {
  accessToken: function () {
    function getCookieValue(a, b) {
      b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
      return b ? b.pop() : '';
    }

    return getCookieValue("access_token");
  },
  isAuthenticated: function () {
    return accessToken() !== ''
  }
};

Florence.Handler = function () {
  setTimeout(function () {
    checkForPageChanged(function(newUrl) {
      var browserLocation = document.getElementById('iframe').contentWindow.location.href;
      $('.browser-location').val(browserLocation);
      if ($('.workspace-edit').length) {
        loadPageDataIntoEditor(newUrl, Florence.collection.id);
      }
      else if ($('.workspace-browse').length) {
        treeNodeSelect(newUrl);
      }
    });
    console.log('iframe inner clicked');
  }, 200);
};