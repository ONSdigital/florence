function saveAndReviewContent(collectionId, path, content, recursive, redirectToPath) {

    if (!recursive) {
        recursive = false;
    }

    putContent(collectionId, path, content,
        success = function () {
            Florence.Editor.isDirty = false;
            if (redirectToPath) {
                postReview(collectionId, path, recursive, redirectToPath);
            } else {
                postReview(collectionId, path, recursive);
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

function postReview(collectionId, path, recursive, redirectToPath) {
    var redirect = redirectToPath;
    var safePath = checkPathSlashes(path);
    if (safePath === '/') {
        safePath = '';          // edge case for home
    }

    if (Florence.globalVars.welsh) {
        var url = "/zebedee/review/" + collectionId + "?uri=" + safePath + "/data_cy.json";
    } else {
        var url = "/zebedee/review/" + collectionId + "?uri=" + safePath + "/data.json";
    }

    var url = url + '&recursive=' + recursive;

    // Open the file for editing
    $.ajax({
        url: url,
        dataType: 'json',
        contentType: 'application/json',
        type: 'POST',
        success: function () {
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
        error: function () {
            console.log('Error');
        }
    });
}
