 /**
 * Editor data loader
 * @param path
 * @param collectionId
 * @param click - if present checks the page url to keep in sync with iframe
 */

function loadPageDataIntoEditor(path, collectionId, click) {

    var { pageUrlData, toApproveUrlData } = buildUrls(path)

    var pageData, isPageComplete;
    var ajaxRequests = [];

    ajaxRequests.push(
        getPageData(collectionId, pageUrlData,
            success = function (response) {
                pageData = response;
            },
            error = function (response) {
                handleApiError(response);
            }
        )
    );

    ajaxRequests.push(
        getCollection(collectionId,
            success = function (response) {
                var lastCompletedEvent = getLastCompletedEvent(response, toApproveUrlData);
                isPageComplete = !(!lastCompletedEvent || lastCompletedEvent.email === Florence.Authentication.loggedInEmail());
            },
            error = function (response) {
                handleApiError(response);
            })
    );

    $.when.apply($, ajaxRequests).then(function () {
        if (click) {
            var iframe = getPreviewUrl();
            if (iframe !== pageData.uri) {
                setTimeout(loadPageDataIntoEditor(path, collectionId), 200);
            } else {
                renderAccordionSections(collectionId, pageData, isPageComplete);
            }
        } else {
            renderAccordionSections(collectionId, pageData, isPageComplete);
        }
    });
}

function loadVisualisationPreviewer(path, collectionId, click) {

    var { pageUrlData, toApproveUrlData } = buildUrls(path)
    
    var pageData, isPageComplete;
    var ajaxRequests = [];
    ajaxRequests.push(
        getPageData(collectionId, pageUrlData,
            success = function (response) {
                pageData = response;
            },
            error = function (response) {
                handleApiError(response);
            }
        )
    );

    ajaxRequests.push(
        getCollection(collectionId,
            success = function (response) {
                var lastCompletedEvent = getLastCompletedEvent(response, toApproveUrlData);
                isPageComplete = !(!lastCompletedEvent || lastCompletedEvent.email === Florence.Authentication.loggedInEmail());
            },
            error = function (response) {
                handleApiError(response);
            })
    );

    $.when.apply($, ajaxRequests).then(function () {
        if (click) {
            var iframe = getPreviewUrl();
            if (iframe !== pageData.uri) {
                setTimeout(loadVisualisationPreviewer(path, collectionId), 200);
            } else {
                visualisationEditor(collectionId, pageData);
            }
        } else {
            visualisationEditor(collectionId, pageData);
        }
    });
}

function buildUrls(path) {
    if (Florence.globalVars.welsh) {
        if (path === '/') {       //add whatever needed to read content in Welsh
            return {
                pageUrlData: path + '&lang=cy',
                toApproveUrlData: '/data_cy.json'
            }
        } else {
            return {
                pageUrlData: path + '&lang=cy',
                toApproveUrlData: path + '/data_cy.json'
            }
        }
    } else {
        if (path === '/') {       //add whatever needed to read content in English
            return {
                pageUrlData: path,
                toApproveUrlData: '/data.json'
            }
        } else {
            return {
                pageUrlData: path,
                toApproveUrlData: path + '/data.json'
            }
        }
    }
}