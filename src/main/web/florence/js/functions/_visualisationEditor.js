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

    // onIframeLoad(function(event) {
    //     if (event.data == "load") {
    //         debugger;
    //         console.log('sup');
    //         event.stopImmediatePropagation();
    //         return false;
    //     }
    // });

    // Add select to display all HTML files in ZIP
    var $fileSelectHtml = $("<div class='select-wrap' id='select-vis-wrapper'><select class='browser-location' id='select-vis-preview'></select></div>"),
        selectOptions = ["<option value=''>-- Select an HTML file to preview --</option>"],
        $selectWrapper = $('#select-vis-wrapper');

    for (i = 0; i < data.filenames.length; i++) {
        selectOptions.push("<option value='" + data.filenames[i] + "'>" + data.filenames[i] + "</option>")
    }
    // $fileSelectHtml.find('select').append("<option value=''>-- Select an HTML file --</option><option>" + (data.filenames).join('</option><option>') + "</option>");
    if ($selectWrapper.length) {
        $selectWrapper.remove();
    }
    $fileSelectHtml.find('select').append(selectOptions.join(''));
    $('#browser-location').remove();
    $('.addressbar').append($fileSelectHtml);

    // Bind to new select's change and toggle preview to selected HTML file
    $('#select-vis-preview').change(function() {
        refreshVisPreview("/" + $(this).val());
    });

    // Completely reload browse screen if
    // $('#browse').click(function() {
    //    loadBrowseScreen(collectionId);
    // });

    // Submit new ZIP file
    bindZipSubmit();

    // Edit existing ZIP file
    // $('#edit-vis').on('submit', function (e) {
    //     e.preventDefault();
    //     e.stopImmediatePropagation();
    //
    //     // Refresh visualisations tab but show 'submit ZIP' option
    //     // var tempData = data;
    //     // tempData.zipTitle = "";
    //     // var html = templates.workEditVisualisation(tempData);
    //     // $('.workspace-menu').html(html);
    //     // bindZipSubmit();
    //
    //     // Set visualisation tab to active
    //     accordion(1);
    // });

    // TODO possibly re-use this for viewing different HTML files
    // Listen to change of index page input and refresh preview to show new index page
    // $indexSelect.change(function () {
    //     refreshVisPreview($indexSelect.val());
    // });

    // Bind file save to the change event of the file input
    $fileInput.on('change', function() {
        var fileTitle = ($(this).val()).split('\\').pop();

        data.zipTitle = fileTitle;

        $fileForm.submit();
    });

    // Bind save buttons
    var editNav = $('.edit-nav');
    editNav.off(); // remove any existing event handlers.

    editNav.on('click', '.btn-edit-save', function () {

        //TODO delete once babbage refactored to not use these
        // var indexPage = $('#filenames').val();
        // data['indexPage'] = indexPage;

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

            if (!file.name.match(/\.zip$/)) {
                sweetAlert("Incorrect file format", "You are only allowed to upload ZIP files", "warning")
            } else {
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
            }

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
