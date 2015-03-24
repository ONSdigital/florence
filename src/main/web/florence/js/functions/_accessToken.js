function accessToken(clear) {
  if(clear) {
    // get rid of the current access token
  }

  function getCookieValue(a, b) {
    b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
  }
  return getCookieValue("access_token");
}
