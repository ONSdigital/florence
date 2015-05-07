describe("PathUtils", function() {

  var PathUtils = require('../../js/classes/pathUtils.js');

  describe(".isJsonFile(uri)", function() {

    it("should return true for data.json file", function() {
      expect(PathUtils.isJsonFile('data.json')).toEqual(true);
    });

    it("should return false for non data.json file", function() {
      expect(PathUtils.isJsonFile('some.json')).toEqual(false);
    });

    it("should return false for data.json path", function() {
      expect(PathUtils.isJsonFile('/some/path/data.json')).toEqual(true);
    });

    it("should return false for non data.json path", function() {
      expect(PathUtils.isJsonFile('/some/path/this.json')).toEqual(false);
    });

    it("should return false for empty", function() {
      expect(PathUtils.isJsonFile('')).toEqual(false);
    });
  });
});
