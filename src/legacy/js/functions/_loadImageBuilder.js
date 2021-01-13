/**
 * Load the image builder screen. This screen is for adding images that cannot be built using the chart
 * builder, hence the additional parameters in the builder that imitate a chart.
 * @param pageData - The data for the page the image is being added to.
 * @param onSave - The function to call when the image is saved and the image builder is closed.
 * @param image - The existing image object if an existing image is being edited.
 */
function loadImageBuilder(pageData, onSave, image) {
  var pageUrl = pageData.uri;
  var previewImage;

  // render the template for the image builder screen
  var html = templates.imageBuilder(image);
  $('body').append(html);

  // The files uploaded as part of the image creation are stored in an array on the image object.
  // These keys identify the different types of files that can be added.
  var imageFileKey = "uploaded-image"; // The actual image shown on screen
  var dataFileKey = "uploaded-data"; // The associated data file for the image.

  // if we are passing an existing image to the builder, go ahead and show it.
  if (image) {
    renderImage(getImageUri(image));
    renderText();
  }

  // If any text fields on the form are changed, update them.
  $('.refresh-text').on('input', function () {
    renderText();
  });

  $('#upload-image-form').submit(function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    var formData = new FormData($(this)[0]);
    var file = this[0].files[0];
    if (!file) {
      sweetAlert('Please select a file to upload.');
      return;
    }

    if (!/\.png|.jpeg$|.jpg$|/.test(file)) {
      sweetAlert('The data file upload is limited to PNG and JPEG.', "", "info");
      return;
    }

    var fileExtension = file.name.split('.').pop();
    previewImage = buildJsonObjectFromForm(previewImage);
    var imagePath = previewImage.uri + '.' + fileExtension;
    var imageFileName = previewImage.filename + '.' + fileExtension;
    var fileExists = getExistingFileName(previewImage, imageFileKey);

    uploadFile(
      imagePath,
      formData,
      success = function () {
        if (!fileExists) {
          previewImage.files.push({type: imageFileKey, filename: imageFileName, fileType: fileExtension});
        }
        renderImage(getImageUri(previewImage));
      });

    return false;
  });

  $('#upload-data-form').submit(function (event) {
    $(this).find(':submit').attr('disabled', 'disabled');
    event.preventDefault();
    event.stopImmediatePropagation();

    var formData = new FormData($(this)[0]);
    var file = this[0].files[0];
    if (!file) {
      sweetAlert('Please select a file to upload.');
      return;
    }

    if (!/\.csv$|.xls$|.xlsx$|/.test(file)) {
      sweetAlert('The data file upload is limited to CSV, XLS, or XLSX.');
      return;
    }

    var fileExtension = file.name.split('.').pop();
    previewImage = buildJsonObjectFromForm(previewImage);
    var filePath = previewImage.uri + '.' + fileExtension;
    var fileName = previewImage.filename + '.' + fileExtension;
    var fileExists = getExistingFileName(previewImage, dataFileKey);

    uploadFile(
      filePath,
      formData,
      success = function () {
        if (!fileExists) {
          swal({
            title: "Upload complete",
            text: "Upload complete",
            type: "success",
            timer: 2000
          });
          previewImage.files.push({type: dataFileKey, filename: fileName, fileType: fileExtension});
        }
      });

    return false;
  });


  function mapImageJsonValues(from, to) {
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

      if (!fileExistsInImage) {
        to.files.push(fromFile);
      }
    });

    return to;
  }

  $('.btn-image-builder-create').on('click', function () {

    previewImage = buildJsonObjectFromForm(previewImage);

    if (!previewImage.title) {
      sweetAlert("Please enter a title for the image.");
      return;
    }

    if (!previewImage.altText) {
      sweetAlert("Please enter alt text for the image.");
      return;
    }

    var imageFileName = getExistingFileName(previewImage, imageFileKey);
    if (!imageFileName && image)
      imageFileName = getExistingFileName(image, imageFileKey);
    if (!imageFileName) {
      sweetAlert("Please upload an image");
      return;
    }

    var imageExists = false;
    if (image) {
      imageExists = true;
      // map preview image values onto image
      image = mapImageJsonValues(previewImage, image);
    } else { // just use the preview files
      image = previewImage;
      addImageToPageJson(image);
    }

    saveImageJson(image, success = function () {

      // if there is an image that exists already, overwrite it.
      if (imageExists) {
        $(previewImage.files).each(function (index, file) {
          var fromFile = pageUrl + '/' + file.filename;
          var toFile = pageUrl + '/' + file.filename.replace(previewImage.filename, image.filename);
          if (fromFile != toFile) {
            console.log("moving... table file: " + fromFile + " to: " + toFile);
            renameContent(Florence.collection.id, fromFile, toFile,
              onSuccess = function () {
                console.log("Moved table file: " + fromFile + " to: " + toFile);
              });
          }
        });
      }

      if (onSave) {
        onSave(image.filename, '<ons-image path="' + image.filename + '" />', pageData);
      }
      closeImageBuilderScreen();
    });
  });

  $('.btn-image-builder-cancel').on('click', function () {

    closeImageBuilderScreen();

    if (previewImage) {
      $(previewImage.files).each(function (index, file) {

        var fileToDelete = pageUrl + '/' + file.filename;
        deleteContent(Florence.collection.id, fileToDelete,
          onSuccess = function () {
            console.log("deleted image file: " + fileToDelete);
          });
      });
    }
  });

  function closeImageBuilderScreen() {
    $('.image-builder').stop().fadeOut(200).remove();
  }

  setShortcuts('#image-title');
  setShortcuts('#image-subtitle');

  function renderText() {
    var title = doSuperscriptAndSubscript($('#image-title').val());
    var subtitle = doSuperscriptAndSubscript($('#image-subtitle').val());
    $('#image-title-preview').html(title);
    $('#image-subtitle-preview').html(subtitle);
    $('#image-source-preview').html($('#image-source').val());
    $('#image-notes-preview').html(toMarkdown($('#image-notes').val()));
  }

  function renderImage(imageUri) {
    var iframeMarkup = '<iframe id="preview-frame" frameBorder ="0" scrolling = "yes" src="' + '/zebedee/resource/' + Florence.collection.id + '?uri=' + imageUri + '"></iframe>';
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

  function toMarkdown(text) {
    if (text && isMarkdownAvailable) {
      var converter = new Markdown.getSanitizingConverter();
      Markdown.Extra.init(converter, {
        extensions: "all"
      });
      return converter.makeHtml(text)
    }
    return '';
  }

  function isMarkdownAvailable() {
    return typeof Markdown !== 'undefined'
  }

  function doSuperscriptAndSubscript(text) {
    if (text && isMarkdownAvailable) {
      var converter = new Markdown.Converter();
      return converter._DoSubscript(converter._DoSuperscript(text));
    }
    return text;

  }


  function uploadFile(path, formData, success) {
    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + path,
      type: 'POST',
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: function () {
        if (success) {
          success();
        }
      }
    });
  }

  function getImageUri(image) {
    if (pageUrl === '/') {
      return '/' + getImageFilename(image);
    } else {
      return pageData.uri + '/' + getImageFilename(image);
    }
  }

  function getImageFilename(image) {
    return getExistingFileName(image, imageFileKey)
  }

  // for any figure object, iterate the files and return the file path for the given key.
  function getExistingFileName(object, key) {
    var result;
    _.each(object.files, function (file) {
      if (key === file.type) {
        result = file.filename;
      }
    });
    return result;
  }

  function saveImageJson(image, success, error) {
    var noExtension = image.uri.match(/^(.+?)(\.[^.]*$|$)/);
    var imageJson = noExtension[1] + ".json";

    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + imageJson,
      type: 'POST',
      data: JSON.stringify(image),
      processData: false,
      contentType: 'application/json',
      success: function (response) {
        if (success)
          success(response);
      },
      error: function (response) {
        if (error) {
          error(response);
        } else {
          handleApiError(response);
        }
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

  function buildJsonObjectFromForm(image) {
    if (!image) {
      image = {};
    }

    image.type = "image";
    // give the image a unique ID if it does not already have one.
    image.filename = image.filename ? image.filename : StringUtils.randomId();
    image.title = $('#image-title').val();
    if (pageUrl === '/') {
      image.uri = "/" + image.filename;
    } else {
      image.uri = pageUrl + "/" + image.filename;
    }
    image.subtitle = $('#image-subtitle').val();
    image.source = $('#image-source').val();
    image.notes = $('#image-notes').val();
    image.altText = $('#image-alt-text').val();

    if (!image.files) {
      image.files = [];
    }

    return image;
  }
}


