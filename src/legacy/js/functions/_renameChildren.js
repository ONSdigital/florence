function renameCompendiumChildren (arrayToRename, titleNoSpace, editionNoSpace) {
  arrayToRename.forEach(function (elem, index, array) {
    var x = elem.uri.split("/");
    x.splice([x.length - 3], 2, titleNoSpace, editionNoSpace);
    elem.uri = x.join("/");
  });
  return arrayToRename;
}

function renameDatasetChildren (arrayToRename, titleNoSpace) {
  arrayToRename.forEach(function (elem, index, array) {
    var x = elem.uri.split("/");
    x.splice([x.length - 2], 1, titleNoSpace);
    elem.uri = x.join("/");
  });
  return arrayToRename;
}

