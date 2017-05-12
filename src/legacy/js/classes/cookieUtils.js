var CookieUtils = {
  getCookieValue: function (a, b) {
    b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
  }
};

// if running in a node environment export this as a module.
if (typeof module !== 'undefined') {
  module.exports = CookieUtils;
}




