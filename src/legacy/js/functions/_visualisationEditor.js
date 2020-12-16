/**
 * Editor screen for uploading visualisations
 * @param collectionId
 * @param data
 */

function visualisationEditor(collectionId, data) {
    var path = data.uri,
        $fileInput = $('#input-vis'),
        $fileForm = $('#upload-vis'),
        i, setActiveTab, getActiveTab;

    // Active tab
    $(".edit-accordion").on('accordionactivate', function () {
        setActiveTab = $(".edit-accordion").accordion("option", "active");
        if (setActiveTab !== false) {
            Florence.globalVars.activeTab = setActiveTab;
        }
    });
    getActiveTab = Florence.globalVars.activeTab;
    accordion(getActiveTab);
    getLastPosition();

    // Update hidden select to display all HTML files in ZIP
    var selectOptions = ["<option value=''>-- Select an HTML file to preview --</option>"],
        $selectWrapper = $('#select-vis-wrapper');

    if (data.filenames.length > 0) {
        for (i = 0; i < data.filenames.length; i++) {
            if (i === 0) {
                selectOptions.push("<option value='" + data.filenames[i] + "' selected>" + data.filenames[i] + "</option>")
            } else {
                selectOptions.push("<option value='" + data.filenames[i] + "'>" + data.filenames[i] + "</option>")
            }
        }
        refreshVisPreview("/" + data.filenames[0])
    }

    $selectWrapper.find('select').empty().append(selectOptions.join(''));
    $selectWrapper.show();
    $('#browser-location').hide();

    // Bind to select's change and toggle preview to selected HTML file
    $('#select-vis-preview').change(function() {
        refreshVisPreview("/" + $(this).val());
    });

    // Hide preview select element and re-display the browser URL when navigating away from the visualisation
    $('#browse').one('click', function() {
        $selectWrapper.hide();
        $('#browser-location').show();
        var browseURL = data.uri;
        $('#iframe').attr('src', Florence.babbageBaseUrl + browseURL);
        updateBrowserURL(browseURL);
    });

    // Submit new ZIP file
    bindZipSubmit();

    // Bind file save to the change event of the file input
    $fileInput.on('change', function() {
        data.zipTitle = ($(this).val()).split('\\').pop();
        $fileForm.submit();
    });

    // Bind save buttons
    var editNav = $('.edit-nav');
    editNav.off(); // remove any existing event handlers.

    editNav.on('click', '.btn-edit-save', function () {
        save();
    });

    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
        saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data), true);
    });

    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
        saveAndReviewContent(collectionId, data.uri, JSON.stringify(data), true);
    });


    /* FUNCTIONS */
    function bindZipSubmit() {
        // Upload ZIP file
        $('#upload-vis').on('submit', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            var formdata = new FormData($(this)[0]),
                file = this[0].files[0];

            if (!$('#input-vis')) {
                sweetAlert("Please choose a file before submitting");
                return false;
            }

            $('.input__file').attr('data-file-title', 'File uploading ...');

            var fileNameNoSpace = file.name.replace(/[^a-zA-Z0-9\.]/g, "").toLowerCase();
            var uniqueIdNoSpace = data.uid.replace(/[^a-zA-Z0-9\.]/g, "").toLowerCase();
            var contentUri = "/visualisations/" + uniqueIdNoSpace + "/content";
            var uriUpload = contentUri + "/" + fileNameNoSpace;
            var safeUriUpload = checkPathSlashes(uriUpload);

            path = "/visualisations/" + uniqueIdNoSpace;

            deleteAndUploadFile(
                safeUriUpload, contentUri, formdata,
                success = function () {
                    unpackZip(safeUriUpload,
                        success = function () {

                            // On unpack of Zip refresh the reload editor and preview
                            loadPageDataIntoEditor(path, collectionId);
                        }
                    );
                }
            )

        });
    }

    // Refresh preview (don't use global refreshPreview function because we want do other functions at the same time when selecting different HTML files)
    function refreshVisPreview(url) {
        document.getElementById('iframe').contentWindow.location.href = Florence.babbageBaseUrl + path + url;
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
            error: function (response) {
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
            error: function (response) {
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
                // refreshVisPreview();
                // refreshPreview();
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
