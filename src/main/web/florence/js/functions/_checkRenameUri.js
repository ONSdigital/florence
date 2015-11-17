function checkRenameUri (collectionId, data, renameUri, onSave) {
  if (renameUri) {
    swal({
      title: "Warning",
      text: "You have changed the title or edition and this could change the uri. Are you sure you want to proceed?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Change url",
      cancelButtonText: "Save without changing url",
      closeOnConfirm: true
    }, function (result) {
      if (result === true) {
        // Does it have edition?
        if (data.description.edition) {
          var titleNoSpace = data.description.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
          var editionNoSpace = data.description.edition.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
          var tmpNewUri = data.uri.split("/");
          var tmpArray = tmpNewUri.splice([tmpNewUri.length-2], 2, titleNoSpace, editionNoSpace);
          var newUri = tmpNewUri.join("/");
          onSave(collectionId, data.uri, JSON.stringify(data));
          moveContent(collectionId, data.uri, newUri,
            onSuccess = function () {
              refreshPreview(newUri);
              loadPageDataIntoEditor(newUri, collectionId);
            }
          );
          console.log(newUri);
          // is it an adHoc?
        } else if (data.type === 'static_adhoc') {
          var titleNoSpace = data.description.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
          var referenceNoSpace = data.description.reference.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
          var tmpNewUri = data.uri.split("/");
          var tmpArray = tmpNewUri.splice([tmpNewUri.length-1], 1, referenceNoSpace + titleNoSpace);
          var newUri = tmpNewUri.join("/");
          onSave(collectionId, data.uri, JSON.stringify(data));
          moveContent(collectionId, data.uri, newUri,
            onSuccess = function () {
              refreshPreview(newUri);
              loadPageDataIntoEditor(newUri, collectionId);
            }
          );
          console.log(newUri);
        } else {
          var titleNoSpace = data.description.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
          var tmpNewUri = data.uri.split("/");
          var tmpArray = tmpNewUri.splice([tmpNewUri.length-1], 1, titleNoSpace);
          var newUri = tmpNewUri.join("/");
          onSave(collectionId, data.uri, JSON.stringify(data));
          moveContent(collectionId, data.uri, newUri,
            onSuccess = function () {
              refreshPreview(newUri);
              loadPageDataIntoEditor(newUri, collectionId);
            }
          );
          console.log(newUri);
        }
      } else {
        onSave(collectionId, data.uri, JSON.stringify(data));
      }
    });
  } else {
    onSave(collectionId, data.uri, JSON.stringify(data));
  }
}

