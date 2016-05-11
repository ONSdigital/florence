/**
 * Creates data visualisation's JSON
 * @param collectionId
 * @param parentUrl
 */

function loadVisualisationCreator(collectionId, pageType, parentUrl) {
    var pageType, pageData, pageTitle, pageId, newUri, safeNewUri, uriSection, pageTitleTrimmed;
    var parentUrlData = "/data";
    $.ajax({
        url: parentUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (checkData) {
            //Checks page is built in correct location TODO switch homepage to check for visualisation directory
            if (checkData.type === 'home_page') {
                submitFormHandler();
                return true;
            } else {
                sweetAlert("This is not a valid place to create this page.");
                //TODO load data vis directory
            }
        },
        error: function () {
            console.log('No page data returned');
        }
    });

    function submitFormHandler() {
        pageData = pageTypeDataVisualisation(pageType);

        // Prepend unique code field into create form
        var codeInput = "<label for='visualisation-uid'>Unique ID</label><input type='text' id='visualisation-uid'>"
        $('.edition').after(codeInput);

        $('form').submit(function(e) {
            e.preventDefault();
            var nameValid = validatePageName();
            if (!nameValid) {
                return false;
            }

            // Update page title and UID
            pageTitle = $('#pagename').val();
            pageId = $('#visualisation-uid').val();

            // Save the new page
            uriSection = "visualisations";
            pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
            newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed);
            safeNewUri = checkPathSlashes(newUri);
            Florence.globalVars.pagePath = safeNewUri;
            saveContent(collectionId, safeNewUri, pageData);
        });

    }
}

function pageTypeDataVisualisation(pageType) {
    return {
        title: "",
        uid: "",
        type: pageType
    };
}


