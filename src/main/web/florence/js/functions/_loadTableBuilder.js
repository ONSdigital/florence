function loadTableBuilder(pageData, onSave, table) {
  var pageUrl = pageData.uri;
  var html = templates.tableBuilder(table);
  var previewTable;
  var path;
  var xlsPath;
  var htmlPath;
  var latestVersionUri;

  $('body').append(html);

  if (table) {
    latestVersionUri = table.uri;
    renderTable(table.uri);
     $('#table-metadata-form').show();
  }

  /** Upload a XLS file **/
  $('#upload-table-form').submit(function (event) {
    var formData = new FormData($(this)[0]);
    previewTable = buildJsonObjectFromForm(previewTable);
    path = previewTable.uri;
    xlsPath = path + ".xls";
    htmlPath = path + ".html";
    latestVersionUri = path;

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
    return false;
  });

  /** Add exclusions to xls file. **/
  $('#table-metadata-form').submit(function (event) {
    event.preventDefault();
    previewTable = buildJsonObjectFromForm(previewTable);
    console.log("latestVersionUri: " + latestVersionUri);
    var tableMetadataUrl = "/zebedee/tablemetadata/" + Florence.collection.id + "?currentUri=" + latestVersionUri + "&newUri=" + previewTable.uri + "&validateJson=false";

    if ($("#rows-excluded").val()) {
      tableMetadataUrl = tableMetadataUrl + "&rowsExcluded=" + $("#rows-excluded").val();
    }

    $.ajax({
      url: tableMetadataUrl,
      type: 'PUT',
      data: null,
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: function () {
        updateExcludedRowsWithSavedValues(tableMetadataUrl);
        $('#table-metadata-form').slideDown("slow");
        addFilesToPreview();
        renderTable(previewTable.uri);
      },
      error: function (response) {
        updateExcludedRowsWithSavedValues();
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
        console.log(previewTable.files);
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
    previewTable.files.push({type: 'download-xls', filename: previewTable.filename + '.xls'});
    previewTable.files.push({type: 'html', filename: previewTable.filename + '.html'});
    previewTable.files.push({type: 'json', filename: previewTable.filename + '.json'});
  }

  function updateExcludedRowsWithSavedValues(tableMetadataUrl) {
      $.ajax({
        url: tableMetadataUrl + ".json",
        type: 'GET',
        dataType: 'json',
        success: function (json) {
          var currentValues = "";
          json.excludeRows.forEach( function(item) {
              currentValues = item + ", " + currentValues;
          });
          $("#rows-excluded").val("");
          $("#rows-excluded").val(currentValues.substring(0, currentValues.lastIndexOf(",")));
        }
      });
  }

  setShortcuts('#table-title');

  function renderTable(path) {
    var iframeMarkup = '<iframe id="preview-frame" style="opacity:0" frameBorder ="0" scrolling = "yes" src="' + path + '"></iframe>';
    console.log(iframeMarkup);
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
    table.filename = table.filename ? table.filename : StringUtils.randomId();

    table.uri = pageUrl + "/" + table.filename;

    if (table.title === '') {
      table.title = '[Title]';
    }

    if (!table.files) {
      table.files = [];
    }

    table.excludeRows = [];

    if ( $("#rows-excluded").val() ) {
        var rowIds = $("#rows-excluded").val().split(",");
        rowIds.forEach( function(item) {
            table.excludeRows.push(item.trim());
        });
    }
    return table;
  }
}

