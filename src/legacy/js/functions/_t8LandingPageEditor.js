function datasetLandingEditor(collectionId, data) {

  var newDatasets = [], newLinks = [], newRelatedDocuments = [], newRelatedQmi = [], newRelatedMethodology = [];
  var setActiveTab, getActiveTab;
  var renameUri = false;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Florence.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Florence.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  resolveTitleT8(collectionId, data, 'datasets');

  // Metadata edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
  });
  //if (!Florence.collection.date) {                      //overwrite scheduled collection date
  if (!data.description.releaseDate) {
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
    });
  } else {
    dateTmp = data.description.releaseDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
    });
  }
  //} else {
  //    $('.release-date').hide();
  //}
  $("#nextRelease").on('input', function () {
    $(this).textareaAutoSize();
    data.description.nextRelease = $(this).val();
  });
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
  });
  $("#contactEmail").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
  });
  $("#contactTelephone").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
  });
  $("#datasetId").on('input', function () {
    $(this).textareaAutoSize();
    data.description.datasetId = $(this).val();
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
  });
  $("#metaCmd").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaCmd = $(this).val();
  });
  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
      return false;
    } else {
      return true;
    }
  };
  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.description.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
    console.log(data);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save(saveAndCompleteContent);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save(saveAndReviewContent);
  });

  function save(onSave) {

    Florence.globalVars.pagePos = $(".workspace-edit").scrollTop();

    // Datasets are uploaded. Save metadata
    var orderDataset = $("#sortable-edition").sortable('toArray');
    $(orderDataset).each(function (indexF, nameF) {
      var file = data.datasets[parseInt(nameF)].uri;
      newDatasets[indexF] = {uri: file};
    });
    data.datasets = newDatasets;

    // links
    var orderLink = $("#sortable-link").sortable('toArray');
    $(orderLink).each(function (indexL, nameL) {
      var displayText = data.links[parseInt(nameL)].title;
      var link = $('#link-uri_' + nameL).val();
      newLinks[indexL] = {uri: link, title: displayText};
    });
    data.links = newLinks;

    // tags
    if ($("#selectTopic").val() && $("#selectSubTopic").val()) {
      data.description.canonicalTopic = $("#selectTopic").val()[0]
      data.description.secondaryTopics = $("#selectSubTopic").val()
    }
    else if ($("#selectTopic").val() && !$("#selectSubTopic").val()) {
      sweetAlert("Cannot save this page", "A value is required for 'Subtopic' if a 'Topic' has been selected");
      return
    } 

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}

function resolveTitleT8(collectionId, data, field) {
  var ajaxRequest = [];
  var templateData = $.extend(true, {}, data);
  $(templateData[field]).each(function (index, path) {
    templateData[field][index].description = {};
    var eachUri = path.uri;
    var dfd = $.Deferred();
    getPageDataTitle(collectionId, eachUri,
      function (response) {
        templateData[field][index].description.edition = response.edition;
        templateData[field][index].uri = eachUri;
        dfd.resolve();
      },
      function () {
        sweetAlert("Error", field + ' address: ' + eachUri + ' is not found.', "error");
        dfd.resolve();
      }
    );
    ajaxRequest.push(dfd);
  });

  $.when.apply($, ajaxRequest).then(function () {
    var dataTemplate = templateData[field];
    var html = templates.workEditT8LandingDatasetList(dataTemplate);
    $('#edition').replaceWith(html);
    addEditionEditButton(collectionId, data, templateData);
  });
}

function addEditionEditButton(collectionId, data, templateData) {
  // Load dataset to edit
  $(templateData.datasets).each(function (index) {
    //open document
    $("#edition-edit_" + index).click(function () {
      var selectedEdition = data.datasets[index].uri;
      Florence.globalVars.activeTab = '';
      createWorkspace(selectedEdition, collectionId, 'edit');
    });

    $('#edition-edit-label_' + index).click(function () {
      var selectedEdition = data.datasets[index].uri;
      getPageData(collectionId, selectedEdition,
        function (pageData) {
          var markdown = pageData.description.edition;
          var editedSectionValue = {title: 'Edition title', markdown: markdown};
          var saveContent = function (updatedContent) {
            pageData.description.edition = updatedContent;
            var childTitle = updatedContent.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
            putContent(collectionId, pageData.uri, JSON.stringify(pageData),
              function () {
                //save children changes and move
                checkRenameUri(collectionId, pageData, true, updateContent);
                //update dataset uri in parent and save
                data.datasets[index].uri = data.uri + "/" + childTitle;
                putContent(collectionId, data.uri, JSON.stringify(data),
                  function () {},
                  function (response) {
                    if (response.status === 409) {
                      sweetAlert("Cannot edit this page", "It is already part of another collection.");
                    } else {
                      handleApiError(response);
                    }
                  }
                );
              },
              function (message) {
                if (message.status === 400) {
                  sweetAlert("Cannot edit this page", "It is already part of another collection.");
                }
                else {
                  handleApiError(message);
                }
              }
            );
          };
          loadMarkdownEditor(editedSectionValue, saveContent, pageData);
        },
        function (message) {
          handleApiError(message);
        }
      );
    });

    // Delete (assuming datasets in makeEditSection - not dynamic fields here)
    $('#edition-delete_' + index).click(function () {
      swal({
        title: "Warning",
        text: "Are you sure you want to delete this edition?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function (result) {
        if (result === true) {
          swal({
            title: "Deleted",
            text: "This edition has been deleted",
            type: "success",
            timer: 2000
          });
          var position = $(".workspace-edit").scrollTop();
          Florence.globalVars.pagePos = position;
          $('#edition-delete_' + index).parent().remove();
          $.ajax({
            url: "/zebedee/content/" + collectionId + "?uri=" + data.datasets[index].uri,
            type: "DELETE",
            success: function (res) {
              console.log(res);
            },
            error: function (res) {
              console.log(res);
            }
          });
          data.datasets.splice(index, 1);
          updateContent(collectionId, data.uri, JSON.stringify(data));
        }
      });
    });
  });

  function sortableSections() {
    $("#sortable-edition").sortable();
  }

  sortableSections();
}
