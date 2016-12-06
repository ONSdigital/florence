/**
 * When content is saved check if the changes made require us to rename the content, i.e. change the uri.
 * @param collectionId
 * @param data
 * @param renameUri
 * @param onSave
 */
function checkRenameUri(collectionId, data, renameUri, onSave) {

    if (renameUri && !data.description.language && !data.description.edition) {   // It will not change welsh url + do not rename content with edition.
        doRename();
    } else {
        onSave(collectionId, data.uri, JSON.stringify(data));
    }

    function doRename() {
        // Does it have edition?
        if (data.description.edition) {
            // CH 29/04/2016 disabling the URI change of content with an edition as it breaks the link of previous editions
            //moveContentWithEditionInUri();
            onSave(collectionId, data.uri, JSON.stringify(data));
        } else if (data.type === 'static_adhoc') {
            moveAdHoc();
        } else {
            moveContentWithoutEdition();
        }
    }

    function moveAdHoc() {
        var titleNoSpace = data.description.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
        var referenceNoSpace = data.description.reference.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
        var tmpNewUri = data.uri.split("/");
        tmpNewUri.splice([tmpNewUri.length - 1], 1, referenceNoSpace + titleNoSpace);
        var newUri = tmpNewUri.join("/");

        putContent(collectionId, data.uri, JSON.stringify(data), function () {
            moveContent(collectionId, data.uri, newUri, function () {
                getPageData(collectionId, newUri, function (pageData) { // get the updated data after doing the move.
                        data = pageData;
                        Florence.globalVars.pagePath = newUri;
                        ;
                        onSave(collectionId, newUri, JSON.stringify(data));
                    },
                    onError = function () {
                        onSave(collectionId, data.uri, JSON.stringify(data));
                    });
            });
        });

        return titleNoSpace;
    }

    function moveContentWithEditionInUri() {
        //Special case dataset editions. They have edition but not title
        if (data.description.title) {
            var titleNoSpace = data.description.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
        }
        var editionNoSpace = data.description.edition.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
        var tmpNewUri = data.uri.split("/");
        if (data.type === 'dataset') {
            tmpNewUri.splice([tmpNewUri.length - 1], 1, editionNoSpace);
        } else {
            tmpNewUri.splice([tmpNewUri.length - 2], 2, titleNoSpace, editionNoSpace);
        }

        var newUri = tmpNewUri.join("/");

        // save any changes before actually doing the move
        putContent(collectionId, data.uri, JSON.stringify(data), function () {
            moveContent(collectionId, data.uri, newUri, function () {
                    getPageData(collectionId, newUri, function (pageData) { // get the updated data after doing the move.
                        data = pageData;

                        Florence.globalVars.pagePath = newUri;
                        //is it a compendium? Rename children array
                        //take this out if moveContent in Zebedee works
                        if (data.type === 'compendium_landing_page') {
                            if (data.chapters) {
                                data.chapters = renameCompendiumChildren(data.chapters, titleNoSpace, editionNoSpace);
                            }
                            if (data.datasets) {
                                data.datasets = renameCompendiumChildren(data.datasets, titleNoSpace, editionNoSpace);
                            }
                        }
                        onSave(collectionId, newUri, JSON.stringify(data));
                    });
                },
                onError = function () {
                    onSave(collectionId, data.uri, JSON.stringify(data));
                });
        });
    }

    function moveContentWithoutEdition() {
        var titleNoSpace = data.description.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
        var tmpNewUri = data.uri.split("/");
        //Articles with no edition. Add date as edition
        if (data.type === 'article' || data.type === 'article_download') {
            console.log(data.description.releaseDate);
            var editionDate = $.datepicker.formatDate('yy-mm-dd', new Date(data.description.releaseDate));
            tmpNewUri.splice([tmpNewUri.length - 2], 2, titleNoSpace, editionDate);
        } else {
            tmpNewUri.splice([tmpNewUri.length - 1], 1, titleNoSpace);
        }
        var newUri = tmpNewUri.join("/");

        putContent(collectionId, data.uri, JSON.stringify(data), function () {
            moveContent(collectionId, data.uri, newUri, function () {
                    getPageData(collectionId, newUri, function (pageData) { // get the updated data after doing the move.
                        data = pageData;

                        Florence.globalVars.pagePath = newUri;
                        //if it is a dataset rename children array
                        //take this out if moveContent in Zebedee works
                        if (data.type === 'dataset_landing_page') {
                            if (data.datasets) {
                                data.datasets = renameDatasetChildren(data.datasets, titleNoSpace);
                            }
                        }
                        onSave(collectionId, newUri, JSON.stringify(data));
                    });
                },
                onError = function () {
                    onSave(collectionId, data.uri, JSON.stringify(data));
                });
        });
    }
}
