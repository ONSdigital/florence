/**
 * Creates data JSON
 * @param collectionId
 * @param releaseDate
 * @param pageType
 * @param parentUrl
 */

function loadT8ApiCreator(collectionId, releaseDate, pageType, parentUrl, pageTitle) {
    var releaseDate = null;             //overwrite scheduled collection date
    var uriSection, pageTitleTrimmed, releaseDateManual, newUri, pageData, datasetId;
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
            var getPageName = $('#apiDatasetName').val();
            $('#pagename').val(getPageName);
            var nameValid = validatePageName();
            if (!nameValid) {
                return false;
            }

            pageData = pageTypeDataT8(pageType);
            pageTitle = $('#pagename').val();
            pageData.description.title = pageTitle;
            apiDatasetID = $('#apiDatasetId span').text();
            pageData.apiDatasetId = apiDatasetID;
            uriSection = "datasets";
            pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
            newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed);
            var safeNewUri = checkPathSlashes(newUri);

            if (pageTitle.length < 5) {
                sweetAlert("This is not a valid file title");
                return true;
            }
            else {
                isUpdatingModal.add();

                // on creation use /page end point instead of content.
                // the /page end point will create the dataset entry
                // in the database

                $.ajax({
                    url: "/zebedee/page/" + collectionId + "?uri=" + safeNewUri + "/data.json",
                    dataType: 'json',
                    contentType: 'application/json',
                    type: 'POST',
                    data: JSON.stringify(pageData),
                    success: function (response) {
                        isUpdatingModal.remove();
                        addLocalPostResponse(response);
                        createWorkspace(safeNewUri, collectionId, 'edit', null, null, pageData.apiDatasetId);
                    },
                    error: function (response) {
                        isUpdatingModal.remove();
                        addLocalPostResponse(response);
                        handleApiError(response);
                    }
                });
            }
            e.preventDefault();
        });
    }

    // Call the recipe API, get data and create elements.
    function getRecipes() {
    $.when(
        $.ajax({
            url: '/recipes',
            dataType: 'json',
            crossDomain: true,
        }),
        $.ajax({
            url: '/dataset/datasets',
            dataType: 'json',
            crossDomain: true,
        })
    ).then(function(recipeResponse, datasetResponse){
        const recipesWithoutExistingDataset = recipeResponse[0].items.filter(recipeItem => {
            const doesMatchRecipe = datasetResponse[0].items.some(datasetItem => {
                return recipeItem.output_instances[0].dataset_id === datasetItem.id
            });
            return !doesMatchRecipe;
        });

        var templateData = {};
        var content = "";
        $.each(recipesWithoutExistingDataset, function(i, v) {
            // Get the dataset names and id's
            var datasetAlias = v.alias;
            var datasetName = v.output_instances[0].title;
            var datasetId = v.output_instances[0].dataset_id;
            // Create elements, store data in data attr to be used later
            content =  content + '<li><div class="float-left col--8"><h3>' + datasetAlias + '</h3></div><button data-datasetid="'+ datasetId +'" data-datasetname="'+ datasetName +'" class="btn btn--primary btn-import">Connect</button></li>'
        });
        templateData.content = content;
        // Load modal and add the data
        viewRecipeModal(templateData);
    }).fail(function(){
        sweetAlert("There is a problem fetching the data");
        loadCreateScreen(parentUrl, collectionId);
    })

      // Add the data to the details panel
      // TO DO - A call will need to be made to the dataset API when it's ready
      // to get the meta data we need to create the page.
      $('body').on('click', '.btn-import', function(){
        var getDatasetID = $(this).data('datasetid'),
            getDatasetName = $(this).data('datasetname');
        $('.btn-get-recipes, .dataset-list').remove();
        $('.btn-page-create').show();
        if($('.apiDatasetBlock').length) {
          $('.apiDatasetBlock').remove();
        }
        $('.edition').append(
          '<div class="apiDatasetBlock">' +
          '<div id="apiDatasetId">Connected dataset ID: <span>'+getDatasetID+'</span></div>' +
          '<label for="apiDatasetName">Dataset name</label>' +
          '<input id="apiDatasetName" type="text" value="'+getDatasetName+'" />'+
          // Hidden input for #pagename so it can be validated
          // Populated with #apiDatasetName value on submit
          '<input id="pagename" type="hidden" value="" />' +
          '</div>'
        );
        $('#js-modal-recipe').remove();
        return false;
      });
      
    }

    function pageTypeDataT8(pageType) {
              // Add the data to the page data in Zebedee
              if (pageType === "api_dataset_landing_page") {
                  return {
                      "apiDatasetId": "",
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
