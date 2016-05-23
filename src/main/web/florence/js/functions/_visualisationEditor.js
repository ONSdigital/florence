/**
 * Editor screen for uploading visualisations
 * @param collectionId
 * @param data
 */

function visualisationEditor(collectionId, data, collectionData) {
    var path = Florence.globalVars.pagePath,
        setActiveTab, getActiveTab;

    // Active tab
    $(".edit-accordion").on('accordionactivate', function() {
        setActiveTab = $(".edit-accordion").accordion("option", "active");
        if (setActiveTab !== false) {
            Florence.globalVars.activeTab = setActiveTab;
        }
    });
    getActiveTab = Florence.globalVars.activeTab;
    accordion(getActiveTab);
    getLastPosition();

    // Submit new ZIP file
    bindZipSubmit();

    // Edit existing ZIP file
    $('#edit-vis').on('submit', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        // Refresh visualisations tab but show 'submit ZIP' option
        var tempData = data;
        tempData.zipTitle = "";
        var html = templates.workEditVisualisation(tempData);
        $('.workspace-menu').html(html);
        bindZipSubmit();

        // Set visualisation tab to active
        accordion(1);
    });

    // Bind save buttons
    var editNav = $('.edit-nav');
    editNav.off(); // remove any existing event handlers.

    editNav.on('click', '.btn-edit-save', function () {
        //updateContent(collectionId, data.uri, JSON.stringify(data), true);
        var indexPage = $('#filenames').val();
        data['indexPage'] = indexPage;
        
        save();
    });

    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
        saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data), true);
    });

    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
        saveAndReviewContent(collectionId, data.uri, JSON.stringify(data), true);
    });

    function bindZipSubmit() {
        // Upload ZIP file
        $('#upload-vis').on('submit', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            var formdata = new FormData($(this)[0]),
                file = this[0].files[0];

            if (!$('#input-vis')) {
                sweetAlert("Please choose a file before submitting");
                return false;
            }

            if (!file.name.match(/\.zip$/)) {
                sweetAlert("Incorrect file format", "You are only allowed to upload ZIP files", "warning")
            } else {
                var fileNameNoSpace = file.name.replace(/[^a-zA-Z0-9\.]/g, "").toLowerCase();
                var uniqueIdNoSpace = data.uid.replace(/[^a-zA-Z0-9\.]/g, "").toLowerCase();
                var contentUri = "/visualisations/" + uniqueIdNoSpace + "/content";
                var uriUpload = contentUri + "/" + fileNameNoSpace;
                var safeUriUpload = checkPathSlashes(uriUpload);

                deleteAndUploadFile(
                    safeUriUpload, contentUri, formdata,
                    success = function() {
                        unpackZip(safeUriUpload,
                            success = function() {

                                // On unpack of Zip refresh the reload editor and preview
                                refreshPreview(path);
                                loadPageDataIntoEditor(path, collectionId);
                            }
                        );
                    }
                )
            }

        });
    }

    function deleteAndUploadFile(path, contentUri, formData, success) {
         $.ajax({
           url: "/zebedee/DataVisualisationZip/" + Florence.collection.id + "?zipPath=" + contentUri,
           type: 'DELETE',
           async: false,
           cache: false,
           contentType: false,
           processData: false,
           success: function (response) {
                uploadFile(path, formData, success);
           },
           error: function(response) {
                handleApiError(response);
           }
         });
    }

    function uploadFile(path, formData, success) {
        // Send zip file to zebedee
        $.ajax({
            url: "/zebedee/content/" + Florence.collection.id + "?uri=" + path,
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                success(response);
            },
            error: function(response) {
                handleApiError(response);
            }
        });
    }

    function unpackZip(zipPath, success, error) {
        // Unpack contents of ZIP
        console.log("Unpack: " + zipPath);
        var url = "/zebedee/DataVisualisationZip/" + Florence.collection.id + "?zipPath=" + zipPath;

        $.ajax({
            url: url,
            contentType: 'application/json',
            type: 'POST',
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

    function save() {
        putContent(collectionId, data.uri, JSON.stringify(data),
            success = function () {
                Florence.Editor.isDirty = false;
                refreshPreview(path);
                loadPageDataIntoEditor(data.uri, collectionId);
            },
            error = function (response) {
                if (response.status === 409) {
                    sweetAlert("Cannot edit this page", "It is already part of another collection.");
                } else {
                    handleApiError(response);
                }
            },
            true
        );
    }
}
