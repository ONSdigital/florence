function loadTableBuilder(pageData, onSave, table) {
  var pageUrl = pageData.uri;
  var html = templates.tableBuilder(table);
  var previewTable;
  var path;
  var xlsPath;
  var htmlPath;
  var masterTable = table;

  $('body').append(html);

  if (table) {
    renderTable(table.uri);
    $('#table-modify-form').show();
  }

  /** Upload a XLS file **/
  $('#upload-table-form').submit(function (event) {
    var formData = new FormData($(this)[0]);
    previewTable = buildJsonObjectFromForm(previewTable);
    path = previewTable.uri;
    xlsPath = path + ".xls";
    htmlPath = path + ".html";

    // send xls file to zebedee
    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + xlsPath,
      type: 'POST',
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: function () {
        createTableHtml(previewTable);
      }
    });
    $('#table-modify-form').show();
    return false;
  });

  /**
    Add modifications to the generated html file.
  **/
  $('#table-modify-form').submit(function (event) {
    event.preventDefault();
    previewTable = buildJsonObjectFromForm(previewTable);
    var currentUri = masterTable ? masterTable.uri : previewTable.uri;
    var tableMetadataUrl = "/zebedee/modifytable/" + Florence.collection.id + "?currentUri=" + currentUri + "&newUri=" + previewTable.uri + "&validateJson=false";

    $.ajax({
      url: tableMetadataUrl,
      type: 'POST',
      dataType: 'text',
      contentType: 'application/json',
      data: JSON.stringify(previewTable),
      success: function ( response ) {
        getSavedTableModifications(previewTable.uri);
        addFilesToPreview();
      },
      error: function (response) {
        getSavedTableModifications(previewTable.uri);
        addFilesToPreview();
        handleApiError(response);
      }
    });
  });

  /** Delete / Cancel **/
  $('.btn-table-builder-cancel').on('click', function () {
    $('.table-builder').stop().fadeOut(200).remove();

    // delete the preview table
    if (previewTable) {
      //deleteContent(Florence.collection.id, previewTable.uri + ".json");
      $(previewTable.files).each(function (index, file) {
        var fileToDelete = pageUrl + '/' + file.filename;
        deleteContent(Florence.collection.id, fileToDelete,
          onSuccess = function () {
            console.log("deleted table file: " + fileToDelete);
          });
      });
    }
  });

  /** Save **/
  $('.btn-table-builder-create').on('click', function () {
    // if uploaded = true rename the preview table
    previewTable = buildJsonObjectFromForm(previewTable);
    var tableExists = false;

    if (table) {
      tableExists = true;
      table = mapJsonValues(previewTable, table);
    } else { // just keep the preview files
      table = previewTable;
      addTableToPageJson(table);
    }

    saveTableJson(table, success=function() {
      if (tableExists) {

        if (previewTable.files.length == 0) {
            addFilesToPreview();
        }

        // if a table exists, rename the preview to its name
        $(previewTable.files).each(function (index, file) {
          var fromFile = pageUrl + '/' + file.filename;
          var toFile = pageUrl + '/' + file.filename.replace(previewTable.filename, table.filename);
          console.log("moving... table file: " + fromFile + " to: " + toFile);
          renameContent(Florence.collection.id, fromFile, toFile,
            onSuccess = function () {
              console.log("Moved table file: " + fromFile + " to: " + toFile);
            });
        });
      }

      if (onSave) {
        onSave(table.filename, '<ons-table path="' + table.filename + '" />');
      }
      $('.table-builder').stop().fadeOut(200).remove();
    });
  });

  /** Create HTML **/
  function createTableHtml(previewTable) {
    $.ajax({
      url: "/zebedee/table/" + Florence.collection.id + "?uri=" + xlsPath,
      type: 'POST',
      success: function (html) {
        saveTableJson(previewTable, success = function () {
          saveTableHtml(html);
        });
      }
    });
  }

  /** Save HTML **/
  function saveTableHtml(data) {
    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + htmlPath + "&validateJson=false", // do not validate json as its html content.
      type: 'POST',
      data: data,
      processData: false,
      success: function () {
        addFilesToPreview();
        renderTable(path);
        $('#table-metadata-form').slideDown("slow");
      }
    });
  }

  function addFilesToPreview() {
    previewTable.files = [];
    previewTable.files.push({type: 'download-xls', filename: previewTable.filename + '.xls'});
    previewTable.files.push({type: 'html', filename: previewTable.filename + '.html'});
    previewTable.files.push({type: 'json', filename: previewTable.filename + '.json'});
  }

  function getSavedTableModifications(uri) {
    var updatedContentUri = "/zebedee/modifytable/" + Florence.collection.id + "?uri=" + uri + ".json";
    $.ajax({
      url: updatedContentUri,
      type: 'GET',
      dataType: 'json',
      success: function (json) {
        updateTableModificationForm(json);
        renderTable(uri);
        $('#table-modify-form').slideDown("slow");
      }
    });
  }

  function updateTableModificationForm(json) {
    var currentValues = "";
    json.modifications.rowsExcluded.forEach( function(item) {
        currentValues = item + ", " + currentValues;
    });
    $("#rows-excluded").val("");
    $("#rows-excluded").val(currentValues.substring(0, currentValues.lastIndexOf(",")));
  }

  setShortcuts('#table-title');

  function renderTable(path) {
    var iframeMarkup = '<iframe id="preview-frame" style="opacity:0" frameBorder ="0" scrolling = "yes" src="' + path + '"></iframe>';
    $('#preview-table').html(iframeMarkup);
    var iframe = $('#preview-frame');
    iframe.load(function () {
      var contents = iframe.contents();
      contents.find('body').css("background", "transparent");
      contents.find('body').css("width", "480px");
      iframe.height(contents.find('html').height());
      iframe.css("opacity", "1");
    });
  }


  function saveTableJson(table, success) {

    var tableJson = table.uri + ".json";

    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + tableJson,
      type: 'POST',
      data: JSON.stringify(table),
      processData: false,
      contentType: 'application/json',
      success: function () {
        if (success) {
          success();
        }
      }
    });
  }

  function addTableToPageJson(table) {
    if (!pageData.tables) {
      pageData.tables = [];
    } else {

      var existingTable = _.find(pageData.tables, function (existingTable) {
        return existingTable.filename === table.filename;
      });

      if (existingTable) {
        existingTable.title = table.title;
        return;
      }
    }

    pageData.tables.push({title: table.title, filename: table.filename, uri: table.uri});
  }

  function mapJsonValues(from, to) {
    to = buildJsonObjectFromForm(to);

    $(from.files).each(function (fromIndex, fromFile) {
      var fileExistsInImage = false;

      $(to.files).each(function (toIndex, toFile) {
        if (fromFile.type == toFile.type) {
          fileExistsInImage = true;
          toFile.fileName = fromFile.fileName;
          toFile.fileType = fromFile.fileType;
        }
      });

      if(!fileExistsInImage) {
        to.files.push(fromFile);
      }

    });

    return to;
  }

  function buildJsonObjectFromForm(table) {
    if (!table) {
      table = {};
    }

    table.type = 'table';
    table.title = $('#table-title').val();

    if (!table.filename) {
        table.filename = StringUtils.randomId();
    }

    table.uri = pageUrl + "/" + table.filename;

    if (table.title === '') {
      table.title = '[Title]';
    }

    if (!table.files) {
      table.files = [];
    }

    table.modifications = {};
    table.modifications.rowsExcluded = inputAsList("#rows-excluded", []);
    table.modifications.headerRows = inputAsList("#header-rows", []);
    table.modifications.headerColumns = inputAsList("#header-columns", []);
    return table;
  }

  /** Converts a comma separated string to a list **/
  function inputAsList(_elemId, _list) {
    if ( $(_elemId).val() ) {
        var valuesString = $(_elemId).val().split(",");
        valuesString.forEach( function(item) {
            // TODO handle empty string.
            _list.push(item.trim());
        });
    }
    return _list;
  }
}

