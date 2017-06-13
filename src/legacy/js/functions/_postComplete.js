function saveAndCompleteContent(collectionId, path, content, recursive, redirectToPath) {

    if (!recursive) {
        recursive = false;
    }

    putContent(collectionId, path, content,
        success = function () {
            Florence.Editor.isDirty = false;
            if (redirectToPath) {
                completeContent(collectionId, path, recursive, redirectToPath);
            } else {
                completeContent(collectionId, path, recursive);
            }
        },
        error = function (response) {
            if (response.status === 400) {
                sweetAlert("Cannot edit this page", "It is already part of another collection.");
            }
            else {
                handleApiError(response);
            }
        },
        recursive);
}

function completeContent(collectionId, path, recursive, redirectToPath) {
    var redirect = redirectToPath;
    var safePath = checkPathSlashes(path);
    if (safePath === '/') {
        safePath = '';          // edge case for home
    }

    if (Florence.globalVars.welsh) {
        var url = "/zebedee/complete/" + collectionId + "?uri=" + safePath + "/data_cy.json";
    } else {
        var url = "/zebedee/complete/" + collectionId + "?uri=" + safePath + "/data.json";
    }

    var url = url + '&recursive=' + recursive;

    // Update content
    isUpdatingModal.add();
    $.ajax({
        url: url,
        dataType: 'json',
        contentType: 'application/json',
        type: 'POST',
        success: function () {
            isUpdatingModal.remove();
            if (redirect) {
                createWorkspace(redirect, collectionId, 'edit');
                return;
            } else {
                // Remove selection from 'working on: collection' tab
                $('.js-nav-item--collection').hide();
                $('.js-nav-item').removeClass('selected');
                $('.js-nav-item--collections').addClass('selected');

                viewCollections(collectionId);
            }
        },
        error: function (response) {
            isUpdatingModal.remove();
            handleApiError(response);
        }
    });
}
