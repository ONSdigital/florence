function loadImageBuilder(pageData, onSave, image) {
  var file = {};
  var pageUrl = pageData.uri;
  var html = templates.imageBuilder(image);
  var uploadedNotSaved = {uploaded: false, saved: false, image: ""};
  $('body').append(html);

  if (image) {
    renderImage(image.uri);
  }

  $('.refresh-text').on('input', function() {
    renderText();
  });

  function renderText() {

    $('#image-title-preview').html($('#image-title').val());
    $('#image-subtitle-preview').html($('#image-subtitle').val());
    $('#image-source-preview').html($('#image-source').val());
    var notes = $('#image-notes').val();

    if (notes) {
      if (typeof Markdown !== 'undefined') {
        var converter = new Markdown.getSanitizingConverter();
        Markdown.Extra.init(converter, {
          extensions: "all"
        });
        var notes = converter.makeHtml(notes);
        $('#image-notes-preview').html(notes);
      }
    } else {
      $('#image-notes-preview').empty();
    }
  }

  $('#upload-image-form').submit(function (event) {
    $(this).find(':submit').attr('disabled', 'disabled');
    event.preventDefault();
    event.stopImmediatePropagation();

    var formData = new FormData($(this)[0]);
    file = this[1].files[0];
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    var image = buildJsonObjectFromForm(file);
    var imagePath = image.uri;


    // send image file to zebedee
    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + imagePath,
      type: 'POST',
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: function () {
        renderImage(image.uri);
        uploadedNotSaved.uploaded = true;
        uploadedNotSaved.image = imagePath;
      }
    });

    return false;
  });

  function renderImage(image) {
    var iframeMarkup = '<iframe id="preview-frame" frameBorder ="0" scrolling = "yes" src="' + '/zebedee/resource/' + Florence.collection.id + '?uri=' + image + '"></iframe>';
    $('#image').html(iframeMarkup);
    var iframe = document.getElementById('preview-frame');
    iframe.height = "500px";
    iframe.width = "100%";
    setTimeout(
      function () {
        body = $('#preview-frame').contents().find('body');
        $(body).children().css('height', '100%');
      }, 100);
  }

  $('.btn-image-builder-cancel').on('click', function () {
    $('.image-builder').stop().fadeOut(200).remove();
    if (uploadedNotSaved.uploaded === true && uploadedNotSaved.saved === false) {
      deleteContent(Florence.collection.id, uploadedNotSaved.image,
        onSuccess = function () {
        },
        onError = function (error) {
          handleApiError(error);
        }
      );
    }
  });

  function saveImageJson() {
    var noExtension = image.uri.match(/^(.+?)(\.[^.]*$|$)/);
    var imageJson = noExtension[1] + ".json";

    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + imageJson,
      type: 'POST',
      data: JSON.stringify(image),
      processData: false,
      contentType: 'application/json',
      success: function () {
        addImageToPageJson(image);
        uploadedNotSaved.saved = true;
      }
    });
  }

  function addImageToPageJson(image) {
    if (!pageData.images) {
      pageData.images = [];
    } else {

      var existingImage = _.find(pageData.images, function (existingImage) {
        return existingImage.filename === image.filename;
      });

      if (existingImage) {
        existingImage.title = image.title;
        return;
      }
    }

    pageData.images.push({title: image.title, filename: image.filename, uri: image.uri});
  }

  $('.btn-image-builder-create').on('click', function () {

    saveImageJson();

    if (onSave) {
      onSave(image.filename, '<ons-image path="' + image.uri + '" />');
    }
    $('.image-builder').stop().fadeOut(200).remove();

  });

  function buildJsonObjectFromForm(file) {
    if (!image) {
      image = {};
    }

    image.type = file.type;
    image.title = $('#image-title').val();
    var fileNameNoSpace = file.name.replace(/\s*/g, "").toLowerCase();
    image.filename = fileNameNoSpace;

    image.uri = pageUrl + "/" + image.filename;

    if (image.title === '') {
      image.title = '[Title]';
    }
    return image;
  }
}


