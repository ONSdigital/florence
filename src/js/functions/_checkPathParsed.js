/**
 * Checks a valid link
 * @param uri
 * @returns {*} - if valid returns a formatted valid link
 */

function checkPathParsed (uri) {
  if (uri.match(/^(https?|ftp):\/\/(([a-z0-9$_\.\+!\*\'\(\),;\?&=-]|%[0-9a-f]{2})+(:([a-z0-9$_\.\+!\*\'\(\),;\?&=-]|%[0-9a-f]{2})+)?@)?((([a-z0-9]\.|[a-z0-9][a-z0-9-]*[a-z0-9]\.)*[a-z][a-z0-9-]*[a-z0-9]|((\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5]))(:\d+)?)(((\/+([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)*(\?([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)?)?)?(#([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)?/i)) {
    var myUrl = parseURL(uri);
    var safeUrl = myUrl.pathname;
    if (safeUrl.charAt(safeUrl.length-1) === '/') {
      safeUrl = safeUrl.slice(0, -1);
    }
  return safeUrl;
  } else {
    sweetAlert('This is not a valid link');
    return false;
  }
}
