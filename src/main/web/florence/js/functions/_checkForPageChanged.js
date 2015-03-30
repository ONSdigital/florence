<<<<<<< HEAD:src/main/web/florence/js/functions/_checkForPageChanged.js
function checkForPageChanged(onChanged) {
=======
function setupPageLocation(cond) {

  if(pageUrl)
    localStorage.setItem("pageurl", pageUrl);
>>>>>>> Editor retrieves links automatically:src/main/web/florence/js/functions/_setupPageLocation.js

  iframeUrl = localStorage.getItem("pageurl");
  nowUrl = $('.fl-panel--preview__content').contents().get(0).location.href;
<<<<<<< HEAD:src/main/web/florence/js/functions/_checkForPageChanged.js
  if (iframeUrl !== nowUrl) {
    onChanged();
    localStorage.setItem("pageurl", nowUrl);
=======
  if (cond !== "false") {
    if (iframeUrl !== nowUrl) {
      loadPageDataIntoEditor(collectionName, true);
      localStorage.setItem("pageurl", nowUrl);
    }
  } else {
    loadPageDataIntoEditor(collectionName, "false");
>>>>>>> Editor retrieves links automatically:src/main/web/florence/js/functions/_setupPageLocation.js
  }
}
