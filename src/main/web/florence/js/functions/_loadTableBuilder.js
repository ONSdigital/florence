function loadTableBuilder(pageData, onSave, table) {
  var pageUrl = pageData.uri;
  var html = templates.tableBuilder(table);
  var previewTable;

  $('body').append(html);

  if (table) {
    renderTable(table.uri);
  }

  $('#upload-table-form').submit(function (event) {
    var formData = new FormData($(this)[0]);
    previewTable = buildJsonObjectFromForm(previewTable);
    var path = previewTable.uri;
    var xlsPath = path + ".xls";
    var htmlPath = path + ".html";

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

    function saveTableHtml(data) {
      $.ajax({
        url: "/zebedee/content/" + Florence.collection.id + "?uri=" + htmlPath,
        type: 'POST',
        data: data,
        processData: false,
        success: function () {
          previewTable.files.push({type: 'download-xls', filename: previewTable.filename + '.xls'});
          previewTable.files.push({type: 'html', filename: previewTable.filename + '.html'});
          renderTable(path);
        }
      });
    }

    return false;
  });

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

  $('.btn-table-builder-cancel').on('click', function () {

    $('.table-builder').stop().fadeOut(200).remove();

    // delete the preview table
    if (previewTable) {
      deleteContent(Florence.collection.id, previewTable.uri + ".json");
      $(previewTable.files).each(function (index, file) {
        var fileToDelete = pageUrl + '/' + file.filename;
        deleteContent(Florence.collection.id, fileToDelete,
          onSuccess = function () {
            console.log("deleted table file: " + fileToDelete);
          });
      });
    }
  });


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
      pageData.tables = []
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

  $('.btn-table-builder-create').on('click', function () {

    // if uploaded = true rename the preview table
    previewTable = buildJsonObjectFromForm(previewTable);

    // if a table exists, rename the preview to its name
    if (table) {
      table = mapJsonValues(previewTable, table);

      $(previewTable.files).each(function (index, file) {
        var fromFile = pageUrl + '/' + file.filename;
        var toFile = pageUrl + '/' + file.filename.replace(previewTable.filename, table.filename);
        console.log("moving... table file: " + fromFile + " to: " + toFile);
        moveContent(Florence.collection.id, fromFile, toFile,
          onSuccess = function () {
            console.log("Moved table file: " + fromFile + " to: " + toFile);
          });
      });
      deleteContent(Florence.collection.id, previewTable.uri + ".json", function(){}, function(){});
    } else { // just keep the preview files
      table = previewTable;
      addTableToPageJson(table);
    }

    saveTableJson(table, success=function() {
      if (onSave) {
        onSave(table.filename, '<ons-table path="' + table.uri + '" />');
      }
      $('.table-builder').stop().fadeOut(200).remove();
    });
  });

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

    return table;
  }
}

