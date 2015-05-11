function datasetEditor(collectionName, data) {

  var newFiles = [], newNotes = [], newRelated = [], newUsedIn = [];
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

  $("#collapsible").remove();
  $("#relBulletin").remove();
  $("#relArticle").remove();
  $("#extLink").remove();
  $("#content").remove();
  $("#metadata-a").remove();
  $("#metadata-b").remove();
  $("#summary-p").remove();
  $("#abstract-p").remove();
  $("#headline1-p").remove();
  $("#headline2-p").remove();
  $("#headline3-p").remove();


  // Metadata edition and saving
  $("#name").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.name = $(this).val();
  });
  $("#nextRelease").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.nextRelease = $(this).val();
  });
  $("#contactName").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.contact.name = $(this).val();
  });
  $("#contactEmail").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.contact.email = $(this).val();
  });
  $("#summary").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.summary = $(this).val();
  });
  $("#description").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description = $(this).val();
  });
  $("#keywords").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.keywords = $(this).val();
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if(data.nationalStatistic === "false" || data.nationalStatistic === false) {
      return false;
    } else {
      return true;
    }
  };
  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
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
      updateContent(collectionName, getPathName(), JSON.stringify(data));
      bulletinEditor(collectionName, data);
    });
  });

  // New correction
  $("#addCorrection").one('click', function () {
    data.correction.push({text:"", date:""});
    updateContent(collectionName, getPathName(), JSON.stringify(data));
  });


  // Edit download
  // Load and edition
  $(data.download).each(function (index) {
    lastIndexFile = index + 1;

    // Delete
    $("#file-delete_"+index).click(function() {
      $("#"+index).remove();
      $.ajax({
        url: "/zebedee/content/" + collectionName + "?uri=" + data.download[index].file,
        type: "DELETE",
        success: function (res) {
          console.log(res);
        },
        error: function (res) {
          console.log(res);
        }
      });
      data.download.splice(index, 1);
      updateContent(collectionName, getPathName(), JSON.stringify(data));
    });
  });

  //Add new download
  $("#addFile").one('click', function () {
    $('#sortable-download').append(
        '<div id="' + lastIndexFile + '" class="edit-section__sortable-item">' +
        '  <form id="UploadForm" action="" method="post" enctype="multipart/form-data">' +
        '    <p><input type="file" name="files" id="files" multiple>' +
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

          if (data.download.length > 0) {
            $(data.download).each(function (i, filesUploaded) {
              if (filesUploaded.file == uriUpload) {
                alert('This file already exists');
                $('#' + lastIndexFile).remove();
                datasetEditor(collectionName, data);
                return;
              }
            });
            if (!!file.name.match(/\.csv$|.xls$|.zip$/)) {
              showUploadedItem(file.name);
              if (formdata) {
                formdata.append("name", file);
              }
            } else {
              alert('This file type is not supported');
              $('#' + lastIndexFile).remove();
              datasetEditor(collectionName, data);
              return;
            }

            if (formdata) {
              $.ajax({
                url: "/zebedee/content/" + collectionName + "?uri=" + uriUpload,
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false,
                success: function (res) {
                  document.getElementById("response").innerHTML = "File uploaded successfully";
                  data.download.push({title:'', file: uriUpload});
                  updateContent(collectionName, getPathName(), JSON.stringify(data));
                }
              });
            }
          } else {
            if (!!file.name.match(/\.csv$|.xls$|.zip$/)) {
              showUploadedItem(file.name);
              if (formdata) {
                formdata.append("name", file);
              }
            } else {
              alert('This file type is not supported');
              $('#' + lastIndexFile).remove();
              datasetEditor(collectionName, data);
              return;
            }

            if (formdata) {
              $.ajax({
                url: "/zebedee/content/" + collectionName + "?uri=" + uriUpload,
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false,
                success: function (res) {
                  document.getElementById("response").innerHTML = "File uploaded successfully";
                  data.download.push({title:'', file: uriUpload});
                  updateContent(collectionName, getPathName(), JSON.stringify(data));
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
  $(data.notes).each(function(index, note) {

    $("#note-edit_"+index).click(function() {
      var editedSectionValue = $("#note-markdown_" + index).val();
      var html = templates.markdownEditor(editedSectionValue);
      $('body').append(html);
      $('.markdown-editor').stop().fadeIn(200);

      markdownEditor();
      markDownEditorSetLines();

      $('.btn-markdown-editor-cancel').on('click', function() {
        $('.markdown-editor').stop().fadeOut(200).remove();
      });

      $(".btn-markdown-editor-save").click(function(){
        var editedSectionText = $('#wmd-input').val();
        data.notes[index].data = editedSectionText;
        updateContent(collectionName, getPathName(), JSON.stringify(data));
      });

      $(".btn-markdown-editor-exit").click(function(){
        var editedSectionText = $('#wmd-input').val();
        data.notes[index].data = editedSectionText;
        updateContent(collectionName, getPathName(), JSON.stringify(data));
        $('.markdown-editor').stop().fadeOut(200).remove();
      });

      $("#wmd-input").on('click', function() {
        markDownEditorSetLines();
      });

      $("#wmd-input").on('keyup', function() {
        markDownEditorSetLines();
      });
    });

    // Delete
    $("#note-delete_"+index).click(function() {
      $("#"+index).remove();
      data.notes.splice(index, 1);
      updateContent(collectionName, getPathName(), JSON.stringify(data));
    });
  });

  //Add new note
  $("#addNote").one('click', function () {
    data.notes.push({data:""});
    updateContent(collectionName, getPathName(), JSON.stringify(data));
  });

  function sortableNotes() {
    $("#sortable-notes").sortable();
  }
  sortableNotes();

  // Related datasets
  // Load
  if (data.relatedDatasets.length === 0) {
    lastIndexRelated = 0;
  } else {
    $(data.relatedDatasets).each(function (iDataset) {
      lastIndexRelated = iDataset + 1;

      // Delete
      $("#dataset-delete_" + iDataset).click(function () {
        $("#" + iDataset).remove();
        data.relatedDatasets.splice(iDataset, 1);
        datasetEditor(collectionName, data);
      });
    });
  }

  //Add new related
  $("#addDataset").one('click', function () {
    var pageurl = localStorage.getItem('pageurl');
    localStorage.setItem('historicUrl', pageurl);
    var reload = localStorage.getItem("historicUrl");
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);

    $('#sortable-related').append(
        '<div id="' + lastIndexRelated + '" class="edit-section__sortable-item">' +
        '  <textarea id="dataset-uri_' + lastIndexRelated + '" placeholder="Go to the related dataset and click Get"></textarea>' +
        '  <button class="btn-page-get" id="dataset-get_' + lastIndexRelated + '">Get</button>' +
        '  <button class="btn-page-cancel" id="dataset-cancel_' + lastIndexRelated + '">Cancel</button>' +
        '</div>');
    $("#dataset-cancel_" + lastIndexRelated).hide();

    $("#dataset-get_" + lastIndexRelated).one('click', function () {
      $("#dataset-cancel_" + lastIndexRelated).show().one('click', function () {
        $("#dataset-cancel_" + lastIndexRelated).hide();
        $('#' + lastIndexRelated).hide();
        refreshPreview(localStorage.getItem("historicUrl"));
        loadPageDataIntoEditor(localStorage.getItem("historicUrl"), collectionName);
        localStorage.removeItem('historicUrl');
      });

      var dataseturl = $('#iframe')[0].contentWindow.document.location.href;
      var dataseturldata = "/data" + dataseturl.split("#!")[1];

      $.ajax({
        url: dataseturldata,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'dataset') {
            data.relatedDatasets.push({uri: relatedData.uri, title: relatedData.title, summary: relatedData.summary});
            saveRelated(collectionName, reload, data);
          } else {
            alert("This is not a dataset");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });
  });

  function sortableRelated() {
    $("#sortable-related").sortable();
  }
  sortableRelated();

  // Used in (articles or bulletins where dataset is used in)
  // Load
  if (data.usedIn.length === 0) {
    lastIndexUsedIn = 0;
  } else {
    $(data.usedIn).each(function (iUsed, usedIn) {
      lastIndexUsedIn = iUsed + 1;

      // Delete
      $("#used-delete_" + iUsed).click(function () {
        $("#" + iUsed).remove();
        data.usedIn.splice(iUsed, 1);
        datasetEditor(collectionName, data);
      });
    });
  }

  //Add new articles or bulletins where dataset is used in
  $("#addUsed").one('click', function () {
    var pageurl = localStorage.getItem('pageurl');
    localStorage.setItem('historicUrl', pageurl);
    var reload = localStorage.getItem("historicUrl");
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);

    $('#sortable-used').append(
        '<div id="' + lastIndexUsedIn + '" class="edit-section__sortable-item">' +
        '  <textarea id="dataset-uri_' + lastIndexUsedIn + '" placeholder="Go to the related document and click Get"></textarea>' +
        '  <button class="btn-page-get" id="used-get_' + lastIndexUsedIn + '">Get</button>' +
        '  <button class="btn-page-cancel" id="used-cancel_' + lastIndexUsedIn + '">Cancel</button>' +
        '</div>');
    $("#used-cancel_" + lastIndexUsedIn).hide();

    $("#used-get_" + lastIndexUsedIn).one('click', function () {
      $("#used-cancel_" + lastIndexUsedIn).show().one('click', function () {
        $('#used-cancel_' + lastIndexUsedIn).hide();
        $('#' + lastIndexUsedIn).hide();
        refreshPreview(localStorage.getItem("historicUrl"));
        loadPageDataIntoEditor(localStorage.getItem("historicUrl"), collectionName);
        localStorage.removeItem('historicUrl');
      });

      var usedInurl = $('#iframe')[0].contentWindow.document.location.href;
      var usedInurldata = "/data" + usedInurl.split("#!")[1];

      $.ajax({
        url: usedInurldata,
        dataType: 'json',
        crossDomain: true,
        success: function (usedInData) {
          if (usedInData.type === 'bulletin' || usedInData.type === 'article') {
            data.usedIn.push({uri: usedInData.uri, title: usedInData.title, summary: usedInData.summary});
            saveRelated(collectionName, reload, data);
          } else {
            alert("This is not an article or a bulletin");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });
  });

  function sortableUsedIn() {
    $("#sortable-used").sortable();
  }
  sortableUsedIn();

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
      saveAndCompleteContent(collectionName, getPathName(), JSON.stringify(data));
    });

    // reviewed to approve
    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
      saveData()
      saveAndReviewContent(collectionName, getPathName(), JSON.stringify(data));
    });

  function save() {
    saveData();
    updateContent(collectionName, getPathName(), JSON.stringify(data));
  }

  function saveData() {
    // Files are uploaded. Save metadata
    var orderFile = $("#sortable-download").sortable('toArray');
    $(orderFile).each(function(index, name){
      var title = $('#download-title_'+name).val();
      var file = $('#download-filename_' + name).val();
      newFiles[parseInt(index)] = {title: title, file: file};
    });
    data.download = newFiles;
    //console.log(data.download);
    // Notes
    var orderNote = $("#sortable-notes").sortable('toArray');
    $(orderNote).each(function (indexT, nameT) {
      var markdown = data.notes[parseInt(nameT)].data;
      newNotes[indexT] = {data: markdown};
    });
    data.notes = newNotes;
    // Related links
    var orderDataset = $("#sortable-related").sortable('toArray');
    $(orderDataset).each(function (indexD, nameD) {
      var uri = $('#dataset__' + nameD).val();
      var summary = $('#dataset_summary_' + nameD).val();
      var name = $('#dataset_name_' + nameD).val();
      newRelated[indexD]= {uri: uri, name: name, summary: summary};
    });
    data.relatedDatasets = newRelated;
    // Used in links
    var orderUsedIn = $("#sortable-used").sortable('toArray');
    $(orderUsedIn).each(function(indexU, nameU){
      var uri = $('#usedIn__'+nameU).val();
      var summary = $('#usedIn_summary_'+nameU).val();
      var name = $('#usedIn_name_'+nameU).val();
      newUsedIn[parseInt(indexU)] = {uri: uri, name: name, summary: summary};
    });
    data.usedIn = newUsedIn;

    //console.log(data);
    datasetEditor(collectionName, data);
  }
}

