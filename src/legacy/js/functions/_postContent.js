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
      isUpdatingModal.add();

    // Temporary workaround for content disappearing from bulletins - store last 10 saves to local storage and update with server response later
    postToLocalStorage(collectionId, path, content);

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

    var date = new Date();
    date = date.getHours() + ":" + date.getMinutes() + "." + date.getMilliseconds();
    console.log("[" + date + "] Post page content: \n", JSON.parse(content));

    $.ajax({
        url: url,
        dataType: 'json',
        contentType: 'application/json',
        type: 'POST',
        //data: cleanedUpJSON,
        data: content,
        success: function (response) {
            isUpdatingModal.remove();
            addLocalPostResponse(response);
            success(response);
        },
        error: function (response) {
            isUpdatingModal.remove();
            addLocalPostResponse(response);
            if (error) {
                error(response);
            } else {
                handleApiError(response);
            }
        }
    });
}

function postToLocalStorage(collectionId, path, content) {
    var newSaveTime = new Date();
    var newId = collectionId;
    var newPath = path;
    var newContent = JSON.parse(content); 
    
    var localBackup = localStorage.getItem('localBackup');

    if (localBackup == null) {
        // If storage item doesn't exist yet initialise it with first save
        localBackup = [
            {
                collectionId: newId,
                content: newContent,
                path: newPath,
                saveTime: newSaveTime,
                postResponse: ''
            }
        ]
    } else {
        // Parse string back into JSON for reading and writing
        localBackup = JSON.parse(localBackup);

        var backupLength = localBackup.length;

        // Remove oldest entry if array is full
        if (backupLength == 10) {
            localBackup.pop();
        }

        // Add new entry to the top of the array
        localBackup.unshift(
            {
                collectionId: newId,
                content: newContent,
                path: newPath,
                saveTime: newSaveTime,
                postResponse: ''
            }
        );
    }

    localBackup = JSON.stringify(localBackup);
    localStorage.setItem('localBackup', localBackup);
}

function addLocalPostResponse(response) {
    var localBackup = JSON.parse(localStorage.getItem('localBackup'));
    localBackup[0].postResponse = response;
    localStorage.setItem('localBackup', JSON.stringify(localBackup));
}
