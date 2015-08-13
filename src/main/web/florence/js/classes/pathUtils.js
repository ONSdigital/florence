var PathUtils = {
  isJsonFile: function (uri) {
    return uri.indexOf('data.json', uri.length - 'data.json'.length) !== -1;
  }
};

// if running in a node environment export this as a module.
if (typeof module !== 'undefined') {
  module.exports = PathUtils;
}




