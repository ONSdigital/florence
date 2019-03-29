/**
 * Creates article and bulletin JSON
 * @param collectionId
 * @param releaseDate
 * @param pageType
 * @param parentUrl
 */

function loadT4Creator(collectionId, releaseDate, pageType, parentUrl) {
    var releaseDate = null;             //overwrite scheduled collection date
    var conditions = true;
    var pageType, pageTitle, uriSection, pageTitleTrimmed, pageEditionTrimmed, releaseDateManual,
        isInheriting, newUri, pageData, natStat, contactName, contactEmail,
        contactTel, keyWords, metaDescr, relatedData, summary, relatedMethodology;
    var parentUrlData = parentUrl + "/data";
    $.ajax({
        url: parentUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (checkData) {
            if (checkData.type === 'product_page' && !Florence.globalVars.welsh) {
                var checkedUrl = checkPathSlashes(checkData.uri);
                submitFormHandler(checkedUrl);
                return true;
            }
            if ((checkData.type === 'bulletin' && pageType === 'bulletin') || (checkData.type === 'article' && pageType === 'article') || (checkData.type === 'article_download' && pageType === 'article_download')) {
                var checkedUrl = checkPathSlashes(checkData.uri);
                var safeParentUrl = getParentPage(checkedUrl);
                natStat = checkData.description.nationalStatistic;
                contactName = checkData.description.contact.name;
                contactEmail = checkData.description.contact.email;
                contactTel = checkData.description.contact.telephone;
                pageTitle = checkData.description.title;
                keyWords = checkData.description.keywords;
                summary = checkData.description.summary;
                metaDescr = checkData.description.metaDescription;
                relatedMethodology = checkData.relatedMethodology;
                if (checkData.type === 'bulletin' && pageType === 'bulletin') {
                    relatedData = checkData.relatedData;
                }
                isInheriting = true;
                submitFormHandler(safeParentUrl, pageTitle, isInheriting);
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

    function submitFormHandler(parentUrl, title, isInheriting) {

        $('.edition').append(
            '<div id="edition-div">' +
            '  <label for="edition">Edition</label>' +
            '  <input id="edition" type="text" placeholder="August 2010, Q3 2015, 1978, etc." />' +
            '</div>'
        );
        if (!releaseDate) {
            $('.edition').append(
                '<div id="release-div">' +
                '  <label for="releaseDate">Release date</label>' +
                '  <input id="releaseDate" type="text" placeholder="day month year" />' +
                '</div>'
            );
            creatorDatePicker();
        }
        if (!isInheriting) {
            $('.btn-page-create').before(
                '<p class="create-publishing-error">Creating a publication here will create a new series.</p>'
            )
        }
        if (title) {
            pageTitle = title;
            $('#pagename').val(title);
        }

        $('form').off().submit(function (e) {
            e.preventDefault();
            releaseDateManual = $('#releaseDate').val();
            var pageEdition = $('#edition').val();

            // Do input validation
            var nameValid = validatePageName();
            if (!nameValid) {
                return false;
            }

            // Bulletin page title validation
            if (pageType === 'bulletin' && !validatePageName('#edition')) {
                return false;
            }

            // Article page validation - remove empty space
            if ((pageType === 'article' || pageType === 'article_download') && pageEdition === " ") {
                pageEdition = "";
            }

            pageData = pageTypeDataT4(pageType);
            pageData.description.edition = pageEdition;
            if (title) {
                //do nothing;
            } else {
                pageTitle = $('#pagename').val();
            }
            pageData.description.title = pageTitle;
            if (pageType === 'article_download') {
                uriSection = 'articles';
            } else {
                uriSection = pageType + "s";
            }
            pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
            if (pageData.description.edition) {
                pageEditionTrimmed = pageData.description.edition.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
                var releaseUri = pageEditionTrimmed;
            }

            if (!pageData.description.edition && releaseDateManual) {                          //Manual collections
                date = $.datepicker.parseDate("dd MM yy", releaseDateManual);
                releaseUri = $.datepicker.formatDate('yy-mm-dd', date);
            } else if (!pageData.description.edition && !releaseDateManual) {
                releaseUri = $.datepicker.formatDate('yy-mm-dd', new Date(releaseDate));
            }
            var articleNoReleaseDate = ((pageData.type === "article") && ($('#releaseDate').val() === ''))
            if (!articleNoReleaseDate) {
                if (!releaseDate) {
                    pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
                } else {
                    pageData.description.releaseDate = releaseDate;
                }
            }

            if (isInheriting) {
                pageData.description.nationalStatistic = natStat;
                pageData.description.contact.name = contactName;
                pageData.description.contact.email = contactEmail;
                pageData.description.contact.telephone = contactTel;
                pageData.description.keywords = keyWords;
                pageData.description.metaDescription = metaDescr;
                pageData.relatedMethodology = relatedMethodology;
                if (pageType === 'bulletin') {
                    pageData.description.summary = summary;
                    pageData.relatedData = relatedData;
                }
                newUri = makeUrl(parentUrl, releaseUri);
            } else {
                newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed, releaseUri);
            }
            var safeNewUri = checkPathSlashes(newUri);

            if (pageType === 'bulletin' && !pageData.description.edition) {
                sweetAlert('Edition can not be empty');
                $('.select-wrap').remove();
                $('#edition-div').remove();
                $('#release-div').remove();
                loadT4Creator(collectionId, releaseDate, pageType, parentUrl);
                e.preventDefault();
                conditions = false;
            }
            if (!pageData.description.releaseDate && pageData.type !== 'article') {
                sweetAlert('Release date can not be empty');
                $('.select-wrap').remove();
                $('#edition-div').remove();
                $('#release-div').remove();
                loadT4Creator(collectionId, releaseDate, pageType, parentUrl);
                e.preventDefault();
                conditions = false;
            }
            if (pageTitle.length < 5) {
                sweetAlert("This is not a valid file title");
                $('.select-wrap').remove();
                $('#edition-div').remove();
                $('#release-div').remove();
                loadT4Creator(collectionId, releaseDate, pageType, parentUrl);
                e.preventDefault();
                conditions = false;
            }
            else if (conditions) {
                saveContent(collectionId, safeNewUri, pageData);
            }
        });
    }

    function pageTypeDataT4(pageType) {

        if (pageType === "bulletin") {
            return {
                "description": {
                    "title": "",
                    "edition": "",
                    "summary": "",
                    "releaseDate": "",
                    "nextRelease": "",
                    "contact": {
                        "name": "",
                        "email": "",
                        "telephone": ""
                    },
                    "nationalStatistic": false,
                    "headline1": "",
                    "headline2": "",
                    "headline3": "",
                    "keywords": [],
                    "metaDescription": "",
                },
                "sections": [],
                "accordion": [],
                "relatedDocuments": [],
                "relatedData": [],
                "relatedMethodology": [],
                "relatedMethodologyArticle": [],
                "topics": [],
                "links": [],
                "charts": [],
                "tables": [],
                "equations": [],
                "pdfTable": [],
                "images": [],
                "alerts": [],
                "versions": [],
                type: pageType
            };
        }

        else if (pageType === "article") {
            return {
                "description": {
                    "title": "",
                    "edition": "",
                    "_abstract": "",
                    "releaseDate": "",
                    "nextRelease": "",
                    "contact": {
                        "name": "",
                        "email": "",
                        "telephone": ""
                    },
                    "nationalStatistic": false,
                    "keywords": [],
                    "metaDescription": "",
                },
                "sections": [],
                "accordion": [],
                "relatedDocuments": [],
                "relatedData": [],
                "relatedMethodology": [],
                "relatedMethodologyArticle": [],
                "topics": [],
                "links": [],
                "charts": [],
                "tables": [],
                "equations": [],
                "pdfTable": [],
                "images": [],
                "alerts": [],
                "versions": [],
                "isPrototypeArticle": false,
                type: pageType
            };
        }

        else if (pageType === "article_download") {
            return {
                "description": {
                    "title": "",
                    "_abstract": "",
                    "edition": "",
                    "releaseDate": "",
                    "nextRelease": "",
                    "contact": {
                        "name": "",
                        "email": "",
                        "telephone": ""
                    },
                    "nationalStatistic": false,
                    "keywords": [],
                    "metaDescription": ""
                },
                "markdown": [],
                "downloads": [],
                "relatedDocuments": [],
                "relatedData": [],
                "relatedMethodology": [],
                "relatedMethodologyArticle": [],
                "topics": [],
                "links": [],
                "charts": [],
                "tables": [],
                "equations": [],
                "images": [],
                "alerts": [],
                "versions": [],
                type: pageType
            };
        }

        else {
            sweetAlert('Unsupported page type. This is not an article or a bulletin');
        }
    }
}

