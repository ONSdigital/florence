/**
 * save content to zebedee, making it in progress in a collection.
 * @param collectionId
 * @param path
 * @param content
 * @param overwriteExisting - should the content be overwritten if it already exists?
 * @param recursive - should we recurse the directory of the file and make all files under it in progress?
 * @param success
 * @param error
 */
function postContent(collectionId, path, content, overwriteExisting, recursive, success, error) {
    var safePath = checkPathSlashes(path);
    if (safePath === '/') {
        safePath = '';          // edge case for home
    }

    if (Florence.globalVars.welsh) {
        var url = "/zebedee/content/" + collectionId + "?uri=" + safePath + "/data_cy.json";
        var toAddLang = JSON.parse(content);
        toAddLang.description.language = 'cy';
        content = JSON.stringify(toAddLang);
    } else {
        var url = "/zebedee/content/" + collectionId + "?uri=" + safePath + "/data.json";
    }

    var url = url + '&overwriteExisting=' + overwriteExisting;
    var url = url + '&recursive=' + recursive;

    $.ajax({
        url: url,
        dataType: 'json',
        contentType: 'application/json',
        type: 'POST',
        data: content,
        success: function (response) {
            success(response);
        },
        error: function (response) {
            if (error) {
                error(response);
            } else {
                handleApiError(response);
            }
        }
    });
}
