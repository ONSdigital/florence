function releaseEditor(collectionId, data) {
    var setActiveTab, getActiveTab;
    var renameUri = false;
    var pageDataRequests = [];
    var pages = {};

    $(".edit-accordion").on('accordionactivate', function (event, ui) {
        setActiveTab = $(".edit-accordion").accordion("option", "active");
        if (setActiveTab !== false) {
            Florence.globalVars.activeTab = setActiveTab;
        }
    });

    getActiveTab = Florence.globalVars.activeTab;
    accordion(getActiveTab);
    getLastPosition();

    processCollection(collectionId, 'noSave');

    $("#title").on('input', function () {
        renameUri = true;
        data.description.title = $(this).val();
    });
    $("#provisionalDate").on('input', function () {
        data.description.provisionalDate = $(this).val();
    });
    var dateTmp = data.description.releaseDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'});
    if (!data.description.finalised) {
        $('.release-date').on('change', function () {
            var publishTime = parseInt($('#release-hour').val()) + parseInt($('#release-min').val());
            var toIsoDate = $('#releaseDate').datepicker("getDate");
            data.description.releaseDate = new Date(parseInt(new Date(toIsoDate).getTime()) + publishTime).toISOString();
        });
    } else {
        $('.release-date').on('change', function () {
            swal({
                title: "Warning",
                text: "You will need to add an explanation for this change. Are you sure you want to proceed?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Continue",
                cancelButtonText: "Cancel"
            }, function (result) {
                if (result === true) {
                    saveOldDate(collectionId, data, dateTmp);
                    var publishTime = parseInt($('#release-hour').val()) + parseInt($('#release-min').val());
                    var toIsoDate = $('#releaseDate').datepicker("getDate");
                    data.description.releaseDate = new Date(parseInt(new Date(toIsoDate).getTime()) + publishTime).toISOString();
                } else {
                    $('#releaseDate').val(dateTmpFormatted);
                }
            });
        });
    }

    var date = new Date(data.description.releaseDate);
    var hour = date.getHours();
    $('#release-hour').val(hour * 3600000);

    var minutes = date.getMinutes();
    $('#release-min').val(minutes * 60000);

    $("#nextRelease").on('input', function () {
        data.description.nextRelease = $(this).val();
        
    });
    if (!data.description.contact) {
        data.description.contact = {};
    }
    $("#contactName").on('input', function () {
        data.description.contact.name = $(this).val();
        
    });
    $("#contactEmail").on('input', function () {
        data.description.contact.email = $(this).val();
        
    });
    $("#contactTelephone").on('input', function () {
        data.description.contact.telephone = $(this).val();
        
    });
    $("#summary").on('input', function () {
        data.description.summary = $(this).val();
        
    });

    /* The checked attribute is a boolean attribute and the corresponding property 
    will be true if the attribute is present and has a value other than false */
    var checkBoxStatus = function (value) {
        if (value === "" || value === "false" || value === false) {
            return false;
        }
        return true;
    };

    // Gets status of checkbox and sets JSON to match
    $("#natStat-checkbox").prop('checked', checkBoxStatus(data.description.nationalStatistic)).click(function () {
        data.description.nationalStatistic = $("#natStat-checkbox").prop('checked');
    });

    $("#census-checkbox").prop('checked', data.description.survey ? true : false).click(function () {
        data.description.survey = $("#census-checkbox").prop('checked') ? 'census' : null;
    });

    $("#cancelled input[type='checkbox']").prop('checked', checkBoxStatus(data.description.cancelled)).click(function () {
        data.description.cancelled = $("#cancelled input[type='checkbox']").prop('checked');
        if (data.description.cancelled) {
            var editedSectionValue = {};
            editedSectionValue.title = "Please enter the reason for the cancellation";
            var saveContent = function (updatedContent) {
                data.description.cancellationNotice = [updatedContent];
                putContent(collectionId, data.uri, JSON.stringify(data),
                    success = function () {
                        Florence.Editor.isDirty = false;
                        loadPageDataIntoEditor(data.uri, collectionId);
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
            };
            loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
        } else {
            data.description.cancellationNotice = [];
        }
        
    });

    if (data.description.finalised) {
        $("#finalised input[type='checkbox']").prop('checked', checkBoxStatus(data.description.finalised)).click(function (e) {
            sweetAlert('You cannot change this field once it is finalised.');
            e.preventDefault();
        });
    } else {
        $("#finalised input[type='checkbox']").prop('checked', checkBoxStatus(data.description.finalised)).click(function () {
            swal({
                title: "Warning",
                text: "You will not be able reset the date to provisional once you've done this. Are you sure you want to proceed?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Continue",
                cancelButtonText: "Cancel"
            }, function (result) {
                if (result) {
                    data.description.finalised = $("#finalised input[type='checkbox']").prop('checked') ? true : false;
                    if (data.description.finalised) {
                        // remove provisional date
                        data.description.provisionalDate = "";
                        $('.provisional-date').remove();
                        $('#finalised').remove();
                    }
                } else {
                    $("#finalised input[type='checkbox']").prop('checked', false);
                }
            });
        });
    }

    $("#dateChange").on('input', function () {
        data.dateChanges.previousDate = $(this).val();
        
    });

    function saveOldDate(collectionId, data, oldDate) {
        data.dateChanges.push({previousDate: oldDate, changeNotice: ""});
        initialiseLastNoteMarkdown(collectionId, data, 'dateChanges', 'changeNotice');
    }

    $('#add-preview').click(function () {
        //Check if it is article, bulletin or dataset
        processCollection(collectionId);
    });

    function processCollection(collectionId, noSave) {
        pageDataRequests.push(
            getCollectionDetails(collectionId,
                success = function (response) {
                    pages = response;
                },
                error = function (response) {
                    handleApiError(response);
                }
            )
        );
        $.when.apply($, pageDataRequests).then(function () {
            if(pages.releaseUri && pages.releaseUri == data.uri) {
                processPreview(data, pages);
                if (noSave) {
                    putContent(collectionId, data.uri, JSON.stringify(data),
                      success = function () {
                          Florence.Editor.isDirty = false;
                          refreshPreview(data.uri);
                      },
                      error = function (response) {
                          if (response.status === 400) {
                              sweetAlert("Cannot edit this page", "It is already part of another collection.");
                          } else {
                              handleApiError(response);
                          }
                      }
                    );
                } else {
                    updateContent(collectionId, data.uri, JSON.stringify(data));
                }
            }
        });
    }

    //Add uri to relatedDocuments or relatedDatasets
    function processPreview(data, pages) {
        data.relatedDocuments = [];
        data.relatedDatasets = [];
        data.relatedMethodology = [];
        data.relatedMethodologyArticle = [];
        _.each(pages.inProgress, function (page) {
            if (page.type === 'article' || page.type === 'article_download' || page.type === 'bulletin' || page.type === 'compendium_landing_page') {
                data.relatedDocuments.push({uri: page.uri});
                //console.log(page.uri);
            } else if (page.type === 'dataset_landing_page') {
                data.relatedDatasets.push({uri: page.uri});
            } else if (page.type === 'static_qmi') {
                data.relatedMethodology.push({uri: page.uri});
            } else if (page.type === 'static_methodology' || page.type === 'static_methodology_download') {
                data.relatedMethodologyArticle.push({uri: page.uri});
            }
        });
        _.each(pages.complete, function (page) {
            if (page.type === 'article' || page.type === 'article_download' || page.type === 'bulletin' || page.type === 'compendium_landing_page') {
                data.relatedDocuments.push({uri: page.uri});
                //console.log(page.uri);
            } else if (page.type === 'dataset_landing_page') {
                data.relatedDatasets.push({uri: page.uri});
            } else if (page.type === 'static_qmi') {
                data.relatedMethodology.push({uri: page.uri});
            } else if (page.type === 'static_methodology' || page.type === 'static_methodology_download') {
                data.relatedMethodologyArticle.push({uri: page.uri});
            }
        });
        _.each(pages.reviewed, function (page) {
            if (page.type === 'article' || page.type === 'article_download' || page.type === 'bulletin' || page.type === 'compendium_landing_page') {
                data.relatedDocuments.push({uri: page.uri});
                //console.log(page.uri);
            } else if (page.type === 'dataset_landing_page') {
                data.relatedDatasets.push({uri: page.uri});
            } else if (page.type === 'static_qmi') {
                data.relatedMethodology.push({uri: page.uri});
            } else if (page.type === 'static_methodology' || page.type === 'static_methodology_download') {
                data.relatedMethodologyArticle.push({uri: page.uri});
            }
        });
    }

    // Check whether release is being added back into collection and the published flag should be toggled to truthy
    function checkPublishedFlag(data) {
        return new Promise (function(resolve, reject) {
            if (!data.description.published) {
                getCollection(collectionId, success = function (collectionData) {
                    if (collectionData.releaseUri == data.uri) {
                        data.description.published = true;
                    }
                    resolve()
                }, error = function (error) {
                    reject(error);
                });
            } else {
                resolve();
            }
        });
    }

    //Save and update preview page
    //Get collection content

    // Save
    var editNav = $('.edit-nav');
    editNav.off(); // remove any existing event handlers.

    editNav.on('click', '.btn-edit-save', function () {
        save(updateContent);
    });

    // completed to review
    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
        save(saveAndCompleteContent);
    });

    // reviewed to approve
    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
        save(saveAndReviewContent);
    });

    function save(onSave) {
        // Check whether the publish flag needs to be toggle - this is async so needs to be a promise
        checkPublishedFlag(data).then(function() {
            // Once publish flag is checked then continue with rest of save
            checkRenameUri(collectionId, data, renameUri, onSave);
        }).catch(function(error) {
            console.log("Error getting collection data: ", error);
        });

    }
}

