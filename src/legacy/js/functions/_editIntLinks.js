/**
 * Manages related data
 * @param collectionId
 * @param data
 * @param templateData
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editIntAndExtLinks(collectionId, data, templateData, field, idField) {
    $(data[field]).each(function (index, path) {
        if (!this.title) {
            templateData[field][index] = (function () {
                resolveInternalLinksTitle(collectionId, data, templateData, field, idField, index)
            })();
        } else {
            templateData[field][index].description = {};
            templateData[field][index].description.title = templateData[field][index].title;
        }
    });
    var list = templateData[field];
    var dataTemplate = createRelatedItemAccordionSectionViewModel(idField, list, data);
    var html = templates.editorRelated(dataTemplate);
    $('#' + idField).replaceWith(html);
    initialiseLinks(collectionId, data, templateData, field, idField);
    $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);
}

function refreshLinks(collectionId, data, templateData, field, idField) {
    var list = templateData[field];
    var dataTemplate = createRelatedItemAccordionSectionViewModel(idField, list, data);
    var html = templates.editorRelated(dataTemplate);
    $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
    initialiseLinks(collectionId, data, templateData, field, idField);
}

function initialiseLinks(collectionId, data, templateData, field, idField) {
    // Load
    $(data[field]).each(function (index) {
        // Delete
        $('#' + idField + '-delete_' + index).click(function () {
            swal({
                title: "Warning",
                text: "Are you sure you want to delete this link?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function (result) {
                if (result === true) {
                    swal({
                        title: "Deleted",
                        text: "This " + idField + " has been deleted",
                        type: "success",
                        timer: 2000
                    });
                    var position = $(".workspace-edit").scrollTop();
                    Florence.globalVars.pagePos = position;
                    $(this).parent().remove();
                    data[field].splice(index, 1);
                    templateData[field].splice(index, 1);
                    putContent(collectionId, data.uri, JSON.stringify(data),
                        success = function () {
                            Florence.Editor.isDirty = false;
                            refreshPreview(data.uri);
                            refreshLinks(collectionId, data, templateData, field, idField);
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
            });
        });
    });

    //Add
    //$('#add-' + idField).off().one('click', function () {
    $('#add-link').off().click(function () {
        //add a modal to select an option for internal or external
        var position = $(".workspace-edit").scrollTop();
        Florence.globalVars.pagePos = position;
        var modalIntOrExt = templates.linkModal;
        $('.workspace-menu').append(modalIntOrExt);
        //They choose internal
        $('#internal-link').click(function () {
            if (!data[field]) {
                data[field] = [];
            }

            //Florence.globalVars.pagePos = position;
            var modal = templates.relatedModal;
            $('.modal').remove();
            $('.workspace-menu').append(modal);
            $('.modal-box input[type=text]').focus();

            //Modal click events
            $('.btn-uri-cancel').off().one('click', function () {
                $('.modal').remove();
            });

            $('.btn-uri-get').off().click(function () {
                var pastedUrl = $('#uri-input').val();
                if (pastedUrl === "") {
                    sweetAlert("This field cannot be empty. Please paste a valid url address");
                } else {
                    var dataUrl = checkPathParsed(pastedUrl);
                    if (dataUrl === "") {    //special case for home page
                        dataUrl = "/";
                    }
                    data[field].push({uri: dataUrl});
                    templateData[field].push({uri: dataUrl});
                    saveExternalLink(collectionId, data.uri, data, templateData, field, idField);
                    $('.modal').remove();
                }
            });

            $('.btn-uri-browse').off().one('click', function () {
                var iframeEvent = document.getElementById('iframe').contentWindow;
                iframeEvent.removeEventListener('click', Florence.Handler, true);
                createWorkspace(data.uri, collectionId, '', null , true);
                $('.modal').remove();

                //Disable the editor
                $('body').append(
                    "<div class='col col--5 panel modal-background'></div>"
                );

                //Add buttons to iframe window
                var iframeNav = templates.iframeNav();
                $(iframeNav).hide().appendTo('.browser').fadeIn(600);

                //Take iframe window to homepage/root
                $('#iframe').attr('src', '/');

                $('.btn-browse-cancel').off().one('click', function () {
                    createWorkspace(data.uri, collectionId, 'edit');
                    $('.iframe-nav').remove();
                    $('.modal-background').remove();
                });

                //Remove added markup if user navigates away from editor screen
                $('a:not(.btn-browse-get)').click(function () {
                    $('.iframe-nav').remove();
                    $('.modal-background').remove();
                });

                $('.btn-browse-get').off().one('click', function () {
                    var dataUrl = getPathNameTrimLast();
                    if (dataUrl === "") {   //special case for home page
                        dataUrl = "/";
                    }
                    var latestUrl;
                    //if you wanted to add latest automatically uncomment these lines
                    if (dataUrl.match(/\/articles\//) || dataUrl.match(/\/bulletins\//)) {
                        swal({
                            title: "Warning",
                            text: "Would you like to always show the latest release of this document?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Yes",
                            cancelButtonText: "No",
                            closeOnConfirm: true
                        }, function (result) {
                            if (result === true) {
                                var tempUrl = dataUrl.split('/');
                                tempUrl.pop();
                                tempUrl.push('latest');
                                latestUrl = tempUrl.join('/');
                            } else {
                                latestUrl = dataUrl;
                            }
                            $('.iframe-nav').remove();
                            $('.modal-background').remove();
                            data[field].push({uri: latestUrl});
                            templateData[field].push({uri: latestUrl});
                            saveExternalLink(collectionId, data.uri, data, templateData, field, idField);
                        });
                    } else {
                        latestUrl = dataUrl;
                        $('.iframe-nav').remove();
                        $('.modal-background').remove();
                        data[field].push({uri: latestUrl});
                        templateData[field].push({uri: latestUrl});
                        saveExternalLink(collectionId, data.uri, data, templateData, field, idField);
                    }
                });
            });
        });

        //They choose external
        $('#external-link').click(function () {
            if (!data[field]) {
                data[field] = [];
            }
            var linkData = {showTitleField: true};
            var modal = templates.linkExternalModal(linkData);
            var uri, title;
            $('.modal').remove();
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
                }
                else {
                    data[field].push({uri: uri, title: title});
                    saveExternalLink(collectionId, data.uri, data, templateData, field, idField);
                    $('.modal').remove();
                }
            });
            $('.btn-uri-cancel').off().click(function () {
                $('.modal').remove();
            });
        });
        //They cancel
        $('.btn-uri-cancel').off().click(function () {
            $('.modal').remove();
        });
    });

    // Make sections sortable
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

function resolveInternalLinksTitle(collectionId, data, templateData, field, idField, index) {
    getPageDataTitle(collectionId, templateData[field][index].uri,
        success = function (response) {
            templateData[field][index] = response;
            templateData[field][index].description = {};
            templateData[field][index].description.title = response.title;
            if (response.edition) {
                templateData[field][index].description.edition = response.edition;
            }
            refreshLinks(collectionId, data, templateData, field, idField);
        },
        error = function () {
            sweetAlert("Error", field + ' address: ' + templateData[field][index].uri + ' is not found.', "error");
        }
    );
}


function saveExternalLink(collectionId, path, data, templateData, field, idField) {
    putContent(collectionId, path, JSON.stringify(data),
        success = function (response) {
            Florence.Editor.isDirty = false;
            refreshLinks(collectionId, data, templateData, field, idField);
            createWorkspace(data.uri, collectionId, 'edit');
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

