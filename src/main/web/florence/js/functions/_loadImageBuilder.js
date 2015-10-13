function loadImageBuilder(pageData, onSave, image) {

  var pageUrl = pageData.uri;
  var html = templates.imageBuilder(image);
  $('body').append(html);

  if (image) {
    renderImage(image.uri);
  }

  $('#upload-image-form').submit(function (event) {

    event.preventDefault();

    var formData = new FormData($(this)[0]);
    var image = buildJsonObjectFromForm();
    var path = image.uri;
    var jpgPath = path + ".jpg";


    // send jpg file to zebedee
    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + jpgPath,
      type: 'POST',
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: function () {
      }
    });

    return false;
  });

  function renderImage(path) {
    var uri = path + "/image";
    var iframeMarkup = '<iframe id="preview-frame" frameBorder ="0" scrolling = "yes" src="' + uri + '"></iframe>';
    console.log(iframeMarkup);
    $('#image').html(iframeMarkup);

    document.getElementById('preview-frame').height = "500px";
    document.getElementById('preview-frame').width = "100%";
  }

  $('.btn-image-builder-cancel').on('click', function () {
    $('.image-builder').stop().fadeOut(200).remove();
  });

  function saveImageJson() {

    image = buildJsonObjectFromForm();
    var imageJson = image.uri + ".json";

    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + imageJson,
      type: 'POST',
      data: JSON.stringify(image),
      processData: false,
      contentType: 'application/json',
      success: function () {
        addImageToPageJson(image);
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

  function buildJsonObjectFromForm() {
    if (!image) {
      image = {};
    }

    image.type = 'image';
    image.title = $('#image-title').val();
    image.filename = image.filename ? image.filename : StringUtils.randomId();

    image.uri = pageUrl + "/" + image.filename;

    if (image.title === '') {
      image.title = '[Title]';
    }

    image.files = [];
    image.files.push({type: 'image-jpg', filename: image.filename + '.jpg'});

    return image;
  }
}


