/**
 * Creates article and bulletin JSON
 * @param collectionId
 * @param releaseDate
 * @param pageType
 * @param parentUrl
 */

function loadT4Creator (collectionId, releaseDate, pageType, parentUrl) {
  var releaseDate = null;             //overwrite scheduled collection date
  var pageType, pageTitle, uriSection, pageTitleTrimmed, releaseDateManual,
    isInheriting, newUri, pageData, natStat, contactName, contactEmail,
    contactTel, keyWords, metaDescr, relatedData, summary;
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
      } if ((checkData.type === 'bulletin' && pageType === 'bulletin') || (checkData.type === 'article' && pageType === 'article')) {
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
        if (checkData.type === 'bulletin' && pageType === 'bulletin') {
          relatedData = checkData.relatedData;
        }
        isInheriting = true;
        submitFormHandler (safeParentUrl, pageTitle, isInheriting);
        return true;
      } else {
        alert("This is not a valid place to create this page.");
        loadCreateScreen(collectionId);
      }
    },
    error: function () {
      console.log('No page data returned');
    }
  });

  function submitFormHandler (parentUrl, title, isInheriting) {

    $('.edition').append(
      '<label for="edition">Edition</label>' +
      '<input id="edition" type="text" placeholder="August 2010, Q3 2015, 1978, etc." />'
    );
    if (!releaseDate) {
      $('.edition').append(
        '<br>' +
        '<label for="releaseDate">Release date</label>' +
        '<input id="releaseDate" type="text" placeholder="day month year" />'
      );
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
    }
    if (title) {
      pageTitle = title;
      $('#pagename').val(title);
    }

    $('form').submit(function (e) {
      releaseDateManual = $('#releaseDate').val();
      pageData = pageTypeDataT4(pageType);
      pageData.description.edition = $('#edition').val();
      if (title) {
        //do nothing;
      } else {
        pageTitle = $('#pagename').val();
      }
      pageData.description.title = pageTitle;
      uriSection = pageType + "s";
      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

      if (pageData.description.edition) {
        releaseUri = pageData.description.edition;
      }

      if (!pageData.description.edition && releaseDateManual) {                          //Manual collections
        date = $.datepicker.parseDate("dd MM yy", releaseDateManual);
        releaseUri = $.datepicker.formatDate('yy-mm-dd', date);
      } else if (!pageData.description.edition && !releaseDateManual) {
        releaseUri = $.datepicker.formatDate('yy-mm-dd', new Date(releaseDate));
      }

      if (!releaseDate) {
        pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
      } else {
        pageData.description.releaseDate = releaseDate;
      }
      if (isInheriting) {
        pageData.description.nationalStatistic = natStat;
        pageData.description.contact.name = contactName;
        pageData.description.contact.email = contactEmail;
        pageData.description.contact.telephone = contactTel;
        pageData.description.keywords = keyWords;
        pageData.description.metaDescription = metaDescr;
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
        alert('Edition can not be empty');
        return true;
      } if (!pageData.description.releaseDate) {
        alert('Release date can not be empty');
        return true;
      } if (pageTitle.length < 5) {
        alert("This is not a valid file title");
        return true;
      }
      else {
        checkSaveContent(collectionId, safeNewUri, pageData);
      }
      e.preventDefault();
    });
  }

  function pageTypeDataT4(pageType) {

    if (pageType === "bulletin") {
      return {
        "description": {
          "headline1": "",
          "headline2": "",
          "headline3": "",
          "nationalStatistic": false,
          "contact": {
            "name": "",
            "email": "",
            "telephone": ""
          },
          "title": "",
          "summary": "",
          "keywords": [],
          "edition": "",
          "releaseDate": "",
          "nextRelease": "",
          "metaDescription": "",
        },
        "sections": [],
        "accordion": [],
        "relatedDocuments": [],
        "relatedData": [],
        "relatedMethodology": [],
        "topics": [],
        "links": [],
        "charts": [],
        "tables": [],
        "images": [],
        "corrections": [],
        type: pageType
      };
    }

    else if (pageType === "article") {
      return {
        "description": {
          "edition": "",
          "nextRelease": "",
          "contact": {
            "name": "",
            "email": "",
            "telephone": ""
          },
          "_abstract": "",
          "authors": [],
          "keywords": [],
          "metaDescription": "",
          "nationalStatistic": false,
          "title": "",
          "releaseDate": "",
        },
        "sections": [],
        "accordion": [],
        "relatedDocuments": [],
        "relatedData": [],
        "relatedMethodology": [],
        "topics": [],
        "links": [],
        "charts": [],
        "tables": [],
        "images": [],
        "corrections": [],
        type: pageType
      };
    }

    else {
      alert('Unsupported page type. This is not an article or a bulletin');
    }
  }
}

