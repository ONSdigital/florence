/**
 * Manage files associated with datasets. When uploading a file creates a new dataset
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template (has to be 'edition')
 */

function addDataset(collectionId, data, field, idField) {
    var downloadExtensions, pageType;
    var uriUpload;
    var lastIndex;
    if (data[field]) {
        lastIndex = data[field].length;
    } else {
        lastIndex = 0;
    }
    var uploadedNotSaved = {uploaded: false, saved: false, editionUri: ""};
    $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);

    //Add
    if (data.timeseries) {
        downloadExtensions = /\.csdb$|\.csv$/;
        pageType = 'timeseries_dataset';
    } else {
        downloadExtensions = /\.csv$|.xls$|.xlsx$|.zip$/;
        pageType = 'dataset';
    }

    $('#add-' + idField).one('click', function () {
        // check that a timeseries dataset has max one file
        if (data.timeseries && (data[field] && data[field].length < 1) || !data.timeseries) {
            var position = $(".workspace-edit").scrollTop();
            Florence.globalVars.pagePos = position + 200;

            $('#sortable-' + idField).append(
                '<div id="' + lastIndex + '" class="edit-section__item">' +
                '  <form id="UploadForm">' +
                '    <textarea class="auto-size" placeholder="Period (E.g. 2015, August to December 2010, etc." type="text" id="edition"></textarea>' +
                '    <textarea class="auto-size" placeholder="Label (E.g. Final, Revised, etc.)" type="text" id="version"></textarea>' +
                '    <input type="file" title="Select a file and click Submit" name="files">' +
                '    <div class="dataset-buttons">' +
                '    <button type="submit" form="UploadForm" value="submit">Submit</button>' +
                '    <button class="btn-page-cancel" id="file-cancel">Cancel</button>' +
                //'    <button class="btn-dataset-autocsdb" id="no-file">Auto CSDB</button>' +
                '    </div>' +
                '  </form>' +
                '  <div id="response"></div>' +
                '  <ul id="list"></ul>' +
                '</div>');
            if (!data.timeseries) {
                $('#no-file').remove();
            }

            $('#file-cancel').one('click', function (e) {
                e.preventDefault();
                $('#' + lastIndex).remove();
                //Check files uploaded and delete them
                if (uploadedNotSaved.uploaded === true) {
                    data[field].splice(-1, 1);
                    deleteContent(Florence.collection.id, uploadedNotSaved.editionUri,
                        onSuccess = function () {
                        },
                        onError = function (error) {
                            handleApiError(error);
                        }
                    );
                }
                addDataset(collectionId, data, 'datasets', 'edition');
            });

            $('#UploadForm').submit(function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                var formdata = new FormData();

                function showUploadedItem(source) {
                    $('#list').append(source);
                }

                var pageTitle = this[0].value;
                var pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

                var versionLabel = this[1].value;

                var file = this[2].files[0];
                if (!file) {
                    sweetAlert("Please select a file to upload");
                    return;
                }

                var fileNameNoSpace = file.name.replace(/[^a-zA-Z0-9\.]/g, "").toLowerCase();
                if (file.name.match(/\.csv$/)) {
                    fileNameNoSpace = 'upload-' + fileNameNoSpace;
                }
                uriUpload = data.uri + '/' + pageTitleTrimmed + '/' + fileNameNoSpace;
                var safeUriUpload = checkPathSlashes(uriUpload);

                if (data[field] && data[field].length > 0) {
                    $(data[field]).each(function (i, filesUploaded) {
                        if (filesUploaded.file === safeUriUpload || filesUploaded.file === fileNameNoSpace) {
                            sweetAlert('This file already exists');
                            $('#' + lastIndex).remove();
                            addDataset(collectionId, data, 'datasets', 'edition');
                            formdata = false;   // if not present the existing file was being overwritten
                            return;
                        }
                    });
                }

                if (!!file.name.match(downloadExtensions)) {
                    //showUploadedItem(fileNameNoSpace);
                    if (formdata) {
                        formdata.append("name", file);
                    }
                } else {
                    sweetAlert('This file type is not supported');
                    $('#' + lastIndex).remove();
                    addDataset(collectionId, data, 'datasets', 'edition');
                    return;
                }

                if (pageTitle.length < 4 || pageTitle.toLowerCase() === 'data') {
                    sweetAlert("This is not a valid file title");
                    return;
                }

                // check if edition already exists to prevent overwriting content
                if (formdata) {
                    var uriToCheck = checkPathSlashes(data.uri + "/" + this[0].value.replace(/[^a-zA-Z0-9\.]/g, "").toLowerCase())
                    fetch(uriToCheck, {credentials: 'include'}).then(function(response) {
                        if (response.ok) {
                            // content was found, return so as not to overwrite existing content and display an error
                            console.error(`It looks like there is already an edition with the title "${pageTitle}"`);
                            swal(`It looks like there is already an edition with the title "${pageTitle}"`);
                            return;
                        } 
                        submitform();
                        document.getElementById("response").innerHTML = "Uploading...";
                    })
                }

                function submitform() {
                    if (formdata) {
                        $.ajax({
                            url: "/zebedee/content/" + collectionId + "?uri=" + safeUriUpload,
                            type: 'POST',
                            data: formdata,
                            cache: false,
                            processData: false,
                            contentType: false,
                            success: function () {
                                document.getElementById("response").innerHTML = "File uploaded successfully";
                                if (!data[field]) {
                                    data[field] = [];
                                }
                                data[field].push({uri: data.uri + '/' + pageTitleTrimmed});
                                uploadedNotSaved.uploaded = true;
                                // create the dataset
                                loadT8EditionCreator(collectionId, data, pageType, pageTitle, fileNameNoSpace, versionLabel);
                                // on success save parent and child data
                            },
                            error: function(error) {
                                swal("There was an error uploading the file, please try again.")
                                console.error(error.status, error.statusText)
                            }
                        });
                    }
                }
            });

            $('#no-file').one('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                if (data.timeseries) {    // not necessary but for extra security
                    if (data.description.datasetId) {   // check for an id to link the csdb to
                        // on success save parent and child data
                        var pageTitle = $('#edition').val();
                        var pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
                        var fileNameNoSpace = data.description.datasetId + '.csdb';

                        var versionLabel = $('#version').val();
                        if (pageTitleTrimmed.length < 4 || pageTitleTrimmed === 'data') {
                            sweetAlert("This is not a valid file title");
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            $('#' + lastIndex).remove();
                            addDataset(collectionId, data, field, idField);
                        } else {
                            data[field].push({uri: data.uri + '/' + pageTitleTrimmed});
                            // create the dataset if there is not any
                            loadT8EditionCreator(collectionId, data, pageType, pageTitle, fileNameNoSpace, versionLabel);
                        }
                    } else {
                        sweetAlert("Warning!", "You need to add a dataset Id to match the CSDB.", "error");
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        $('#' + lastIndex).remove();
                        addDataset(collectionId, data, field, idField);
                    }
                } else {
                    sweetAlert("Oops!", "It looks like this is not a timeseries dataset.", "error");
                }
            });
        } else {
            sweetAlert("Warning!", "You can add only one file in a timeseries dataset.", "error");
        }
    });


    function sortable() {
        $('#sortable-' + idField).sortable({
            stop: function () {
                $('#' + idField + ' .edit-section__sortable-item--counter').each(function (index) {
                    $(this).empty().append(index + 1);
                });
            }
        });
    }

    sortable();
}

