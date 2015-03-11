function getPathName() {
    var parsedUrl = window.location.href.split("#!/")[1];
    return parsedUrl;
}