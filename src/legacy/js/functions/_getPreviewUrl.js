function getPreviewUrl() {
  let iframeContentWindow = document.getElementById('iframe').contentWindow;
  let iframeTitle = iframeContentWindow.document.title;
  // checking title as iframes are not queryable via JS
  const is404 = iframeTitle.includes("404") || iframeTitle.toLowerCase().includes("page not found");
  if (is404) {
    return "/";
  }
  let parsedUrl = iframeContentWindow.location.pathname;
  let safeUrl = checkPathSlashes(parsedUrl);
  return safeUrl;
}
