function datasetEditor(collectionName, data) {

  //var newFiles = [];
  var newNotes = [];
  var newRelated = [];
  var newUsedIn = [];
  var lastIndexFile, lastIndexNote, lastIndexRelated, lastIndexUsedIn;

  //console.log(data.sections);

  $(".section-list").remove();
  $(".note-list").remove();
  $(".dataset-list").remove();
  $(".link-list").remove();
  $("#addFile").remove();
  $("#addNote").remove();
  $("#addDataset").remove();
  $("#addUsedIn").remove();

  $("#metadata-list").remove();

  // Metadata load
  $("#metadata-section").append(
      '<div id="metadata-list">' +
      ' <p>Title: <textarea class="auto-size" type="text" id="title" cols="40" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
      ' <p>Next release: <textarea class="auto-size" type="text" id="nextRelease" cols="20" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
      ' <p>Contact name: <textarea class="auto-size" type="text" id="contactName" cols="20" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
      ' <p>Contact email: <textarea class="auto-size" type="text" id="contactEmail" cols="30" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
      ' <p>Description: <textarea class="auto-size" type="text" id="description" cols="40" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
      ' <p >National statistic: <input type="checkbox" name="natStat" value="yes" /> Yes </p>' +
      ' <p>Summary: <textarea class="auto-size" type="text" id="summary" cols="40" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
      '</div>');

  // Metadata edition and saving
  $("#title").val(data.title).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.title = $(this).val();
  });
  $("#nextRelease").val(data.nextRelease).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.nextRelease = $(this).val();
  });
  $("#contactName").val(data.contact.name).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.contact.name = $(this).val();
  });
  $("#contactEmail").val(data.contact.email).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.contact.email = $(this).val();
  });
  $("#summary").val(data.summary).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.summary = $(this).val();
  });
  $("#description").val(data.description).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description = $(this).val();
  });
  $("#metadata-list input[type='checkbox']").prop('checked', data.nationalStatistic).click(function () {
    data.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
    console.log( data.nationalStatistic );
  });

  var style = "background-image:url(img/sb_v_double_arrow.png);background-repeat: no-repeat; background-position:10px 25px";

  // Edit download
  // Load and edition
  $(data.download).each(function(index, file){
    $('.fl-editor__download').append(
        '<div id="' + index + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        '  Title ' +
          //' <textarea id="file__' + index + '" cols="50">' + file.title + '</textarea>' +
          //' <textarea style="display: none;" id="file_markdown_' + index + '">' + file.markdown + '</textarea>' +
          //' <button class="fl-panel--editor__download__file-item__edit_' + index + '">Edit</button>' +
          //' <button class="fl-panel--editor__download__file-item__delete_' + index + '">Delete</button>' +
        '</div>').show();
    lastIndexFile = index + 1;

    // Delete
    $(".fl-panel--editor__download__file-item__delete_"+index).click(function() {
      $("#"+index).remove();
      data.download.splice(index, 1);
      datasetEditor(collectionName, data);
    });
  });

  //Add new download
  $("#content-section").append('<button id="addFile">Add new file</button>');
  $("#addFile").click(function () {
    $('.fl-editor__download').append(
        '<div id="' + lastIndexFile + '" class="file-list" style="background-color:grey; color:white;">' +
        '  Title ' +
        '  <form id="UploadForm" action="fileupload" method="post" enctype="multipart/form-data">' +
        '    <p><input type="file" name="files[]" id="files" multiple>' +
        '    <p>' +
        '    <button type="submit" id="btn">Submit</button>' +
        '  </form>' +
        '  <div id="response"></div>' +
        '  <ul id="list"></ul>' +
        '</div>');

    (function () {
      var input = document.getElementById("files"), formdata = false;

      if (window.FormData) {
        formdata = new FormData();
        document.getElementById("btn").style.display = "none";
      }
      function showUploadedItem (source) {
        console.log(source);
        var list = document.getElementById("list"),
            li   = document.createElement("li"),
            para = document.createElement("p");
        text = document.createTextNode(source);
        para.appendChild(text);
        li.appendChild(para);
        list.appendChild(li);
      }
      if (input.addEventListener) {
        input.addEventListener("change", function (evt) {
          var i = 0, len = this.files.length, file;

          document.getElementById("response").innerHTML = "Uploading . . ."

          for ( ; i < len; i++ ) {
            file = this.files[i];
            if (!!file.type.match(/csv.*/)) {
                  showUploadedItem(file.name);
              if (formdata) {
                formdata.append("names[]", file);
              }
            }
          }

          if (formdata) {
            $.ajax({
              url: "/zebedee/fileupload",
              type: "POST",
              data: formdata,
              processData: false,
              contentType: false,
              success: function (res) {
                document.getElementById("response").innerHTML = res;
              }
            });
          }
        }, false);
      }
    })();

    sortableFiles();
    //saveNewFile();
  });

  function sortableFiles() {
    $(".fl-editor__download").sortable();
  }
  sortableFiles();

  // Edit notes
  // Load and edition
  $(data.notes).each(function(index, note) {
    lastIndexNote = index + 1;
    $('.fl-editor__notes').append(
        '<div id="' + index + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        'Note ' +
        ' <textarea id="note_markdown_' + index + '">' + note.data + '</textarea>' +
        ' <button class="fl-panel--editor__notes__note-item__edit_' + index + '">Edit</button>' +
        ' <button class="fl-panel--editor__notes__note-item__delete_' + index + '">Delete</button>' +
        '</div>').show();

    $(".fl-panel--editor__notes__note-item__edit_"+index).click(function() {
      var editedNoteValue = $("#note_markdown_" + index).val();

      var editorPrev = '<div style="float: right; margin-top: 50px; height:905px; overflow: scroll;" id="wmd-preview" class="wmd-panel wmd-preview"></div>';
      var editorEdit = '<div style="float: left; margin-top: 50px;" id="wmd-edit" class="wmd-panel">' +
          '<div id="wmd-button-bar"></div>' +
          ' <textarea style="height:845px;" class="wmd-input" id="wmd-input">' + editedNoteValue + '</textarea>' +
          ' <button id="finish-note">Finish editing</button>' +
          '</div>';

      $('body').prepend(editorPrev, editorEdit);

      markdownEditor();

      $("#finish-note").click(function() {
        data.notes[index].data = $('#wmd-input').val();
        $("#wmd-preview").remove();
        $("#wmd-edit").remove();
        save();
        updateContent(collectionName, getPathName(), JSON.stringify(data));
      });
    });

    // Delete
    $(".fl-panel--editor__notes__note-item__delete_"+index).click(function() {
      $("#"+index).remove();
      data.notes.splice(index, 1);
      datasetEditor(collectionName, data);
    });
  });

  //Add new note
  $("#notes-section").append('<button id="addNote">Add new note</button>');
  $("#addNote").click(function () {
    $('.fl-editor__notes').append(
        '<div id="' + lastIndexNote + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        'Note ' +
        ' <textarea id="note_markdown_' + lastIndexNote + '"></textarea>' +
        ' <button class="fl-panel--editor__notes__note-item__edit_' + lastIndexNote + '">Edit</button>' +
        ' <button class="fl-panel--editor__notes__note-item__delete_' + lastIndexNote + '">Delete</button>' +
        '</div>');
    sortableNotes();
    saveNewNote();
  });

  function saveNewNote() {
    var orderNote = $(".fl-editor__notes").sortable('toArray');
    $(orderNote).each(function(index, name){
      var markdown = $('#note_markdown_'+name).val();
      newNotes[parseInt(index)] = {data: markdown};
    });
    data.notes = newNotes;
    //console.log(data.notes);
    $(".note-list").remove();
    $("#metadata-list").remove();
    datasetEditor(collectionName, data);
  }

  function sortableNotes() {
    $(".fl-editor__notes").sortable();
  }
  sortableNotes();

  // Related datasets
  // Load
  if (data.relatedDatasets.length === 0) {
    lastIndexRelated = 0;
  } else {
    $(data.relatedDatasets).each(function (iDataset, dataset) {
      lastIndexRelated = iDataset + 1;
      $('.fl-editor__related').append(
          '<div id="' + iDataset + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
          'Link ' +
          ' <textarea id="dataset__' + iDataset + '" cols="50">' + dataset.uri + '</textarea>' +
          ' <textarea style="display: none;" id="dataset_name_' + iDataset + '">' + dataset.name + '</textarea>' +
          ' <textarea style="display: none;" id="dataset_summary_' + iDataset + '">' + dataset.summary + '</textarea>' +
          ' <button class="fl-panel--editor__related__dataset-item__delete_' + iDataset + '">Delete</button>' +
          '</div>');

      // Delete
      $(".fl-panel--editor__related__dataset-item__delete_" + iDataset).click(function () {
        $("#" + iDataset).remove();
        data.relatedDatasets.splice(iDataset, 1);
        datasetEditor(collectionName, data);
      });
    });
  }

  //Add new related
  $("#related-section").append('<button id="addDataset">Add new link</button>');
  $("#addDataset").one('click', function () {
    $('.fl-editor__related').append(
        '<div id="' + lastIndexRelated + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        'Link ' +
        '  <textarea id="dataset__' + lastIndexRelated + '" placeholder="Go to the related dataset and click Get" cols="50"></textarea>' +
        '  <button class="fl-panel--editor__related__dataset-item__get_' + lastIndexRelated + '">Get</button>' +
        '  <button class="fl-panel--editor__related__dataset-item__cancel_' + lastIndexRelated + '">Cancel</button>' +
        '</div>');

    $(".fl-panel--editor__related__dataset-item__cancel_" + lastIndexRelated).hide();

    unCheckPage();
    loadPageDataIntoEditor(collectionName, false);

    $(".fl-panel--editor__related__dataset-item__get_" + lastIndexRelated).one('click', function () {
      $(".fl-panel--editor__related__dataset-item__cancel_" + lastIndexRelated).show().one('click', function () {
        $('.fl-panel--preview__content').get(0).src = localStorage.getItem("pageurl");
        checkPage();
        $(".fl-panel--editor__related__dataset-item__cancel_" + lastIndexRelated).remove();
        datasetEditor(collectionName, data);
      });
      var dataseturl = $('.fl-panel--preview__content').contents().get(0).location.href;
      var dataseturldata = "/data" + dataseturl.split("#!")[1];
      $.ajax({
        url: dataseturldata,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'dataset') {
            $('#dataset__' + lastIndexRelated).val(relatedData.uri);
            $('.dataset-list').append(
                '<textarea style="display: none;" id="dataset_name_' + lastIndexRelated + '"></textarea>' +
                '<textarea style="display: none;" id="dataset_summary_' + lastIndexRelated + '"></textarea>');
            $('#dataset_name_' + lastIndexRelated).val(relatedData.name);
            $('#dataset_summary_' + lastIndexRelated).val(relatedData.summary);
            saveNewDataset();
            $('.fl-panel--preview__content').get(0).src = localStorage.getItem("pageurl");
            //checkPage2();
            checkPage();
            save();
            updateContent(collectionName, getPathName(), JSON.stringify(data));
          } else {
            alert("This is not a dataset");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });
    sortableRelated();
  });

  function checkPage() {
    window.intervalID = setInterval(function () {
      checkForPageChanged(function () {
        loadPageDataIntoEditor(collectionName, true);
      });
    }, intIntervalTime);
  }

  function unCheckPage() {
    clearInterval(window.intervalID);
  }

  function sortableRelated() {
    $(".fl-editor__related").sortable();
  }

  sortableRelated();

  function saveNewDataset() {
    var orderDataset = $(".fl-editor__related").sortable('toArray');
    $(orderDataset).each(function(indexD, nameD){
      var uri = $('#dataset__'+nameD).val();
      var summary = $('#dataset_summary_'+nameD).val();
      var names = $('#dataset_name_'+nameD).val();
      newRelated[parseInt(indexD)] = {uri: uri, name: names, summary: summary};
    });
    data.relatedDatasets = newRelated;
    $(".dataset-list").remove();
    $("#metadata-list").remove();
    datasetEditor(collectionName, data);
  }

  // Used in (articles or bulletins where dataset is used in)
  // Load
  if (data.usedIn.length === 0) {
    lastIndexUsedIn = 0;
  } else {
    $(data.usedIn).each(function (iUsed, usedIn) {
      lastIndexUsedIn = iUsed + 1;
      $('.fl-editor__used').append(
          '<div id="' + iUsed + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
          'Link ' +
          ' <textarea id="usedIn__' + iUsed + '" cols="50">' + usedIn.uri + '</textarea>' +
          ' <textarea style="display: none;" id="usedIn_name_' + iUsed + '">' + usedIn.name + '</textarea>' +
          ' <textarea style="display: none;" id="usedIn_summary_' + iUsed + '">' + usedIn.summary + '</textarea>' +
          ' <button class="fl-panel--editor__related__usedIn-item__delete_' + iUsed + '">Delete</button>' +
          '</div>');

      // Delete
      $(".fl-panel--editor__related__usedIn-item__delete_" + iUsed).click(function () {
        $("#" + iUsed).remove();
        data.usedIn.splice(iUsed, 1);
        datasetEditor(collectionName, data);
      });
    });
  }

  //Add new articles or bulletins where dataset is used in
  $("#used-section").append('<button id="addUsedIn">Add new link</button>');
  $("#addUsedIn").one('click', function () {
    $('.fl-editor__used').append(
        '<div id="' + lastIndexUsedIn + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        'Link ' +
        '  <textarea id="usedIn__' + lastIndexUsedIn + '" placeholder="Go to the related usedIn and click Get" cols="50"></textarea>' +
        '  <button class="fl-panel--editor__related__usedIn-item__get_' + lastIndexUsedIn + '">Get</button>' +
        '  <button class="fl-panel--editor__related__usedIn-item__cancel_' + lastIndexUsedIn + '">Cancel</button>' +
        '</div>');

    $(".fl-panel--editor__related__usedIn-item__cancel_" + lastIndexUsedIn).hide();

    unCheckPage();
    loadPageDataIntoEditor(collectionName, false);

    $(".fl-panel--editor__related__usedIn-item__get_" + lastIndexUsedIn).one('click', function () {
      $(".fl-panel--editor__related__usedIn-item__cancel_" + lastIndexUsedIn).show().one('click', function () {
        $('.fl-panel--preview__content').get(0).src = localStorage.getItem("pageurl");
        checkPage();
        $(".fl-panel--editor__related__usedIn-item__cancel_" + lastIndexUsedIn).remove();
        datasetEditor(collectionName, data);
      });
      var usedInurl = $('.fl-panel--preview__content').contents().get(0).location.href;
      var usedInurldata = "/data" + usedInurl.split("#!")[1];
      $.ajax({
        url: usedInurldata,
        dataType: 'json',
        crossDomain: true,
        success: function (usedInData) {
          if (usedInData.type === 'bulletin' || usedInData.type === 'article') {
            $('#usedIn__' + lastIndexUsedIn).val(usedInData.uri);
            $('.usedIn-list').append(
                '<textarea style="display: none;" id="usedIn_name_' + lastIndexUsedIn + '"></textarea>' +
                '<textarea style="display: none;" id="usedIn_summary_' + lastIndexUsedIn + '"></textarea>');
            $('#usedIn_name_' + lastIndexUsedIn).val(usedInData.name);
            $('#usedIn_summary_' + lastIndexUsedIn).val(usedInData.summary);
            saveNewUsedIn();
            $('.fl-panel--preview__content').get(0).src = localStorage.getItem("pageurl");
            checkPage();
            save();
            updateContent(collectionName, getPathName(), JSON.stringify(data));
          } else {
            alert("This is not an article or a bulletin");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });
    sortableUsedIn();
  });

  function checkPage() {
    window.intervalID = setInterval(function () {
      checkForPageChanged(function () {
        loadPageDataIntoEditor(collectionName, true);
      });
    }, intIntervalTime);
  }

  function unCheckPage() {
    clearInterval(window.intervalID);
  }

  function sortableUsedIn() {
    $(".fl-editor__used").sortable();
  }

  sortableUsedIn();

  function saveNewUsedIn() {
    var orderUsedIn = $(".fl-editor__used").sortable('toArray');
    $(orderUsedIn).each(function(indexU, nameU){
      var uri = $('#usedIn__'+nameU).val();
      var summary = $('#usedIn_summary_'+nameU).val();
      var names = $('#usedIn_name_'+nameU).val();
      newUsedIn[parseInt(indexU)] = {uri: uri, name: names, summary: summary};
    });
    data.usedIn = newUsedIn;
    $(".usedIn-list").remove();
    $("#metadata-list").remove();
    datasetEditor(collectionName, data);
  }



  // Save
  $('.fl-panel--editor__nav__save').unbind("click").click(function () {
    save();
    updateContent(collectionName, getPathName(), JSON.stringify(data));
  });

  // complete
  $('.fl-panel--editor__nav__complete').unbind("click").click(function () {
    pageData = $('.fl-editor__headline').val();
    save();
    saveAndCompleteContent(collectionName, getPathName(), JSON.stringify(data));
  });


  function save() {
    // Files are uploaded. No need to save

    // Notes
    var orderNote = $(".fl-editor__notes").sortable('toArray');
    $(orderNote).each(function (indexT, nameT) {
      var markdown = data.notes[parseInt(nameT)].data;
      newNotes[indexT] = {data: markdown};
    });
    console.log(newNotes);
    data.notes = newNotes;
    // Related links
    var orderDataset = $(".fl-editor__related").sortable('toArray');
    $(orderDataset).each(function (indexD, nameD) {
      var uri = $('#dataset__' + nameD).val();
      var summary = $('#dataset_summary_' + nameD).val();
      var name = $('#dataset_name_' + nameD).val();
      newRelated[indexD]= {uri: uri, name: name, summary: summary};
    });
    data.relatedDatasets = newRelated;
    //console.log(data.relatedDatasets);
    // Used in links
    var orderUsedIn = $(".fl-editor__used").sortable('toArray');
    $(orderUsedIn).each(function(indexU, nameU){
      var uri = $('#usedIn__'+nameU).val();
      var summary = $('#usedIn_summary_'+nameU).val();
      var names = $('#usedIn_name_'+nameU).val();
      newUsedIn[parseInt(indexU)] = {uri: uri, name: names, summary: summary};
    });
    data.usedIn = newUsedIn;

    //console.log(data);
    datasetEditor(collectionName, data);
  }
}

    saveAndCompleteContent(collectionName, getPathName(), JSON.stringify(data));
  });


  function save() {
    // Files are uploaded. No need to save

    // Notes
    var orderNote = $(".fl-editor__notes").sortable('toArray');
    $(orderNote).each(function (indexT, nameT) {
      var markdown = data.notes[parseInt(nameT)].data;
      newNotes[indexT] = {data: markdown};
    });
    console.log(newNotes);
    data.notes = newNotes;
    // Related links
    var orderDataset = $(".fl-editor__related").sortable('toArray');
    $(orderDataset).each(function (indexD, nameD) {
      var uri = $('#dataset__' + nameD).val();
      var summary = $('#dataset_summary_' + nameD).val();
      var name = $('#dataset_name_' + nameD).val();
      newRelated[indexD]= {uri: uri, name: name, summary: summary};
    });
    data.relatedDatasets = newRelated;
    //console.log(data.relatedDatasets);
    // Used in links
    var orderUsedIn = $(".fl-editor__used").sortable('toArray');
    $(orderUsedIn).each(function(indexU, nameU){
      var uri = $('#usedIn__'+nameU).val();
      var summary = $('#usedIn_summary_'+nameU).val();
      var names = $('#usedIn_name_'+nameU).val();
      newUsedIn[parseInt(indexU)] = {uri: uri, name: names, summary: summary};
    });
    data.usedIn = newUsedIn;

    //console.log(data);
    datasetEditor(collectionName, data);
  }
}

