function checkRenameUri(collectionId, data, renameUri, onSave) {
  if (renameUri) {
    swal({
      title: "Warning",
      text: "You have changed the title or edition and this could change the uri. Are you sure you want to proceed?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Change url",
      cancelButtonText: "Cancel",
      closeOnConfirm: true
    }, function (result) {
      if (result === true) {
        // Does it have edition?
        if (data.description.edition) {
          //Special case dataset editions. They have edition but not title
          if (data.description.title) {
            var titleNoSpace = data.description.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
          }
          var editionNoSpace = data.description.edition.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
          var tmpNewUri = data.uri.split("/");
          if (data.type === 'dataset') {
            tmpNewUri.splice([tmpNewUri.length - 1], 1, editionNoSpace);
          } else {
            tmpNewUri.splice([tmpNewUri.length - 2], 2, titleNoSpace, editionNoSpace);
          }
          var newUri = tmpNewUri.join("/");
          //is it a compendium? Rename children array
          if (data.type === 'compendium_landing_page') {
            if (data.chapters) {
              data.chapters = renameCompendiumChildren(data.chapters, titleNoSpace, editionNoSpace);
            }
            if (data.datasets) {
              data.datasets = renameCompendiumChildren(data.datasets, titleNoSpace, editionNoSpace);
            }
          }
          moveContent(collectionId, data.uri, newUri,
            onSuccess = function () {
              Florence.globalVars.pagePath = newUri;
              onSave(collectionId, newUri, JSON.stringify(data));
            }
          );
          console.log(newUri);
          // is it an adHoc?
        } else if (data.type === 'static_adhoc') {
          var titleNoSpace = data.description.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
          var referenceNoSpace = data.description.reference.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
          var tmpNewUri = data.uri.split("/");
          tmpNewUri.splice([tmpNewUri.length - 1], 1, referenceNoSpace + titleNoSpace);
          var newUri = tmpNewUri.join("/");
          moveContent(collectionId, data.uri, newUri,
            onSuccess = function () {
              Florence.globalVars.pagePath = newUri;
              onSave(collectionId, newUri, JSON.stringify(data));
            }
          );
          console.log(newUri);
        } else {
          var titleNoSpace = data.description.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
          var tmpNewUri = data.uri.split("/");
          //Articles with no edition. Add date as edition
          if (data.type === 'article' || data.type === 'article_download') {
            var editionDate = $.datepicker.formatDate('yy-mm-dd', new Date());
            tmpNewUri.splice([tmpNewUri.length - 2], 2, titleNoSpace, editionDate);
          } else {
            tmpNewUri.splice([tmpNewUri.length - 1], 1, titleNoSpace);
          }
          var newUri = tmpNewUri.join("/");
          //if it is a dataset rename children array
          if (data.type === 'dataset_landing_page') {
            if (data.datasets) {
              data.datasets = renameDatasetChildren(data.datasets, titleNoSpace);
            }
          }
          moveContent(collectionId, data.uri, newUri,
            onSuccess = function () {
              Florence.globalVars.pagePath = newUri;
              onSave(collectionId, newUri, JSON.stringify(data));
            }
          );
          console.log(newUri);
        }
      } else {
        refreshPreview(data.uri);
        loadPageDataIntoEditor(data.uri, collectionId);
      }
    });
  } else {
    onSave(collectionId, data.uri, JSON.stringify(data));
  }
}

