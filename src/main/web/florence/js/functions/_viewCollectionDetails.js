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

        if (!collection.publishDate) {
            collection.date = '[manual collection]';
        } else if (collection.publishDate && collection.type === 'manual') {
            collection.date = '[manual collection] Originally scheduled for ' + StringUtils.formatIsoFull(collection.publishDate);
        } else {
            collection.date = StringUtils.formatIsoFull(collection.publishDate);
        }

        ProcessPages(collection.inProgress);
        ProcessPages(collection.complete);
        ProcessPages(collection.reviewed);

        var showPanelOptions = {
            html: window.templates.collectionDetails(collection)
        };
        showPanel($this, showPanelOptions);

        var deleteButton = $('#collection-delete');
        if (collection.inProgress.length === 0
            && collection.complete.length === 0
            && collection.reviewed.length === 0
            && collection.timeseriesImportFiles.length === 0) {
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

        var approve = $('.btn-collection-approve');
        if (collection.inProgress.length === 0
            && collection.complete.length === 0
            && (collection.reviewed.length > 0
            || collection.timeseriesImportFiles.length > 0)) {
            approve.show().one('click', function () {
                postApproveCollection(collection.id);
            });
        }
        else {
            // You can't approve collections unless there is nothing left to be reviewed
            approve.hide();
        }

        //edit collection
        $('.btn-collection-edit').click(function () {
            // console.log($(this));
            editCollection(collection);
        });

        //page-list
        $('.page__item').click(function () {
            $('.page-list li').removeClass('selected');
            $('.page__buttons').hide();

            $(this).parent('li').addClass('selected');
            $(this).next('.page__buttons').show();
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
            getPageDataDescription(collectionId, safePath,
                success = function () {
                    createWorkspace(safePath, collectionId, 'edit', collection);
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

        $('.delete-marker-remove').click(function () {
            console.log(".delete-marker-remove");
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

        $('.btn-collection-work-on').click(function () {
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
}