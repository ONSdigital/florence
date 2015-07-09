function datasetEditor(collectionId, data) {

  var newFiles = [], newNotes = [], newRelated = [], newUsedIn = [], newRelatedMethodology = [];
  var lastIndexRelated, lastIndexUsedIn, lastIndexFile;
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

  // Metadata edition and saving
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
  });
  if (!Florence.collection.date) {
    if (!data.description.releaseDate){
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
      $('#releaseDate').on('change', function () {
        data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      });
    } else {
      dateTmp = $('#releaseDate').val();
      var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
      $('#releaseDate').val(dateTmpFormatted);
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
      $('#releaseDate').on('change', function () {
        data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      });
    }
  } else {
      $('.release-date').hide();
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
  $("#keywordsTag").tagit({availableTags: data.description.keywords,
                        availableTags: data.description.keywords,
                        singleField: true,
                        singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = [$('#keywords').val()];
  });
  $("#metaDescription").on('input', function () {
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

    $("#correction_text_" + index).on('input', function () {
      $(this).textareaAutoSize();
      data.correction[index].text = $(this).val();
    });
    $("#correction_date_" + index).val(correction.date).on('input', function () {
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
  if (!data.relatedData || data.relatedData.length === 0) {
    lastIndexFile = 0;
  } else {
    $(data.downloads).each(function (index) {
      lastIndexFile = index + 1;

      // Delete
      $("#file-delete_"+index).click(function() {
        $("#"+index).remove();
        $.ajax({
          url: "/zebedee/content/" + collectionId + "?uri=" + data.downloads[index].file,
          type: "DELETE",
          success: function (res) {
            console.log(res);
          },
          error: function (res) {
            console.log(res);
          }
        });
        data.downloads.splice(index, 1);
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      });
    });
  }

  //Add new download
  $("#add-file").one('click', function () {
    $('#sortable-file').append(
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
            if (!!file.name.match(/\.csv$|.xls$|.csdb$|.zip$/)) {
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
                  data.downloads.push({title:'', file: uriUpload});
                  updateContent(collectionId, getPathName(), JSON.stringify(data));
                }
              });
            }
          } else {
            if (!!file.name.match(/\.csv$|.xls$|.csdb$|.zip$/)) {
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
                  data.downloads.push({title:'', file: uriUpload});
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
    $("#sortable-file").sortable();
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

  editRelated (collectionId, data, 'relatedDatasets', 'dataset');

  editRelated (collectionId, data, 'relatedDocuments', 'used');

  editRelated (collectionId, data, 'relatedMethodology', 'methodology');

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
    var orderFile = $("#sortable-file").sortable('toArray');
    $(orderFile).each(function(indexF, nameF){
      var title = $('#file-title_'+nameF).val();
      var file = $('#file-filename_' + nameF).val();
      newFiles[indexF] = {title: title, file: file};
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
    var orderDataset = $("#sortable-dataset").sortable('toArray');
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

