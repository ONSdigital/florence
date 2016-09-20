/**
 * Creates static pages' JSON
 * @param collectionId
 * @param releaseDate
 * @param pageType
 * @param parentUrl
 */

function loadT7Creator(collectionId, releaseDate, pageType, parentUrl) {
    var releaseDate = null;             //overwrite scheduled collection date
    var pageName, pageNameTrimmed, newUri, pageData, isNumber;
    if (parentUrl === '/') {        //to check home page
        parentUrl = '';
    }
    var parentUrlData = parentUrl + "/data";
    $.ajax({
        url: parentUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (checkData) {
            if (pageType === 'static_landing_page' && checkData.type === 'home_page' ||
                (pageType === 'static_qmi' || pageType === 'static_adhoc' || pageType === 'static_methodology' || pageType === 'static_methodology_download') && checkData.type === 'product_page' ||
                (pageType === 'static_landing_page' || pageType === 'static_page' || pageType === 'static_article') && checkData.type === 'home_page_census') {
                submitFormHandler();
                return true;
            } else if ((pageType === 'static_foi' || pageType === 'static_page' || pageType === 'static_article' || pageType === 'static_landing_page') && checkData.type.match(/static_.+/)) {
                submitFormHandler();
                return true;
            } else {
                sweetAlert("This is not a valid place to create this page.");
                loadCreateScreen(parentUrl, collectionId);
            }
        },
        error: function () {
            console.log('No page data returned');
        }
    });

    function submitFormHandler() {
        if (pageType === 'static_qmi') {
            $('.edition').append(
                '<label for="releaseDate">Last revised</label>' +
                '<input id="releaseDate" type="text" placeholder="day month year" />'
            );

            creatorDatePicker();
        } else if (pageType === 'static_adhoc') {
            $('.edition').append(
                '<label for="releaseDate">Release date</label>' +
                '<input id="releaseDate" type="text" placeholder="day month year" />' +
                '<br>' +
                '<label for="adhoc-reference">Reference</label>' +
                '<input id="adhoc-reference" type="text" placeholder="Reference number" />'
            );
            creatorDatePicker();
            $('#adhoc-reference').on('input', function () {
                isNumber = $(this).val();
                if (!isNumber.match(/^\d+$/)) {
                    sweetAlert('This needs to be a number');
                    $(this).val('');
                }
            });
        }
        else if (!releaseDate && !(pageType === 'static_page' || pageType === 'static_landing_page')) {
            $('.edition').append(
                '<label for="releaseDate">Release date</label>' +
                '<input id="releaseDate" type="text" placeholder="day month year" />'
            );
            creatorDatePicker();
        }

        $('form').off().submit(function (e) {
            e.preventDefault();
            var nameValid = validatePageName();
            if (!nameValid) {
                return false;
            }
            pageData = pageTypeDataT7(pageType);
            pageName = $('#pagename').val().trim();
            pageData.description.title = pageName;
            pageNameTrimmed = pageName.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
            pageData.fileName = pageNameTrimmed;
            pageData.description.reference = isNumber;
            var adHocUrl = isNumber + pageNameTrimmed;
            if (pageType === 'static_qmi' && !Florence.globalVars.welsh) {
                newUri = makeUrl(parentUrl, 'qmis', pageNameTrimmed);
            } else if (pageType === 'static_adhoc' && !Florence.globalVars.welsh) {
                newUri = makeUrl(parentUrl, 'adhocs', adHocUrl);
            } else if ((pageType === 'static_methodology' || pageType === 'static_methodology_download') && !Florence.globalVars.welsh) {
                newUri = makeUrl(parentUrl, 'methodologies', pageNameTrimmed);
            } else if (!Florence.globalVars.welsh) {
                newUri = makeUrl(parentUrl, pageNameTrimmed);
            } else {
                sweetAlert('You can not perform that operation in Welsh.');
            }
            var safeNewUri = checkPathSlashes(newUri);
            if (releaseDate && (pageType === 'static_qmi')) {
                date = new Date(releaseDate);
                pageData.description.lastRevised = $.datepicker.formatDate('dd/mm/yy', date);
            } else if (releaseDate) {
                date = new Date(releaseDate);
                pageData.description.releaseDate = $.datepicker.formatDate('dd/mm/yy', date);
            } else if (!releaseDate && (pageType === 'static_qmi')) {
                pageData.description.lastRevised = new Date($('#releaseDate').val()).toISOString();
                //} else if (!releaseDate && (pageType === 'static_page' || pageType === 'static_article')) {
                //  pageData.description.releaseDate = "1970-01-01T00:00:00.000Z";  // zebedee throws a JsonSyntaxException
                // if no date is present
            } else if (!releaseDate) {
                if ($('#releaseDate').val()) {
                    pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
                } else {
                    pageData.description.releaseDate = new Date().toISOString();
                }
            }

            if (pageName.length < 4) {
                sweetAlert({
                    title: "This is not a valid page name",
                    text: "Page names must be 4 characters or longer",
                    type: "warning"
                });
                loadCreateScreen(parentUrl, collectionId);
            } else {
                debugger;
                saveContent(collectionId, safeNewUri, pageData);
            }
        });
    }
}

function pageTypeDataT7(pageType) {

    if (pageType === "static_page") {
        return {
            "description": {
                "title": "",
                "summary": "",
                "releaseDate": "",
                "keywords": [],
                "metaDescription": ""
            },
            "markdown": [],
            "charts": [],
            "tables": [],
            "equations": [],
            "images": [],
            "downloads": [],
            type: pageType,
            "anchors": [],
            "links": []
        };
    } else if (pageType === "static_landing_page") {
        return {
            "description": {
                "title": "",
                "summary": "",
                "releaseDate": "",
                "keywords": [],
                "metaDescription": "",
            },
            "sections": [],
            "markdown": [],
            type: pageType,
            "links": []
        };
    }
    else if (pageType === "static_article") {
        return {
            "description": {
                "title": "",
                "summary": "",
                "releaseDate": "",
                "keywords": [],
                "metaDescription": ""
            },
            "sections": [],
            "charts": [],
            "tables": [],
            "equations": [],
            "images": [],
            "anchors": [],
            "links": [],
            "alerts": [],
            type: pageType
        };
    } else if (pageType === "static_methodology") {
        return {
            "description": {
                "title": "",
                "summary": "",
                "releaseDate": "",
                "contact": {
                    "name": "",
                    "email": "",
                    "telephone": ""
                },
                "keywords": [],
                "metaDescription": ""
            },
            "sections": [],
            "accordion": [],
            "relatedDocuments": [],
            "relatedDatasets": [],
            "relatedMethodology": [],
            "relatedMethodologyArticle": [],
            "charts": [],
            "tables": [],
            "equations": [],
            "images": [],
            "downloads": [],
            "links": [],
            "pdfTable": [],
            "alerts": [],
            type: pageType
        };
    } else if (pageType === "static_methodology_download") {
        return {
            "description": {
                "title": "",
                "contact": {
                    "name": "",
                    "email": "",
                    "phone": ""
                },
                "releaseDate": "",
                "keywords": [],
                "metaDescription": ""
            },
            "markdown": [],
            "downloads": [],
            "relatedDocuments": [],
            "relatedDatasets": [],
            "relatedMethodology": [],
            "relatedMethodologyArticle": [],
            "links": [],
            "alerts": [],
            type: pageType
        };
    } else if (pageType === "static_qmi") {
        return {
            "description": {
                "title": "",
                "contact": {
                    "name": "",
                    "email": "",
                    "phone": ""
                },
                "surveyName": "",
                "frequency": "",
                "compilation": "",
                "geographicCoverage": "",
                "sampleSize": null,
                "lastRevised": "",
                "nationalStatistic": false,
                "keywords": [],
                "metaDescription": ""
            },
            "markdown": [],
            "downloads": [],
            "relatedDocuments": [],
            "relatedDatasets": [],
            "relatedMethodology": [],
            "relatedMethodologyArticle": [],
            "links": [],
            type: pageType
        };
    } else if (pageType === "static_foi") {
        return {
            "description": {
                "title": "",
                "releaseDate": "",
                "keywords": [],
                "metaDescription": ""
            },
            "downloads": [],
            "markdown": [],
            "links": [],
            type: pageType
        };
    } else if (pageType === "static_adhoc") {
        return {
            "description": {
                "title": "",
                "releaseDate": "",
                "reference": null,
                "keywords": [],
                "metaDescription": ""
            },
            "downloads": [],
            "markdown": [],
            "links": [],
            type: pageType
        };
    } else {
        sweetAlert('Unsupported page type', 'This is not a static page', "info");
    }
}