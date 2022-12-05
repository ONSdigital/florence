/**
 * Gets the JSON file for the page
 * @param collectionId
 * @param path
 * @param success
 * @param error
 * @returns {*}
 */

function getPageData(collectionId, path, success, error) {
  var safePath = checkPathSlashes(path);
  var lang = Florence.globalVars.welsh ? "cy" : "en";
  return $.ajax({
    url: "/zebedee/data/" + collectionId + "?uri=" + safePath+"&lang=" + lang,
    dataType: 'json',
    type: 'GET',
    success: function (response) {
      var date = new Date();
      date = date.getHours() + ":" + date.getMinutes() + "." + date.getMilliseconds();
      console.log("[" + date + "] Get page content: \n", response);
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

/**
 * Get page data with only the page description.
 * @param collectionId
 * @param path
 * @param success
 * @param error
 * @returns {*}
 */
function getPageDataDescription(collectionId, path, success, error) {
  var lang = Florence.globalVars.welsh ? "cy" : "en";
  return $.ajax({
    url: "/zebedee/data/" + collectionId + "?uri=" + path + '&description&lang=' + lang,
    dataType: 'json',
    type: 'GET',
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

/**
 * Get page data with only the page title.
 * @param collectionId
 * @param path
 * @param success
 * @param error
 * @returns {*}
 */
function getPageDataTitle(collectionId, path, success, error) {
  var lang = Florence.globalVars.welsh ? "cy" : "en";
  return $.ajax({
    url: "/zebedee/data/" + collectionId + "?uri=" + path + '&title&lang=' + lang,
    dataType: 'json',
    type: 'GET',
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

function getBabbagePageData(collectionId, path, success, error) {
  return $.ajax({
    url: path + '/data',
    dataType: 'json',
    type: 'GET',
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
