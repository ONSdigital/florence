/**
 * Manage files associated with datasets. When uploading a file creates a new dataset
 * @param collectionId
 * @param data
 * @param field - JSON data key ('versions')
 * @param idField - HTML id for the template ('version' or 'correction')
 */

function editDatasetVersion(collectionId, data, field, idField) {
    var downloadExtensions, uriUpload, file;
    var lastIndex;
    if (data[field]) {
        lastIndex = data[field].length;
    } else {
        lastIndex = 0;
        data[field] = [];
    }
    var uploadedNotSaved = {uploaded: false, saved: false, fileUrl: "", oldLabel: data.description.versionLabel};
    $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);
    //Add
    if (data.type === 'timeseries_dataset') {
        downloadExtensions = /\.csdb$|\.csv$/;
    } else if (data.type === 'dataset') {
        downloadExtensions = /\.csv$|.xls$|.xlsx$|.zip$/;
    }

    var ajaxRequest = [];
    var templateData = $.extend(true, {}, data);
    $(templateData[field]).each(function (index, version) {
        var dfd = $.Deferred();
        if (version.correctionNotice) {
            templateData[field][index].type = true;
        } else {
            templateData[field][index].type = false;
        }
        templateData[field][index].label = version.label;
        dfd.resolve();
        ajaxRequest.push(dfd);
    });

    $.when.apply($, ajaxRequest).then(function () {
        var html = templates.editorCorrection({idField: idField});
        $('#' + idField).replaceWith(html);
        initialiseDatasetVersion(collectionId, data, templateData, field, idField);
    });

    $("#add-" + idField).one('click', function () {
        addTheVersion();
    });

    function addTheVersion() {
        var position = $(".workspace-edit").scrollTop();
        Florence.globalVars.pagePos = position + 200;

        // todo: Move this HTML into a handlebars template.
        $('#' + idField + '-section').append(
            '<div id="' + lastIndex + '" class="edit-section__item">' +
            '  <form id="UploadForm">' +
            '    <textarea class="auto-size" type="text" placeholder="Add a label here (E.g. Revised, Final, etc" id="label"></textarea>' +
            '    <input type="file" title="Select a file and click Submit" name="files">' +
            '    <div class="dataset-buttons">' +
            '    <button class="btn btn--primary" type="submit" form="UploadForm" value="submit">Submit</button>' +
            '    <button class="btn btn-page-cancel" id="file-cancel">Cancel</button>' +
            //'    <button class="btn-dataset-autocsdb" id="no-file">Auto CSDB</button>' +
            '    </div>' +
            '  </form>' +
            '  <div id="response"></div>' +
            '  <ul id="list"></ul>' +
            '</div>');

        if (data.type === 'dataset') {
            $('#no-file').remove();
        }

        // The label field is not used for corrections, just use existing version label.
        if (idField === "correction") {
            var $versionLabel = $('#UploadForm #label');
            $versionLabel.text(uploadedNotSaved.oldLabel);
            $versionLabel.hide();
        }

        $('#file-cancel').one('click', function (e) {
            e.preventDefault();
            $('#' + lastIndex).remove();
            if (uploadedNotSaved.uploaded === true && uploadedNotSaved.saved === false) {
                data.description.versionLabel = uploadedNotSaved.oldLabel;
                deleteContent(collectionId, uploadedNotSaved.fileUrl,
                    onSuccess = function () {
                    },
                    onError = function (error) {
                        handleApiError(error);
                    }
                );
            }
            initialiseDatasetVersion(collectionId, data, templateData, field, idField);
        });

        $('#UploadForm').one('submit', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            var formdata = new FormData();

            function showUploadedItem(source) {
                $('#list').append(source);
            }

            var versionLabel = this[0].value;
            file = this[1].files[0];

            // Check that a file has been uploaded
            if (!file) {
                sweetAlert('Please select a file to upload');
                return;
            }

            if (data.type == "timeseries_dataset") {
                // Validate that the file name matches the datasetId (which is stored in the parent dataset_landing page
                var parentUrl = getParentPage(data.uri);

                fetch(parentUrl + '/data', {credentials: 'include'}).then(function(response) {
                    return response.json();
                }).then(function(parentData) {
                    var datasetId = (parentData.description.datasetId).toUpperCase(),
                        downloadTitle = ((file.name).split('.').shift()).toUpperCase();
                    if (!datasetId) {
                        // Throw error if the parent page has no dataset ID
                        sweetAlert({
                            title: "Dataset missing an ID",
                            text: "Please go to the parent page and give the dataset an ID",
                            type: "warning"
                        });
                    } else if (datasetId !== downloadTitle) {
                        // Throw error to user if file name and dataset ID don't match
                        sweetAlert({
                            title: "Warning",
                            text: "CSDB filename must match the dataset's ID",
                            type: "warning"
                        });
                    } else {
                        saveSubmittedFile();
                    }
                }).catch(function(error) {
                    console.log("Error getting timeseries dataset parent data... ", error);
                });
            } else {
                // Not a timeseries_dataset, so continue with saving file as normal
                saveSubmittedFile();
            }

            async function saveSubmittedFile() {
                var responseElem = document.getElementById("response");
                responseElem.innerHTML = "Uploading . . .";

                var fileNameNoSpace = file.name.replace(/[^a-zA-Z0-9\.]/g, "").toLowerCase();
                if (file.name.match(/\.csv$/)) {
                    fileNameNoSpace = 'upload-' + fileNameNoSpace;
                }
                uriUpload = data.uri + '/' + fileNameNoSpace;
                var safeUriUpload = checkPathSlashes(uriUpload);

                if (!!file.name.match(downloadExtensions)) {
                    showUploadedItem(fileNameNoSpace);
                    if (formdata) {
                        formdata.append("name", file);
                    }
                    $('#list').empty();
                } else {
                    sweetAlert({
                        text: 'This file type is not supported',
                        type: "warning"
                    });
                    responseElem.innerHTML = "";
                    $('#' + lastIndex).remove();
                    editDatasetVersion(collectionId, data, field, idField);
                    return;
                }

                if (formdata) {
                    saveNewCorrection(collectionId, data.uri,
                        function (response) {
                            $.ajax({
                                url: "/zebedee/content/" + collectionId + "?uri=" + safeUriUpload,
                                type: 'POST',
                                data: formdata,
                                cache: false,
                                processData: false,
                                contentType: false,
                                success: function () {
                                    uploadedNotSaved.uploaded = true;
                                    uploadedNotSaved.fileUrl = safeUriUpload;
                                    var tmpDate = Florence.collection.publishDate ? Florence.collection.publishDate : (new Date()).toISOString();
                                    if (idField === "correction") {
                                        data[field].push({
                                            correctionNotice: " ",
                                            updateDate: tmpDate,
                                            uri: response,
                                            label: versionLabel
                                        });
                                        // Enter a notice
                                        var editedSectionValue = {title: 'Correction notice', markdown: ''};
                                        var saveContent = function (updatedContent) {
                                            data[field][data[field].length - 1].correctionNotice = updatedContent;
                                            data.downloads = [{file: fileNameNoSpace}];
                                            uploadedNotSaved.saved = true;
                                            $("#" + idField).find('.edit-section__content').prepend('<div id="sortable-' + idField + '" class="edit-section__sortable">');
                                            $("#" + idField + '-section').remove();
                                            saveDatasetVersion(collectionId, data.uri, data, field, idField);
                                        };
                                        loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
                                    } else {
                                        data[field].push({
                                            correctionNotice: "",
                                            updateDate: tmpDate,
                                            uri: response,
                                            label: versionLabel
                                        });
                                        data.description.versionLabel = versionLabel; // only update the version label for versions not corrections.
                                        data.downloads = [{file: fileNameNoSpace}];
                                        uploadedNotSaved.saved = true;
                                        $("#" + idField).find('.edit-section__content').prepend('<div id="sortable-' + idField + '" class="edit-section__sortable">');
                                        $("#" + idField + '-section').remove();
                                        saveDatasetVersion(collectionId, data.uri, data, field, idField);
                                    }
                                },
                                error: function (response) {
                                    console.log("Error in uploading this file");
                                    handleApiError(response);
                                }
                            });
                        }, function (response) {
                            if (response.status === 409) {
                                sweetAlert("You can add only one " + idField + " before publishing.");
                                responseElem.innerHTML = "";
                            }
                            else if (response.status === 404) {
                                sweetAlert("You can only add " + idField + "s to content that has been published.");
                                responseElem.innerHTML = "";
                            }
                            else {
                                responseElem.innerHTML = "";
                                handleApiError(response);
                            }
                        }
                    );
                }
            }
        });

        $('#no-file').one('click', function (e) {
            e.preventDefault();
            // extra security check
            if (data.type === 'timeseries_dataset') {
                var versionLabel = $('#UploadForm #label').val();
                uploadedNotSaved.uploaded = false;

                // create the new version/correction
                saveNewCorrection(collectionId, data.uri,
                    function (response) {
                        var tmpDate = Florence.collection.publishDate ? Florence.collection.publishDate : (new Date()).toISOString();
                        if (idField === "correction") {
                            data[field].push({
                                correctionNotice: " ",
                                updateDate: tmpDate,
                                uri: response,
                                label: versionLabel
                            });
                            // Enter a notice
                            var editedSectionValue = {title: 'Correction notice', markdown: ''};
                            var saveContent = function (updatedContent) {
                                data[field][data[field].length - 1].correctionNotice = updatedContent;
                                //data.downloads = [{file: fileNameNoSpace}];    // not necessary as zebedee will have a CSDB file
                                uploadedNotSaved.saved = true;
                                $("#" + idField).find('.edit-section__content').prepend('<div id="sortable-' + idField + '" class="edit-section__sortable">');
                                $("#" + idField + '-section').remove();
                                saveDatasetVersion(collectionId, data.uri, data, field, idField);
                            };
                            loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
                        } else {
                            data[field].push({
                                correctionNotice: "",
                                updateDate: tmpDate,
                                uri: response,
                                label: versionLabel
                            });
                            data.description.versionLabel = versionLabel; // only update the version label for versions not corrections.
                            //data.downloads = [{file: fileNameNoSpace}];    // not necessary as zebedee will have a CSDB file
                            uploadedNotSaved.saved = true;
                            $("#" + idField).find('.edit-section__content').prepend('<div id="sortable-' + idField + '" class="edit-section__sortable">');
                            $("#" + idField + '-section').remove();
                            saveDatasetVersion(collectionId, data.uri, data, field, idField);
                        }
                    }, function (response) {
                        if (response.status === 409) {
                            sweetAlert("You can add only one " + idField + " before publishing.");
                            deleteContent(collectionId, uploadedNotSaved.fileUrl);
                        }
                        else if (response.status === 404) {
                            sweetAlert("You can only add " + idField + "s to content that has been published.");
                            deleteContent(collectionId, uploadedNotSaved.fileUrl);
                        }
                        else {
                            handleApiError(response);
                        }
                    }
                );
            } else {
                sweetAlert("Oops!", "It looks like this is not a timeseries dataset.", "error");
            }
        });
    }
}

function refreshDatasetVersion(collectionId, data, field, idField) {
    var ajaxRequest = [];
    var templateData = $.extend(true, {}, data);
    $(templateData[field]).each(function (index, version) {
        var dfd = $.Deferred();
        if (version.correctionNotice) {
            templateData[field][index].type = true;
        } else {
            templateData[field][index].type = false;
        }
        templateData[field][index].label = version.label;
        dfd.resolve();
        ajaxRequest.push(dfd);
    });

    $.when.apply($, ajaxRequest).then(function () {
        initialiseDatasetVersion(collectionId, data, templateData, field, idField);
    });

}

function initialiseDatasetVersion(collectionId, data, templateData, field, idField) {
    // Load
    var list = templateData[field];
    var correction;
    if (idField === 'correction') {
        correction = true;
    } else {
        correction = false;
    }
    var dataTemplate = {list: list, idField: idField, correction: correction};
    var html = templates.workEditT8VersionList(dataTemplate);
    $('#sortable-' + idField).replaceWith(html);

    $(data[field]).each(function (index) {
        //dateTmp = data[field][index].updateDate;
        //var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
        //$('#' + idField + '-date_' + index).val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
        //  data[field][index].updateDate = new Date($('#' + idField + '-date_' + index).datepicker('getDate')).toISOString();
        //  saveDatasetVersion(collectionId, data.uri, data, field, idField);
        //});

        dateTmp = data[field][index].updateDate;

        var monthName = new Array();
        monthName[0] = "January";
        monthName[1] = "February";
        monthName[2] = "March";
        monthName[3] = "April";
        monthName[4] = "May";
        monthName[5] = "June";
        monthName[6] = "July";
        monthName[7] = "August";
        monthName[8] = "September";
        monthName[9] = "October";
        monthName[10] = "November";
        monthName[11] = "December";
        //var n = monthName[theDateTime.getMonth()];

        theDateTime = new Date(dateTmp);
        theYear = theDateTime.getFullYear();
        theMonth = monthName[theDateTime.getMonth()];
        theDay = addLeadingZero(theDateTime.getDate());
        theHours = addLeadingZero(theDateTime.getHours());
        theMinutes = addLeadingZero(theDateTime.getMinutes());
        //console.log(theHours +':'+ theMinutes);

        var dateTimeInputString = theDay + ' ' + theMonth + ' ' + theYear + ' ' + theHours + ':' + theMinutes;

        function addLeadingZero(number) {
            var number = '0' + number;
            number = number.slice(-2);
            return number;
        }

        $('#' + idField + '-date_' + index).val(dateTimeInputString).datetimepicker({
            dateFormat: 'dd MM yy',
            controlType: 'select',
            oneLine: true,
            timeFormat: 'HH:mm',
            onClose: function () {
                function isDonePressed() {
                    return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
                }

                if (isDonePressed()) {
                    data[field][index].updateDate = new Date($('#' + idField + '-date_' + index).datetimepicker('getDate')).toISOString();
                    console.log("Run save " + index);
                    saveDatasetVersion(collectionId, data.uri, data, field, idField);
                }
            }
        });

        if (idField === 'correction') {
            $('#' + idField + '-edit_' + index).click(function () {
                var markdown = data[field][index].correctionNotice;
                var editedSectionValue = {title: 'Correction notice', markdown: markdown};
                var saveContent = function (updatedContent) {
                    data[field][index].correctionNotice = updatedContent;
                    saveDatasetVersion(collectionId, data.uri, data, field, idField);
                };
                loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
            });
        }
        $('#' + idField + '-edit-label_' + index).click(function () {
            var markdown = data[field][index].label ? data[field][index].label : "";
            var editedSectionValue = {title: 'Label content', markdown: markdown};
            var saveContent = function (updatedContent) {
                data[field][index].label = updatedContent;
                if (index === data[field].length - 1) {
                    data.description.versionLabel = updatedContent;
                }
                saveDatasetVersion(collectionId, data.uri, data, field, idField);
            };
            loadMarkdownEditor(editedSectionValue, saveContent, data);
        });
        // Delete
        $('#' + idField + '-delete_' + index).click(function () {
            swal({
                title: "Warning",
                text: "This will revert all changes you have made in this file. Are you sure you want to delete this " + idField + "?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function (result) {
                if (result === true) {
                    swal({
                        title: "Deleted",
                        text: "This " + idField + " version has been deleted",
                        type: "success",
                        timer: 2000
                    });
                    var pathToDelete = data.uri;
                    var fileToDelete = pathToDelete + '/' + data.downloads[0].file;  //Saves always the latest
                    var uriToDelete = $('#' + idField + '-edition_' + index).attr(idField + '-url');
                    deleteUnpublishedVersion(collectionId, uriToDelete, function () {
                        var position = $(".workspace-edit").scrollTop();
                        Florence.globalVars.pagePos = position;
                        $('#' + idField + '-delete_' + index).parent().remove();
                        // delete uploaded file
                        deleteContent(collectionId, fileToDelete, function () {
                            console.log("File deleted");
                        }, function (error) {
                            if (error.status === 404) {
                                sweetAlert("There was no CSDB file to delete or this " + idField + " has been already published.");
                            }
                            else {
                                handleApiError(error);
                            }
                        });
                        // delete modified data.json and revert to published
                        deleteContent(collectionId, pathToDelete, function () {
                            loadPageDataIntoEditor(pathToDelete, collectionId);
                            refreshPreview(pathToDelete);
                        }, function (error) {
                            handleApiError(error);
                        });
                    }, function (response) {
                        if (response.status === 404) {
                            sweetAlert("You cannot delete a " + idField + " that has been published.");
                        }
                        else {
                            handleApiError(response);
                        }
                    });
                }
            });
        });
    });

}

function saveDatasetVersion(collectionId, path, data, field, idField) {

    putContent(collectionId, path, JSON.stringify(data),
        function () {
            Florence.Editor.isDirty = false;
            refreshDatasetVersion(collectionId, data, field, idField);
            refreshPreview(path);
        },
        function (response) {
            if (response.status === 400) {
                sweetAlert("Cannot edit this page", "It is already part of another collection.");
            }
            else {
                handleApiError(response);
            }
        }
    );
}

