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

