function datasetEditor(collectionId, data) {

  var newFiles = [], newNotes = [], newRelated = [], newUsedIn = [], newRelatedMethodology = [];
  var lastIndexRelated, lastIndexUsedIn, lastIndexFile = 0;
  var uriUpload;
  var setActiveTab, getActiveTab;

  $(".edit-accordion").on('accordionactivate', function(event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if(setActiveTab !== false) {
      localStorage.setItem('activeTab', setActiveTab);
    }
  });

  getActiveTab = localStorage.getItem('activeTab');
  accordion(getActiveTab);

  $("#content").remove();
  $(".edition").hide();


  // Metadata edition and saving
  $("#title").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#summary").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
  });
  if (!data.description.releaseDate){
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
    $('#releaseDate').on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
    });
  } else {
    $('.release-date').hide();
  }
  $("#nextRelease").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.nextRelease = $(this).val();
  });
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
  });
  $("#contactEmail").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
  });
  $("#contactTelephone").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
  });
  $("#summary").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
  });
  $("#keywords").on('change', function () {
    $(this).textareaAutoSize();
    var stringToArray = $(this).val();
    var resultArray = stringToArray.split(', ')
    data.description.keywords = resultArray;
  });
  $("#metaDescription").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if(data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
      return false;
    } else {
      return true;
    }
  };
  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.description.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
  });

  // Correction section
  // Load
  $(data.correction).each(function (index, correction) {

    $("#correction_text_" + index).on('click keyup', function () {
      $(this).textareaAutoSize();
      data.correction[index].text = $(this).val();
    });
    $("#correction_date_" + index).val(correction.date).on('click keyup', function () {
      data.correction[index].date = $(this).val();
    });

    // Delete
    $("#correction-delete_" + index).click(function () {
      $("#" + index).remove();
      data.correction.splice(index, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  // New correction
  $("#addCorrection").one('click', function () {
    data.correction.push({text:"", date:""});
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });


  // Edit download
  // Load and edition
  $(data.download).each(function (index) {
    lastIndexFile = index + 1;

    // Delete
    $("#file-delete_"+index).click(function() {
      $("#"+index).remove();
      $.ajax({
        url: "/zebedee/content/" + collectionId + "?uri=" + data.download[index].file,
        type: "DELETE",
        success: function (res) {
          console.log(res);
        },
        error: function (res) {
          console.log(res);
        }
      });
      data.download.splice(index, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new download
  $("#addFile").one('click', function () {
    $('#sortable-download').append(
        '<div id="' + lastIndexFile + '" class="edit-section__sortable-item">' +
        '  <form id="UploadForm" action="" method="post" enctype="multipart/form-data">' +
        '    <p><input type="file" name="files" id="files">' +
        '    <p>' +
        '  </form>' +
        '  <div id="response"></div>' +
        '  <ul id="list"></ul>' +
        '</div>');

    (function () {
      var input = document.getElementById("files"), formdata = false;

      if (window.FormData) {
        formdata = new FormData();
      }
      function showUploadedItem (source) {
        var list = document.getElementById("list"),
            li   = document.createElement("li"),
            para = document.createElement("p"),
            text = document.createTextNode(source);
        para.appendChild(text);
        li.appendChild(para);
        list.appendChild(li);
      }
      if (input.addEventListener) {
        input.addEventListener("change", function (evt) {
          document.getElementById("response").innerHTML = "Uploading . . .";

          var file = this.files[0];
          uriUpload = getPathName() + "/" + file.name;

          if (data.downloads.length > 0) {
            $(data.downloads).each(function (i, filesUploaded) {
              if (filesUploaded.file == uriUpload) {
                alert('This file already exists');
                $('#' + lastIndexFile).remove();
                datasetEditor(collectionId, data);
                return;
              }
            });
            if (!!file.name.match(/\.csv$|.xls$|.file$|.zip$/)) {
              showUploadedItem(file.name);
              if (formdata) {
                formdata.append("name", file);
              }
            } else {
              alert('This file type is not supported');
              $('#' + lastIndexFile).remove();
              datasetEditor(collectionId, data);
              return;
            }

            if (formdata) {
              $.ajax({
                url: "/zebedee/content/" + collectionId + "?uri=" + uriUpload,
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false,
                success: function (res) {
                  document.getElementById("response").innerHTML = "File uploaded successfully";
                  data.downloads.push({title:'', xls: uriUpload});
                  updateContent(collectionId, getPathName(), JSON.stringify(data));
                }
              });
            }
          } else {
            if (!!file.name.match(/\.csv$|.xls$|.file$|.zip$/)) {
              showUploadedItem(file.name);
              if (formdata) {
                formdata.append("name", file);
              }
            } else {
              alert('This file type is not supported');
              $('#' + lastIndexFile).remove();
              datasetEditor(collectionId, data);
              return;
            }

            if (formdata) {
              $.ajax({
                url: "/zebedee/content/" + collectionId + "?uri=" + uriUpload,
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false,
                success: function (res) {
                  document.getElementById("response").innerHTML = "File uploaded successfully";
                  data.downloads.push({title:'', xls: uriUpload});
                  updateContent(collectionId, getPathName(), JSON.stringify(data));
                }
              });
            }
          }
        }, false);
      }
    })();
  });

  function sortableFiles() {
    $("#sortable-download").sortable();
  }
  sortableFiles();

  // Edit notes
  // Load and edition
  $(data.section).each(function(index, note) {

    $("#note-edit_"+index).click(function() {
      var editedSectionValue = $("#note-markdown_" + index).val();

      var saveContent = function(updatedContent) {
//        data.section[index].markdown = updatedContent;
        data.section.markdown = updatedContent;
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
//    $("#note-delete_"+index).click(function() {
//      $("#"+index).remove();
//      data.section.splice(index, 1);
//      updateContent(collectionId, getPathName(), JSON.stringify(data));
//    });
    $("#note-delete_"+index).click(function() {
      $("#"+index).remove();
      data.section = {};
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new note
//  $("#addNote").one('click', function () {
//    data.section.push({markdown:""});
//    updateContent(collectionId, getPathName(), JSON.stringify(data));
//  });

  if (!data.section) {
    $("#addNote").one('click', function () {
      data.section = {markdown:""};
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  } else {
    $("#addNote").one('click', function () {
      alert('At the moment you can have one section here.')
    });
  }

//  function sortableNotes() {
//    $("#sortable-notes").sortable();
//  }
//  sortableNotes();

  // Related datasets
  // Load
  if (!data.relatedDatasets) {
    lastIndexRelated = 0;
  } else {
    $(data.relatedDatasets).each(function (iDataset) {
      lastIndexRelated = iDataset + 1;

      // Delete
      $("#dataset-delete_" + iDataset).click(function () {
        $("#" + iDataset).remove();
        data.relatedDatasets.splice(iDataset, 1);
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      });
    });
  }

  //Add new related
  $("#addDataset").one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-related').append(
        '<div id="' + lastIndexRelated + '" class="edit-section__sortable-item">' +
        '  <textarea id="dataset-uri_' + lastIndexRelated + '" placeholder="Go to the related dataset and click Get"></textarea>' +
        '  <button class="btn-page-get" id="dataset-get_' + lastIndexRelated + '">Get</button>' +
        '  <button class="btn-page-cancel" id="dataset-cancel_' + lastIndexRelated + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#dataset-get_" + lastIndexRelated).one('click', function () {
      pastedUrl = $('#dataset-uri_'+lastIndexRelated).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var datasetUrlData = myUrl.pathname + "/data";
      } else {
        var datasetUrl = $('#iframe')[0].contentWindow.document.location.pathname;
        var datasetUrlData = datasetUrl + "/data";
      }
      pastedUrl = null;

      $.ajax({
        url: datasetUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'dataset') {
            if (!data.relatedDatasets) {
              data.relatedDatasets = [];
            }
            data.relatedDatasets.push({uri: relatedData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not a dataset");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });

    $("#dataset-cancel_" + lastIndexRelated).one('click', function () {
      createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortableRelated() {
    $("#sortable-related").sortable();
  }
  sortableRelated();

  // Related documents (articles or bulletins where dataset is used in)
  // Load
  if (!data.relatedDocuments) {
    lastIndexUsedIn = 0;
  } else {
    $(data.relatedDocuments).each(function (iUsed, relatedDocuments) {
      lastIndexUsedIn = iUsed + 1;

      // Delete
      $("#used-delete_" + iUsed).click(function () {
        $("#" + iUsed).remove();
        data.relatedDocuments.splice(iUsed, 1);
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      });
    });
  }

  //Add new articles or bulletins where dataset is used in
  $("#addUsed").one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-used').append(
        '<div id="' + lastIndexUsedIn + '" class="edit-section__sortable-item">' +
        '  <textarea id="used-uri_' + lastIndexUsedIn + '" placeholder="Go to the related document and click Get"></textarea>' +
        '  <button class="btn-page-get" id="used-get_' + lastIndexUsedIn + '">Get</button>' +
        '  <button class="btn-page-cancel" id="used-cancel_' + lastIndexUsedIn + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#used-get_" + lastIndexUsedIn).one('click', function () {
      pastedUrl = $('#used-uri_'+lastIndexRelated).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var usedInUrlData = myUrl.pathname + "/data";
      } else {
        var usedInUrl = $('#iframe')[0].contentWindow.document.location.pathname;
        var usedInUrlData = usedInUrl + "/data";
      }
      pastedUrl = null;

      $.ajax({
        url: usedInUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (usedInData) {
          if (usedInData.type === 'bulletin' || usedInData.type === 'article') {
            if (!data.relatedDocuments) {
              data.relatedDocuments = [];
            }
            data.relatedDocuments.push({uri: usedInData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not an article or a bulletin");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });

    $("#used-cancel_" + lastIndexUsedIn).one('click', function () {
     createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortableUsedIn() {
    $("#sortable-used").sortable();
  }
  sortableUsedIn();

  // Related methodology
  // Load
  if (!data.relatedMethodology) {
    lastIndexRelatedMethodology = 0;
  } else {
    $(data.relatedMethodology).each(function (iMethodology, relatedMethodology) {
      lastIndexRelatedMethodology = iMethodology + 1;

      // Delete
      $("#used-delete_" + iMethodology).click(function () {
        $("#" + iMethodology).remove();
        data.relatedMethodology.splice(iMethodology, 1);
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      });
    });
  }

  //Add related methodology
  $("#addMethodology").one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-methodology').append(
        '<div id="' + lastIndexRelatedMethodology + '" class="edit-section__sortable-item">' +
        '  <textarea id="methodology-uri_' + lastIndexRelatedMethodology + '" placeholder="Go to the related document and click Get"></textarea>' +
        '  <button class="btn-page-get" id="methodology-get_' + lastIndexRelatedMethodology + '">Get</button>' +
        '  <button class="btn-page-cancel" id="methodology-cancel_' + lastIndexRelatedMethodology + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#methodology-get_" + lastIndexRelatedMethodology).one('click', function () {
      pastedUrl = $('#methodology-uri_'+lastIndexRelated).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var relatedMethodologyUrlData = myUrl.pathname + "/data";
      } else {
        var relatedMethodologyUrl = $('#iframe')[0].contentWindow.document.location.pathname;
        var relatedMethodologyUrlData = relatedMethodologyUrl + "/data";
      }
      pastedUrl = null;

      $.ajax({
        url: relatedMethodologyUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedMethodologyData) {
          if (relatedMethodologyData.type === 'methodology') {
            if (!data.relatedMethodology) {
              data.relatedMethodology = [];
            }
            data.relatedMethodology.push({uri: relatedMethodologyData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not a methodology");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });

    $("#methodology-cancel_" + lastIndexRelatedMethodology).one('click', function () {
     createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortableRelatedMethodology() {
    $("#sortable-methodology").sortable();
  }
  sortableRelatedMethodology();

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save();
  });

  // completed to review
    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
      //pageData = $('.fl-editor__headline').val();
      saveData();
      saveAndCompleteContent(collectionId, getPathName(), JSON.stringify(data));
    });

    // reviewed to approve
    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
      saveData()
      saveAndReviewContent(collectionId, getPathName(), JSON.stringify(data));
    });

  function save() {
    saveData();
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  }

  function saveData() {
    // Files are uploaded. Save metadata
    var orderFile = $("#sortable-download").sortable('toArray');
    $(orderFile).each(function(indexF, nameF){
      var title = $('#download-title_'+nameF).val();
      var file = $('#download-filename_' + nameF).val();
      newFiles[indexF] = {title: title, xls: file};
    });
    data.downloads = newFiles;
    //console.log(data.download);
    // Notes
//    var orderNote = $("#sortable-notes").sortable('toArray');
//    $(orderNote).each(function (indexT, nameT) {
//      var markdown = $('#note-markdown_' + nameT).val();
//      newNotes[indexT] = {markdown: markdown};
//    });
//    data.section = newNotes;
    data.section = {markdown: $('#note-markdown_0').val()};
    // Related datasets
    var orderDataset = $("#sortable-related").sortable('toArray');
    $(orderDataset).each(function (indexD, nameD) {
      var uri = $('#dataset-uri_' + nameD).val();
      newRelated[indexD]= {uri: uri};
    });
    data.relatedDatasets = newRelated;
    // Used in links
    var orderUsedIn = $("#sortable-used").sortable('toArray');
    $(orderUsedIn).each(function(indexU, nameU){
      var uri = $('#used-uri_'+nameU).val();
      newUsedIn[parseInt(indexU)] = {uri: uri};
    });
    data.relatedDocuments = newUsedIn;
    // Related methodology
    var orderRelatedMethodology = $("#sortable-methodology").sortable('toArray');
    $(orderRelatedMethodology).each(function(indexM, nameM){
      var uri = $('#methodology-uri_'+nameM).val();
      newRelatedMethodology[parseInt(indexM)] = {uri: uri};
    });
    data.relatedMethodology = newRelatedMethodology;
  }
}

