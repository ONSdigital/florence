function viewCollectionDetails(collectionId, $this) {

    getCollectionDetails(collectionId,
        success = function (response) {
            populateCollectionDetails(response, collectionId, $this);
        },
        error = function (response) {
            handleApiError(response);
        }
    );

    function populateCollectionDetails(collection, collectionId) {

        Florence.setActiveCollection(collection);

        // Set published date
        if (!collection.publishDate) {
            collection.date = '[manual collection]';
        } else if (collection.publishDate && collection.type === 'manual') {
            collection.date = '[manual collection] Originally scheduled for ' + StringUtils.formatIsoFull(collection.publishDate);
        } else {
            collection.date = StringUtils.formatIsoFull(collection.publishDate);
        }

        // Set collection progress
        ProcessPages(collection.inProgress);
        ProcessPages(collection.complete);
        ProcessPages(collection.reviewed);

        // Set collection approval state
        var approvalStates = {inProgress: false, thrownError: false, completed: false, notStarted: false};
        switch (collection.approvalStatus) {
            case (undefined): {
                collection.approvalState = '';
                break;
            }
            case ('NOT_STARTED'): {
                approvalStates.notStarted = true;
                break;
            }
            case ('IN_PROGRESS'): {
                approvalStates.inProgress = true;
                break;
            }
            case ('COMPLETE'): {
                approvalStates.completed = true;
                break;
            }
            case ('ERROR'): {
                approvalStates.thrownError = true;
                break;
            }
        }
        collection.approvalState = approvalStates;

        // temporary code to add API datasets to a collection
        // this will come from the zebedee collection api when ready
        if (collection.name === "hasAPIData") {
            collection.datasets = [
                {
                    "edition": "March 2019",
                    "instance_id": "1078493",
                    "dataset": {
                        "id": "DE3BC0B6-D6C4-4E20-917E-95D7EA8C91DC",
                        "title": "COICOP",
                        "href": "http://localhost:8080/datasets/DE3BC0B6-D6C4-4E20-917E-95D7EA8C91DC"
                    },
                    "version": 1
                }
            ]
        }

        var showPanelOptions = {
            html: window.templates.collectionDetails(collection)
        };
        showPanel($this, showPanelOptions);

        var deleteButton = $('#collection-delete'),
            collectionCanBeDeleted = collection.inProgress.length === 0
                && collection.complete.length === 0
                && collection.reviewed.length === 0
                && collection.timeseriesImportFiles.length === 0
                && collection.pendingDeletes.length <= 0;
        if (collectionCanBeDeleted) {
            deleteButton.show().click(function () {
                swal({
                    title: "Warning",
                    text: "Are you sure you want to delete this collection?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Continue",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function (result) {
                    if (result === true) {
                        deleteCollection(collectionId,
                            function () {
                                swal({
                                    title: "Collection deleted",
                                    type: "success",
                                    timer: 2000
                                });
                                viewCollections();
                            },
                            function (error) {
                                viewCollectionDetails(collectionId);
                                sweetAlert('File has not been deleted. Contact an administrator', error, "error");
                            })
                    } else {
                    }
                });
            });
        } else {
            deleteButton.hide();
        }

        var $approveBtn = $('.btn-collection-approve'),
            $editBtn = $('.js-edit-collection'),
            $workOnBtn = $('.btn-collection-work-on'),
            $restoreContentBtn = $('.js-restore-delete'),
            $importBtn = $('.js-import');

        if (collection.approvalState.inProgress) {
            // Collection has been approved and is generating PDF, timeseries etc so disable buttons
            $workOnBtn.addClass('btn--disabled').attr('disabled', true);
            $approveBtn.addClass('btn--disabled').attr('disabled', true);
        } else if (collection.approvalState.thrownError) {
            // Collection has thrown error doing pre-publish tasks, give user option to retry approval
            $workOnBtn.hide();
            $approveBtn.text('Retry approval').show().one('click', function () {
                postApproveCollection(collection.id);
            });
        } else if (showApproveButton(collection)) {
            // Collection has been reviewed and is ready for approval, so show button and bind click
            $approveBtn.show().one('click', function () {
                postApproveCollection(collection.id);
            });
        } else {
            // You can't approve collections unless there is nothing left to be reviewed, hide approve button
            $approveBtn.hide();
        }

        //edit collection
        $editBtn.click(function () {
            editCollection(collection);
        });

        // restore deleted content
        $restoreContentBtn.click(function () {
            viewRestoreDeleted(collection);
        });

        // import time series
        $importBtn.click(function () {
            importTsTitles(collection.id);
        });


        //page-list
        $('.page__item:not(.delete-child)').click(function () {
            $('.page-list li').removeClass('selected');
            $('.page__buttons').hide();
            $('.page__children').hide();

            var $this = $(this),
                $buttons = $this.next('.page__buttons'),
                $childrenPages = $buttons.length > 0 ? $buttons.next('.page__children') : $this.next('.page__children');

            $this.parent('li').addClass('selected');
            $buttons.show();
            $childrenPages.show();
        });

        $('.btn-page-edit').click(function () {
            var path = $(this).attr('data-path');
            var language = $(this).attr('data-language');
            if (language === 'cy') {
                var safePath = checkPathSlashes(path);
                Florence.globalVars.welsh = true;
            } else {
                var safePath = checkPathSlashes(path);
                Florence.globalVars.welsh = false;
            }
            getPageData(collectionId, safePath,
                success = function (response) {
                    createWorkspace(safePath, collectionId, 'edit', collection, null, response.apiDatasetId);
                },
                error = function (response) {
                    handleApiError(response);
                }
            );
        });

        $('.page-delete').click(function () {
            var path = $(this).attr('data-path');
            var language = $(this).attr('data-language');

            //Shows relevant alert text - SweetAlert doesn't return a true or false in same way that confirm() does so have to write each alert with delete function called after it
            function deleteAlert(text) {
                swal({
                    title: "Warning",
                    text: text,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Delete",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function (result) {
                    if (result === true) {
                        //if (language === 'cy' && !(path.match(/\/bulletins\//) || path.match(/\/articles\//))) {
                        if (language === 'cy') {
                            path = path + '/data_cy.json';
                        }
                        deleteContent(collectionId, path, function () {
                                viewCollectionDetails(collectionId);
                                swal({
                                    title: "Page deleted",
                                    text: "This page has been deleted",
                                    type: "success",
                                    timer: 2000
                                });
                            }, function (error) {
                                handleApiError(error);
                            }
                        );
                    }
                });
            }

            //if (path.match(/\/bulletins\//) || path.match(/\/articles\//)) {
            //  deleteAlert("This will delete the English and Welsh content of this page, if any. Are you sure you want to delete this page from the collection?");
            //} else if (language === 'cy') {
            deleteAlert("Are you sure you want to delete this page from the collection?");
            //} else {
            //  deleteAlert("This will delete the English and Welsh content of this page, if any. Are you sure you want to delete this page from the collection?");
            //}
        });

        $('.dataset-delete').click(function () {
            var instanceId = $(this).attr('data-instanceId');

            function deleteAlert(text) {
                swal({
                    title: "Warning",
                    text: text,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Delete",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function (result) {
                    if (result === true) {
                        deleteAPIDataset(collectionId, instanceId, function () {
                                viewCollectionDetails(collectionId);
                                swal({
                                    title: "Dataset deleted",
                                    text: "This dataset has been deleted",
                                    type: "success",
                                    timer: 2000
                                });
                            }, function (error) {
                                handleApiError(error);
                            }
                        );
                    }
                });
            }

            deleteAlert("Are you sure you want to delete this dataset from the collection?");

        });

        $('.delete-marker-remove').click(function () {
            var selection = $('.page-list').find('.selected');
            var uri = $(this).attr('data-path');
            removeDeleteMarker(uri, function() {
                // selection.remove();
                getCollectionDetails(collectionId,
                    success = function (response) {
                        populateCollectionDetails(response, collectionId, $this);
                    },
                    error = function (response) {
                        handleApiError(response);
                    }
                );
                sweetAlert('Undo', "Deletion removed", 'success');
            });
        });

        $('.btn-collection-cancel').click(function () {
            hidePanel({});
        });

        $workOnBtn.click(function () {
            Florence.globalVars.welsh = false;
            createWorkspace('', collectionId, 'browse', collection);
        });

        setCollectionDetailsHeight();
    };

    function ProcessPages(pages) {
        _.sortBy(pages, 'uri');
        _.each(pages, function (page) {
            page.uri = page.uri.replace('/data.json', '');
            return page;
        });
    }

    function setCollectionDetailsHeight() {
        var panelHeight = parseInt($('.panel--off-canvas').height());

        var headHeight = parseInt($('.slider__head').height());
        var headPadding = parseInt($('.slider__head').css('padding-bottom'));

        var contentPadding = parseInt($('.slider__content').css('padding-bottom'));

        var navHeight = parseInt($('.slider__nav').height());
        var navPadding = (parseInt($('.slider__nav').css('padding-bottom'))) + (parseInt($('.slider__nav').css('padding-top')));

        var contentHeight = panelHeight - (headHeight + headPadding + contentPadding + navHeight + navPadding);
        $('.slider__content').css('height', contentHeight);
    }

    function showApproveButton(collection) {
        // If the collection contains deletes...
        if (collection.pendingDeletes && collection.pendingDeletes.length > 0) {
            // Check that the current user is not the owner of any of the deletes.
            for (i = 0; i < collection.pendingDeletes.length; i++) {
                var pendingDelete = collection.pendingDeletes[i];
                if (pendingDelete.user == localStorage.getItem('loggedInAs')) {
                    $("#approval-permission-blocked").show();
                    return false;
                }
            }

            return (collection.inProgress.length === 0 && collection.complete.length === 0
                && collection.reviewed.length >= 0) || (collection.timeseriesImportFiles.length > 0);
        }
        return (collection.inProgress.length === 0 && collection.complete.length === 0
            && collection.reviewed.length > 0) || (collection.timeseriesImportFiles.length > 0);
    }
}