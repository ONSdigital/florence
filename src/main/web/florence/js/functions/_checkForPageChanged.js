/**
 * Checks for changes in the iframe path
 * @param onChanged - function
 */
function checkForPageChanged(onChanged) {
    var iframeUrl = Florence.globalVars.pagePath;
    var nowUrl = $('#iframe')[0].contentWindow.document.location.pathname;

    // Only update URL if it's different and it's got a valid value (ie not 'blank')
    if (iframeUrl !== nowUrl && !(nowUrl === "/blank" || nowUrl === "blank")) {
        Florence.globalVars.activeTab = false;
        Florence.globalVars.pagePos = '';
        if (!onChanged) {
            Florence.globalVars.pagePath = nowUrl;
        } else {
            onChanged(nowUrl);
        }
    }
}

