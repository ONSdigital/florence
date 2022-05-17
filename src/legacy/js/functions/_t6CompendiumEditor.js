function compendiumEditor(collectionId, data, templateData) {

//  var index = data.release;
  var newChapters = [];
  var lastIndexChapter, lastIndexDataset;
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

  resolveTitleT6(collectionId, data, templateData, 'chapters');
  resolveTitleT6(collectionId, data, templateData, 'datasets');

  // Metadata load, edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#edition").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.edition = $(this).val();
  });
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
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
  });
  $("#headline").on('input', function () {
    $(this).textareaAutoSize();
    data.description.headline = $(this).val();
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

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
   var checkBoxStatus = function (value) {
    if (value === "" || value === "false" || value === false) {
        return false;
    }
    return true;
  };

  $("#natStat-checkbox").prop('checked', checkBoxStatus(data.description.nationalStatistic)).click(function () {
    data.description.nationalStatistic = $("#natStat-checkbox").prop('checked');
  });

  //Add new chapter
  $("#add-chapter").one('click', function () {
    var chapterTitle;
    $('#sortable-chapter').append(
      '<div id="' + lastIndexChapter + '" class="edit-section__sortable-item">' +
      '<textarea class="auto-size" id="new-chapter-title" placeholder="Type title here and click add"></textarea>' +
      '<div class="edit-section__buttons">' +
      '<button class="btn-markdown-edit" id="chapter-add">Edit chapter</button>' +
      '</div>' +
      '</div>');
    $('#new-chapter-title').on('input', function () {
      $(this).textareaAutoSize();
      chapterTitle = $(this).val();
    });
    $('#chapter-add').on('click', function () {
      if (chapterTitle.length < 5) {
        sweetAlert("This is not a valid file title");
        return true;
      } else {
        loadT6Creator(collectionId, data.description.releaseDate, 'compendium_chapter', data.uri, chapterTitle);
      }
    });
  });

  //Add new table (only one per compendium)
  if (!data.datasets || data.datasets.length === 0) {
    $("#add-compendium-data").one('click', function () {
      var tableTitle;
      $('#sortable-compendium-data').append(
        '<div id="' + lastIndexDataset + '" class="edit-section__item">' +
        '<textarea class="auto-size" id="new-compendium-data-title" placeholder="Type title here and click add"></textarea>' +
        '<div class="edit-section__buttons">' +
        '<button class="btn-markdown-edit" id="compendium-data-add">Edit data</button>' +
        '</div>' +
        '</div>');
      $('#new-compendium-data-title').on('input', function () {
        $(this).textareaAutoSize();
        tableTitle = $(this).val();
      });
      $('#compendium-data-add').on('click', function () {
        if (tableTitle.length < 5) {
          sweetAlert("This is not a valid file title");
          return true;
        } else {
          loadT6Creator(collectionId, data.description.releaseDate, 'compendium_data', data.uri, tableTitle);
        }
      });
    });
  } else {
    $('#add-compendium-data').hide().one('click', function () {
      sweetAlert('At the moment you can have one section here.');
    });
  }

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
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

    // Chapters
    var orderRelatedChapter = $("#sortable-chapter").sortable('toArray');
    $(orderRelatedChapter).each(function (indexC, nameC) {
      var uri = data.chapters[parseInt(nameC)].uri;
      var safeUri = checkPathSlashes(uri);
      newChapters[indexC] = {uri: safeUri};
    });
    data.chapters = newChapters;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}

function resolveTitleT6(collectionId, data, templateData, field) {
  var ajaxRequest = [];
  $(templateData[field]).each(function (index, path) {
    templateData[field][index].description = {};
    var eachUri = path.uri;
    var dfd = $.Deferred();
    getPageDataTitle(collectionId, eachUri,
      function (response) {
        templateData[field][index].description.title = response.title;
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
    if (field === 'datasets') {
      var html = templates.workEditT6Dataset(dataTemplate);
    } else {
      var html = templates.workEditT6Chapter(dataTemplate);
    }
    $('#' + field).replaceWith(html);

    if (field === 'datasets') {
      editData(collectionId, data);
    } else {
      editChapters(collectionId, data);
    }
  });
}

function editChapters(collectionId, data) {
  // Edit chapters
  // Load chapter to edit
  $(data.chapters).each(function (index) {
    lastIndexChapter = index + 1;

    //open document
    $("#chapter-edit_" + index).click(function () {
      var selectedChapter = data.chapters[index].uri;
      createWorkspace(selectedChapter, collectionId, 'edit');
    });

    $('#chapter-edit-label_' + index).click(function () {
      var selectedChapter = data.chapters[index].uri;
      getPageData(collectionId, selectedChapter,
        function (pageData) {
          var markdown = pageData.description.title;
          var editedSectionValue = {title: 'Compendium chapter title', markdown: markdown};
          var saveContent = function (updatedContent) {
            pageData.description.title = updatedContent;
            var childTitle = updatedContent.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
            putContent(collectionId, pageData.uri, JSON.stringify(pageData),
              function () {
                //save children change and move
                checkRenameUri(collectionId, pageData, true, updateContent);
                putContent(collectionId, data.uri, JSON.stringify(data),
                  function () {
                    // on success update dataset uri in parent and save
                    data.chapters[index].uri = data.uri + "/" + childTitle;
                  },
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

    // Delete
    $("#chapter-delete_" + index).click(function () {
      swal({
        title: "Warning",
        text: "You are going to delete the chapter this link refers to. Are you sure you want to proceed?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function (result) {
        if (result === true) {
          var selectedChapter = data.chapters[index].uri;
          var path = data.uri;
          $("#" + index).remove();
          data.chapters.splice(index, 1);
          putContent(collectionId, path, JSON.stringify(data),
            function () {
              swal({
                title: "Deleted",
                text: "This file has been deleted",
                type: "success",
                timer: 2000
              });
              Florence.Editor.isDirty = false;
              deleteContent(collectionId, selectedChapter, function () {
                refreshPreview(path);
                loadPageDataIntoEditor(path, collectionId);
              }, error);
            },
            function (response) {
              if (response.status === 400) {
                sweetAlert("Cannot edit this page", "It is already part of another collection.");
              }
              else {
                handleApiError(response);
              }
            }
          );
        }
      });
    });
  });

  function sortableSections() {
    $("#sortable-chapter").sortable();
  }

  sortableSections();
}

function editData(collectionId, data) {
  // Edit data reference table
  // Load table to edit
  if (!data.datasets || data.datasets.length === 0) {
    lastIndexDataset = 0;
  } else {
    $(data.datasets).each(function (index) {
      //open document
      var selectedData = data.datasets[index].uri;
      $("#compendium-data-edit_" + index).click(function () {
        refreshPreview(selectedData);
        viewWorkspace(selectedData, collectionId, 'edit');
      });

      $('#compendium-data-edit-label_' + index).click(function () {
        getPageData(collectionId, selectedData,
          function (pageData) {
            var markdown = pageData.description.title;
            var editedSectionValue = {title: 'Compendium dataset title', markdown: markdown};
            var saveContent = function (updatedContent) {
              pageData.description.title = updatedContent;
              var childTitle = updatedContent.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
              putContent(collectionId, pageData.uri, JSON.stringify(pageData),
                function () {
                  //save children changes
                  //move
                  checkRenameUri(collectionId, pageData, true, updateContent);
                  putContent(collectionId, data.uri, JSON.stringify(data),
                    function () {
                      // on success update dataset uri in parent and save
                      data.datasets[index].uri = data.uri + "/" + childTitle;
                    },
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

      // Delete
      $("#compendium-data-delete_" + index).click(function () {
        //var result = confirm("You are going to delete the chapter this link refers to. Are you sure you want to proceed?");
        swal({
          title: "Warning",
          text: "You are going to delete the chapter this link refers to. Are you sure you want to proceed?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          closeOnConfirm: false
        }, function (result) {
          if (result === true) {
            var selectedData = data.datasets[index].uri;
            var path = data.uri;
            $("#" + index).remove();
            data.datasets.splice(index, 1);
            putContent(collectionId, path, JSON.stringify(data),
              function () {
                swal({
                  title: "Deleted",
                  text: "This file has been deleted",
                  type: "success",
                  timer: 2000
                });
                Florence.Editor.isDirty = false;
                deleteContent(collectionId, selectedData, function () {
                  refreshPreview(path);
                  loadPageDataIntoEditor(path, collectionId);
                }, error);
              },
              function (response) {
                if (response.status === 400) {
                  sweetAlert("Cannot edit this page", "It is already part of another collection.");
                }
                else {
                  handleApiError(response);
                }
              }
            );
          }
        });
      });
    });
  }
}

