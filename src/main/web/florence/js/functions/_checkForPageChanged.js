/**
 * Checks for changes in the iframe path
 * @param onChanged - function
 */
function checkForPageChanged(onChanged) {
  var iframeUrl = Florence.globalVars.pagePath;
  var nowUrl = $('#iframe')[0].contentWindow.document.location.pathname;
  if (iframeUrl !== nowUrl) {
    Florence.globalVars.activeTab = false;
    Florence.globalVars.pagePos = '';
    if (!onChanged) {
      Florence.globalVars.pagePath = nowUrl;
    } else {
      Florence.globalVars.pagePath = nowUrl;
      onChanged(nowUrl);
    }
  }
}

