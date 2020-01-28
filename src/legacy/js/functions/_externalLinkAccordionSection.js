/**
 * Manages links
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function getExternalLinkAccordionSectionLabel(idField) {
    switch(idField) {
        case "filterable-dataset":
            return "Try a new way to download data"
        case "link":
            return "You might also be interested in"
        default:
          return `Related ${idField}`
      }
}

function renderExternalLinkAccordionSection(collectionId, data, field, idField) {
    console.log(idField)
    var list = data[field];
    var dataTemplate = {list: list, idField: idField, label: getExternalLinkAccordionSectionLabel(idField)};
    var html = templates.editorLinks(dataTemplate);
    $('#' + idField).replaceWith(html);

    // Load
    $(data[field]).each(function (index) {

        $('#' + idField + '-edit_' + index).click(function () {
            var uri = data[field][index].uri;
            var title = data[field][index].title;
            if (idField === "filterable-dataset") {
                addFilteredDatasetLink('edit', uri, index);
                return;
            }
            addEditLinksModal('edit', uri, title, index);
        });

        // Delete
        $('#' + idField + '-delete_' + index).click(function () {
            swal({
                title: "Warning",
                text: "Are you sure you want to delete?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function (result) {
                if (result === true) {
                    var position = $(".workspace-edit").scrollTop();
                    Florence.globalVars.pagePos = position + 300;
                    $(this).parent().remove();
                    data[field].splice(index, 1);
                    saveLink(collectionId, data.uri, data, field, idField);
                    refreshPreview(data.uri);
                    swal({
                        title: "Deleted",
                        text: "This link has been deleted",
                        type: "success",
                        timer: 2000
                    });
                }
            });
        });
    });

    //Add
    $('#add-' + idField).click(function () {
        var position = $(".workspace-edit").scrollTop();
        Florence.globalVars.pagePos = position + 300;
        if (idField === "filterable-dataset") {
            addFilteredDatasetLink();
            return;
        }
        addEditLinksModal();
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

    function saveLink(collectionId, path, data, field, idField) {
        putContent(collectionId, path, JSON.stringify(data),
            success = function () {
                Florence.Editor.isDirty = false;
                renderExternalLinkAccordionSection(collectionId, data, field, idField);
                refreshPreview(data.uri);
            },
            error = function (response) {
                if (response.status === 400) {
                    sweetAlert("Cannot edit this page", "It is already part of another collection.");
                }
                else {
                    handleApiError(response);
                }
            }
        );
    }

    function addEditLinksModal(mode, uri, title, index) {

        var uri = uri;
        var title = title;

        if (!data[field]) {
            data[field] = [];
        }

        var linkData = {title: title, uri: uri, showTitleField: true};

        var modal = templates.linkExternalModal(linkData);
        $('.workspace-menu').append(modal);

        $('#uri-input').change(function () {
            uri = $('#uri-input').val();
        });
        $('#uri-title').change(function () {
            title = $('#uri-title').val();
        });

        $('.btn-uri-get').off().click(function () {
            if (!title) {
                sweetAlert('You need to enter a title to continue');
            } else if (uri.match(/\s/g)) {
                sweetAlert('Your link cannot contain spaces');
            } else {
                if (mode == 'edit') {
                    data[field][index].uri = uri;
                    data[field][index].title = title;
                } else {
                    data[field].push({uri: uri, title: title});
                }
                saveLink(collectionId, data.uri, data, field, idField);
                $('.modal').remove();
            }
        });

        $('.btn-uri-cancel').off().click(function () {
            $('.modal').remove();
        });

    }

    function addFilteredDatasetLink(mode, uri, index) {
        var uri = uri;

        if (!data[field]) {
            data[field] = [];
        }

        var linkData = {uri: uri, showTitleField: false};
        var modal = templates.linkExternalModal(linkData);
        $('.workspace-menu').append(modal);

        $('#uri-input').change(function () {
            uri = $('#uri-input').val();
        });

        $('.btn-uri-get').off().click(function () {
            try {
                var parsedURL = new URL(uri)
            }
            catch(error) {
                sweetAlert("That doesn't look like a valid URL. Please include all parts of the URL e.g. 'https://', 'www', etc.");
                console.error("Error parsing URL \n", error)
                return;
            }
            if (mode == 'edit') {
                data[field][index].uri = parsedURL.pathname;
            } else {
                data[field].push({uri: parsedURL.pathname});
            }
            saveLink(collectionId, data.uri, data, field, idField);
            $('.modal').remove();
        });

        $('.btn-uri-cancel').off().click(function () {
            $('.modal').remove();
        });
    }
}

