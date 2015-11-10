function loadTableBuilder(pageData, onSave, table) {

  var pageUrl = pageData.uri;
  var html = templates.tableBuilder(table);
  var uploadedNotSaved = {uploaded: false, saved: false};
  $('body').append(html);

  if (table) {
    renderTable(table.uri);
  }

  $('#upload-table-form').submit(function (event) {
    var formData = new FormData($(this)[0]);
    var table = buildJsonObjectFromForm();
    var path = table.uri;
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
        createTableHtml();
      }
    });

    function createTableHtml() {
      $.ajax({
        url: "/zebedee/table/" + Florence.collection.id + "?uri=" + xlsPath,
        type: 'POST',
        success: function (html) {
          saveTableJson();
          saveTableHtml(html);
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
          renderTable(path);
          uploadedNotSaved.uploaded = true;
        }
      });
    }

    return false;
  });

  function renderTable(path) {
    var iframeMarkup = '<iframe id="preview-frame" style="opacity:0" frameBorder ="0" scrolling = "yes" src="' + path + '"></iframe>';
    console.log(iframeMarkup);
    $('#preview-table').html(iframeMarkup);
    var iframe = $('#preview-frame');
    iframe.load(function(){
      var contents = iframe.contents();
      iframe.height(contents.find('html').height());
      iframe.css("opacity", "1");
      contents.find('body').css("background", "transparent");
    });

  }

  $('.btn-table-builder-cancel').on('click', function () {
    console.log("got here");
    $('.table-builder').stop().fadeOut(200).remove();
    if (uploadedNotSaved.uploaded === true && uploadedNotSaved.saved === false) {
      //delete any files associated with the table.
      //add table.json to file
      table.files.push({"type":"json","filename": table.filename + '.json'});
      $(table.files).each(function (index, file) {
        var fileToDelete = pageUrl + '/' + file.filename;
        deleteContent(Florence.collection.id, fileToDelete,
          onSuccess = function () {
            console.log("deleted table file: " + fileToDelete);
          });
      });
    }
  });

  function saveTableJson() {

    table = buildJsonObjectFromForm();
    var tableJson = table.uri + ".json";

    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + tableJson,
      type: 'POST',
      data: JSON.stringify(table),
      processData: false,
      contentType: 'application/json',
      success: function () {
        addTableToPageJson(table);
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

    saveTableJson();
    uploadedNotSaved.saved = true;
    if (onSave) {
      onSave(table.filename, '<ons-table path="' + table.uri + '" />');
    }
    $('.table-builder').stop().fadeOut(200).remove();

  });

  function buildJsonObjectFromForm() {
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

    table.files = [];
    table.files.push({type: 'download-xls', filename: table.filename + '.xls'});
    table.files.push({type: 'html', filename: table.filename + '.html'});

    return table;
  }
}

