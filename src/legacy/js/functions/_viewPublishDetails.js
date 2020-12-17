function viewPublishDetails(collections) {

    var manual = '[manual collection]';
    var result = {
        date: Florence.collectionToPublish.publishDate,
        subtitle: '',
        collectionDetails: [],
        pendingDeletes: []
    };
    var pageDataRequests = []; // list of promises - one for each ajax request to load page data.
    var onlyOne = 0;

    $.each(collections, function (i, collectionId) {
        onlyOne += 1;
        pageDataRequests.push(
            getCollectionDetails(collectionId,
                success = function (response) {
                    if (result.date === manual) {
                        result.collectionDetails.push({
                            id: response.id,
                            name: response.name,
                            pageDetails: response.reviewed,
                            datasets: response.datasets,
                            datasetVersions: response.datasetVersions,
                            pageType: 'manual',
                            pendingDeletes: response.pendingDeletes
                        });
                    } else {
                        result.collectionDetails.push({
                            id: response.id,
                            name: response.name,
                            pageDetails: response.reviewed,
                            datasets: response.datasets,
                            datasetVersions: response.datasetVersions,
                        });
                    }
                },
                error = function () {
                    result.collectionDetails.push({
                        id: getCollectionIDWithoutUUID(collectionId),
                        error: true,
                        pageType: result.date === manual ? "manual" : ""
                    })
                }
            )
        );
    });

    if (onlyOne < 2) {
        result.subtitle = 'The following collection has been approved';
    } else {
        result.subtitle = 'The following collections have been approved';
    }

    Promise.allSettled(pageDataRequests).then(() => {
        displayPublishDetailsPanel()
    }).catch(err => {
        handleApiError(err);
    })

    function displayPublishDetailsPanel() {
        var publishDetails = templates.publishDetails(result);
        $('.panel--off-canvas').html(publishDetails);
        bindAccordions();

        $('.btn-collection-publish').click(function () {
            var collection = $(this).closest('.js-accordion').find('.collection-name').attr('data-id');
            publish(collection);
        });

        $('.btn-collection-unlock').click(function () {
            var collection = $(this).closest('.js-accordion').find('.collection-name').attr('data-id');

            if (result.date !== manual) {
                swal({
                        title: "Are you sure?",
                        text: "If unlocked, this collection will not be published on " + result.date + " unless it is approved" +
                        " again",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#6d272b",
                        confirmButtonText: "Yes, unlock it!",
                        closeOnConfirm: false
                    },
                    function () {
                        unlock(collection);
                    });
            } else {
                unlock(collection);
            }
        });

        $('.btn-collection-preview').click(function () {
            var collection = $(this).closest('.js-accordion').find('.collection-name').attr('data-id');
            window.location = `/florence/collections/${collection}/preview`
        });

        //page-list
        $('.page__item:not(.delete-child)').click(function () {
            $('.page-list li').removeClass('selected');
            $('.page__buttons').hide();
            $('.page__children').hide();

            // $(this).parent('li').addClass('selected');
            // $(this).next('.page__buttons').show();

            var $this = $(this),
                $buttons = $this.next('.page__buttons'),
                $childrenPages = $buttons.length > 0 ? $buttons.next('.page__children') : $this.next('.page__children');

            $this.parent('li').addClass('selected');
            $buttons.show();
            $childrenPages.show();
        });

        $('.btn-collection-cancel').click(function () {
            var hidePanelOptions = {
                onHide: false,
                moveCenteredPanel: true
            };

            hidePanel(hidePanelOptions);
        });
    }

    // return collection id without unique identifier on the end
    function getCollectionIDWithoutUUID(collectionID) {
        return collectionID.split("-")[0]
    }
}
