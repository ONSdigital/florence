function loadT6Creator (collectionId, releaseDate, pageType, parentUrl) {
  var parent, pageType, pageTitle, uriSection, pageTitleTrimmed, releaseDate, releaseDateManual, isInheriting, newUri, pageData, breadcrumb;
  var parentUrlData = parentUrl + "/data";
  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      if (checkData.type === 'product_page') {
        $('#location').val(parentUrl);
        var inheritedBreadcrumb = checkData.breadcrumb;
        var parentBreadcrumb = {
          "uri": checkData.uri
        };
        inheritedBreadcrumb.push(parentBreadcrumb);
        breadcrumb = inheritedBreadcrumb;
        submitFormHandler ();
        return true;
      } if (checkData.type === 'compendium-landing-page' && pageType === 'compendium-landing-page') {
        contentUrlTmp = parentUrl.split('/');
        contentUrlTmp.splice(-1, 1);
        contentUrl = contentUrlTmp.join('/');
        $('#location').val(contentUrl);
        breadcrumb = checkData.breadcrumb;
        pageTitle = checkData.description.title;
        isInheriting = true;
        submitFormHandler (pageTitle, contentUrl, isInheriting);
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

  function submitFormHandler (title, uri, isInheriting) {
    if (pageType === 'compendium-landing-page') {
      $('.edition').append(
        '<label for="edition">Edition</label>' +
        '<input id="edition" type="text" placeholder="August 2010, Q3 2015, 1978, etc." />'
      );
    } if ((pageType === 'compendium-landing-page') && (!releaseDate)) {
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
      releaseDateManual = $('#releaseDate').val()
      pageData = pageTypeDataT6(pageType);
      parent = $('#location').val().trim();
      if (pageType === 'compendium-landing-page') {
        pageData.description.edition = $('#edition').val();
      }
      if (title) {
        //do nothing;
      } else {
        pageTitle = $('#pagename').val();
      }
      pageData.description.title = pageTitle;
      uriSection = pageType + "s";
      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
      if (releaseDateManual) {                                                          //Manual collections
        date = $.datepicker.parseDate("dd MM yy", releaseDateManual);
        releaseUri = $.datepicker.formatDate('yy-mm-dd', date);
      } else {
        releaseUri = $.datepicker.formatDate('yy-mm-dd', new Date(releaseDate));
      }

      if ((pageType === 'compendium-landing-page') && (!releaseDate)) {
        pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
      } else {
        pageData.description.releaseDate = releaseDate;
      }
      if (isInheriting) {
        newUri = makeUrl(parent, pageTitleTrimmed, releaseUri);
      } else {
        if ((pageType === 'compendium-landing-page')) {
          newUri = makeUrl(parent, uriSection, pageTitleTrimmed, releaseUri);
        } else {
          newUri = makeUrl(parent, uriSection, pageTitleTrimmed);
        }
      }
      pageData.uri = '/' + newUri;
      pageData.breadcrumb = breadcrumb;

      if ((pageType === 'compendium-landing-page') && (!pageData.description.edition)) {
        alert('Edition can not be empty');
        return true;
      } if ((pageType === 'compendium-landing-page') && (!pageData.description.releaseDate)) {
        alert('Release date can not be empty');
        return true;
      } if (pageTitle.length < 4) {
        alert("This is not a valid file title");
        return true;
      }
       else {
        postContent(collectionId, newUri, JSON.stringify(pageData),
          success = function (message) {
            console.log("Updating completed " + message);
            viewWorkspace(newUri, collectionId, 'edit');
            refreshPreview(newUri);
          },
          error = function (response) {
            if (response.status === 400) {
              alert("Cannot edit this file. It is already part of another collection.");
            }
            else if (response.status === 401) {
              alert("You are not authorised to update content.");
            }
            else {
              handleApiError(response);
            }
          }
        );
      }
      e.preventDefault();
    });
  }

  function pageTypeDataT6(pageType) {

    if (pageType === "compendium-landing-page") {
      return {
        "description": {
          "releaseDate": "",
          "nextRelease": "",
          "contact": {
            "name": "",
            "email": "",
            "telephone": ""
          },
          "summary": "",
          "keywords": [],
          "metaDescription": "",
          "nationalStatistic": false,
          "title": "",
        },
        "datasets": [],
        "chapters": [],
        "correction": [],
        "relatedMethodology": [],
        type: pageType,
        "uri": "",
        "breadcrumb": [],
      };
    }

    else {
      alert('unsupported page type');
    }
  }

}

