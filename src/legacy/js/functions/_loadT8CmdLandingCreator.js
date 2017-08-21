/**
 * Creates data JSON
 * @param collectionId
 * @param releaseDate
 * @param pageType
 * @param parentUrl
 */

function loadT8CmdCreator(collectionId, releaseDate, pageType, parentUrl, pageTitle) {
    var releaseDate = null;             //overwrite scheduled collection date
    var uriSection, pageTitleTrimmed, releaseDateManual, newUri, pageData;
    var parentUrlData = parentUrl + "/data";

    $.ajax({
        url: parentUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (checkData) {
            if (checkData.type === 'product_page' && !Florence.globalVars.welsh) {
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
        $('.btn-page-create').hide();
        $('#pagename').remove();
        $('.edition').append(
          '<button class="btn btn--positive margin-left--0 btn-get-recipes">Import data</button>'
        );

        $('.btn-get-recipes').on('click', function(){
          getRecipes();
          return false;
        });

        $('form').off().submit(function (e) {
            var getPageName = $('#cmdDatasetName').val();
            $('#pagename').val(getPageName);
            var nameValid = validatePageName();
            if (!nameValid) {
                return false;
            }

            pageData = pageTypeDataT8(pageType);
            pageTitle = $('#pagename').val();
            pageData.description.title = pageTitle;
            cmdDatsetID = $('#cmdDatasetId span').text();
            pageData.cmdDatasetId = cmdDatsetID;
            uriSection = "datasets";
            pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
            newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed);
            var safeNewUri = checkPathSlashes(newUri);

            if (pageTitle.length < 5) {
                sweetAlert("This is not a valid file title");
                return true;
            }
            else {
                saveContent(collectionId, safeNewUri, pageData);
            }
            e.preventDefault();
        });
    }

    // Call the recipe API, get data and create elements.
    function getRecipes() {
      $.ajax({
          url: 'http://localhost:8081/recipes',
          dataType: 'json',
          crossDomain: true,
          success: function (recipeData) {
            var templateData = {};
            $.each(recipeData.items, function(i, v) {
              // Get the dataset names and id's
              var datasetName = v.alias,
                  datasetId = v.output_instances[0].dataset_id;
              // Create elements, store data in data attr to be used later
              templateData  = {
                  content: '<li><h1>' + datasetName + '</h1><button data-datasetid="'+ datasetId +'" data-datasetname="'+ datasetName +'" class="btn btn--inverse margin-left--0 btn-import">Import</button></li>'
              };
            });
            // Load modal and add the data
            viewRecipeModal(templateData);
          },
          error: function () {
            sweetAlert("There is a problem fetching the data");
            loadCreateScreen(parentUrl, collectionId);
          }
      });

      // Add the data to the details panel
      // TO DO - A call will need to be made to the dataset API when it's ready
      // to get the meta data we need to create the page.
      $('body').on('click', '.btn-import', function(){
        var getDatasetID = $(this).data('datasetid'),
            getDatasetName = $(this).data('datasetname');
        $('.btn-get-recipes, .dataset-list').remove();
        $('.btn-page-create').show();
        $('.edition').append(
          '<div id="cmdDatasetId">Imported dataset ID: <span>'+getDatasetID+'</span></div>' +
          '<label for="cmdDatasetName">Dataset name</label>' +
          '<input id="cmdDatasetName" type="text" value="'+getDatasetName+'" />'+
          // Hidden input for #pagename so it can be validated
          // Populated with #cmdDatasetName value on submit
          '<input id="pagename" type="hidden" value="" />'
        );
        $('#js-modal-recipe').remove();
        return false;
      });

    }

    function pageTypeDataT8(pageType) {
              // Add the data to the page data in Zebedee
              if (pageType === "cmd_dataset_landing_page") {
                  return {
                      "cmdDatasetId": "",
                      "description": {
                        "title": ""
                      },
                      type: pageType
                  };
              }
              else {
                  sweetAlert('Unsupported page type. This is not a dataset type');
              }
    }
}
