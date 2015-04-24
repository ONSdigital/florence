describe("StringUtils", function() {

  require('../../js/classes/stringUtils.js');

  describe(".textareaLines(line, maxLineLength, start, numberOfLinesCovered)", function() {

    it("should return 0 for a single line", function() {
      //function(line, maxLineLength, start, numberOfLinesCovered) {
      var input = 'Single Line';
      var lineLength = 100;
      expect(StringUtils.textareaLines(input, lineLength, 0, 0)).toEqual(0);
    });

    it("should return 0 for a single line equal to line length", function() {
      //function(line, maxLineLength, start, numberOfLinesCovered) {
      var input = 'This line is 31 characters long';
      var lineLength = 31;
      expect(StringUtils.textareaLines(input, lineLength, 0, 0)).toEqual(0);
    });

    it("should return 0 for a single line equal to line length", function() {
      //function(line, maxLineLength, start, numberOfLinesCovered) {
      var input = 'This line is 32 characters long ';
      var lineLength = 31;
      expect(StringUtils.textareaLines(input, lineLength, 0, 0)).toEqual(0);
    });

    it("should return 2 for a double line equal to line length", function() {
      //function(line, maxLineLength, start, numberOfLinesCovered) {
      var input = '1234 12345';
      var lineLength = 5;
      expect(StringUtils.textareaLines(input, lineLength, 0, 0)).toEqual(2);
    });
  });

});
