function loadTableBuilder(pageData, onSave, table) {
  var pageUrl = pageData.uri;
  var html = templates.tableBuilder(table);
  var previewTable;
  var path;
  var xlsPath;
  var htmlPath;
  var currentTable = table;

  $('body').append(html);

  if (table) {
    renderTable(table.uri);
    $('#table-modify-form').show();
  }

  /** Upload a XLS file **/
  $('#upload-table-form').submit(function (event) {
    var formData = new FormData($(this)[0]);
    previewTable = buildJsonObjectFromForm(previewTable);

    if ( $("#files").val() ) {
      var errors = validateTableModifications(previewTable);
      if (!errors.exist()) {
        uploadFile(previewTable, formData);
      } else {
        errors.show();
      }
    } else {
        sweetAlert("Validation error", "Please select a .xls file to upload.");
    }
  });

    /** Upload the file. **/
  function uploadFile(previewTable, formData) {
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
    currentTable = previewTable;
    $('#table-modify-form').show();
    return false;
  }

    /** Create HTML **/
  function createTableHtml(previewTable) {
    $.ajax({
      url: "/zebedee/table/" + Florence.collection.id + "?uri=" + xlsPath,
      type: 'POST',
      data: JSON.stringify(previewTable),
      contentType: 'application/json',
      dataType: 'text',
      success: function (html) {
        saveTableJson(previewTable, success = function () {
          saveTableHtml(html);
        });
      }
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

  /** Save HTML **/
  function saveTableHtml(data) {
    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + htmlPath + "&validateJson=false",
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
  }

  function renderTable(path) {
    var iframeMarkup = '<iframe id="preview-frame" style="opacity:0" frameBorder ="0" scrolling = "yes" src="' + path + '"></iframe>';
    $('#preview-table').html(iframeMarkup);
    var iframe = $('#preview-frame');
    iframe.load(function () {
      var contents = iframe.contents();
      contents.find('body').css("background", "transparent");
      contents.find('body').css("width", "480px");
      contents.find('.markdown-table-wrap').css('width', '700px');
      iframe.height(contents.find('html').height());
      iframe.css("opacity", "1");
    });
  }

  /** Submit modifications details. **/
  $('#table-modify-form').submit(function (event) {
    event.preventDefault();
    previewModifications();
  });

  function previewModifications() {
    previewTable = buildJsonObjectFromForm(previewTable);
    var errors = validateTableModifications(previewTable);

    if (!errors.exist()) {
        postModifyTableForm(previewTable);
    } else {
        errors.show();
    }
  }

  /** Validate the form contains correct data. **/
  function validateTableModifications(tableData) {
    var errors = {
        messages: [],
        exist: function () {
            return this.messages.length > 0;
        },

        show: function () {
          var msg = "";
          this.messages.forEach( function (item) {
            msg = msg + item + "\n";
          });
          sweetAlert("Validation error", msg);
        }
    }

    var mods = tableData.modifications;
    validateList(mods.rowsExcluded, "Rows Excluded", errors);
    validateList(mods.headerRows, "Table Header Rows", errors);
    validateList(mods.headerColumns, "Table Header Columns", errors);

    if (mods.rowsExcluded.length > 0 && mods.headerRows.length > 0) {
        mods.headerRows.forEach( function (header) {
            if ($.inArray(header, mods.rowsExcluded) >= 0) {
                errors.messages.push("Row " + header + " is excluded and cannot be set as a Header Row.");
            }
        });
    }
    return errors;
  }

  /** Post the modify table form. **/
  function postModifyTableForm(tableData) {
    var currentUri = currentTable ? currentTable.uri : tableData.uri;
    var tableMetadataUrl = "/zebedee/modifytable/" + Florence.collection.id + "?currentUri=" + currentUri + "&newUri=" + tableData.uri + "&validateJson=false";

    $.ajax({
      url: tableMetadataUrl,
      type: 'POST',
      dataType: 'text',
      contentType: 'application/json',
      data: JSON.stringify(tableData),
      success: function ( response ) {
        getSavedTableModifications(tableData.uri);
        addFilesToPreview();
      },
      error: function (response) {
        getSavedTableModifications(tableData.uri);
        addFilesToPreview();
        handleApiError(response);
      }
    });
  }

  /** Get the current saved values of the table modifications. **/
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

  /** Update the table modifications form. **/
  function updateTableModificationForm(tableJson) {
    $("#rows-excluded").val("");
    $("#header-rows").val("");
    $("#header-columns").val("");
    $("#rows-excluded").val(asCommaSeparatedStr(tableJson.modifications.rowsExcluded));
    $("#header-rows").val(asCommaSeparatedStr(tableJson.modifications.headerRows));
    $("#header-columns").val(asCommaSeparatedStr(tableJson.modifications.headerColumns));
  }

  /** Delete / Cancel **/
  $('.btn-table-builder-cancel').on('click', function () {
    $('.table-builder').stop().fadeOut(200).remove();

    // delete the preview table
    if (previewTable) {
      $(previewTable.files).each(function (index, file) {
        var fileToDelete = pageUrl + '/' + file.filename;
        deleteContent(Florence.collection.id, fileToDelete,
          onSuccess = function () {
            console.log("deleted table file: " + fileToDelete);
          });
      });

      deleteContent(Florence.collection.id, previewTable.uri + ".json", function(){}, function(){});
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
        deleteContent(Florence.collection.id, previewTable.uri + ".json", function(){}, function(){});
      }

      if (onSave) {
        onSave(table.filename, '<ons-table path="' + table.filename + '" />');
      }
      $('.table-builder').stop().fadeOut(200).remove();
    });
  });

  setShortcuts('#table-title');

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

  function asCommaSeparatedStr(_list) {
    var currentValues = "";
    _list.forEach( function( item) {
      currentValues = item + ", " + currentValues;
    });
    return currentValues.substring(0, currentValues.lastIndexOf(","));
  }

  /** Converts a comma separated string to a list **/
  function inputAsList(_elemId, _list) {
    if ( $(_elemId).val() ) {
      var valuesString = $(_elemId).val().split(",");
      valuesString.forEach( function(item) {
        var value = item.trim();
        if (value) {
          _list.push(value);
        }
      });
    }
    return _list;
  }

  function validateList(_list, fieldName, errors) {
    if (_list.length == 0) {
        return errors;
    }

    for (i = 0; i < _list.length; i++) {
      var value = _list[i];
      if (isNaN(value) || (!value)) {
        errors.messages.push(fieldName + " is invalid.");
        isValid = false;
        break;
      }
    }
    return errors;
  }
}

function loadTableBuilderV2(pageData, onSave, table) {
  const pageUrl = pageData.uri;
  const html = templates.tableBuilderV2(table);

  $('body').append(html);

  // onSave function - sends content to zebedee, adds the table to the parent page and closes the modal
  var saveTableV2 = function (tableJson) {
    if (!tableJson) {
      sweetAlert("Empty Table", "The table is empty - please select cancel instead.");
      return;
    }
    if (!tableJson.filename) {
      tableJson.filename = StringUtils.randomId();
    }
    if (!tableJson.uri) {
      tableJson.uri = pageUrl + "/" + tableJson.filename;
    }

    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + tableJson.uri + ".json&validateJson=false",
      type: 'POST',
      data: JSON.stringify(tableJson),
      processData: false,
      contentType: 'application/json'
    });
    addTableToPageJson(tableJson);
    if (onSave) {
      onSave(tableJson.filename, '<ons-table-v2 path="' + tableJson.uri + '" />');
    }
    closeModal();
  };

  // adds the table to the parent page
  function addTableToPageJson(tableJson) {
    if (!pageData.tables) {
      pageData.tables = [];
    } else {

      var existingTable = _.find(pageData.tables, function (existingTable) {
        return existingTable.filename === tableJson.filename;
      });

      if (existingTable) {
        existingTable.title = tableJson.title;
        return;
      }
    }

    pageData.tables.push({title: tableJson.title, filename: tableJson.filename, uri: tableJson.uri, version: "2"});
  }

  function onError(message) {
    sweetAlert(message);
  }

  function closeModal() {
    closeTableBuilder("table-builder-app", onError)
    $('.table-builder').stop().fadeOut(200).remove();
  }

  if (table && table.filename) {
    jqxhr = $.getJSON("/zebedee/content/" + Florence.collection.id + "?uri=" + pageUrl + "/" + table.filename + ".json");
    jqxhr.done(function(data) {
        startTableBuilder("table-builder-app", data, saveTableV2, closeModal, onError, '/table');
    });
  } else {
      startTableBuilder("table-builder-app", {}, saveTableV2, closeModal, onError, '/table');
  }

}