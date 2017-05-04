describe("StringUtils", function () {

  var StringUtils = require('../../js/classes/stringUtils.js');

  describe(".formatIsoDateString", function () {

    it("should exist", function() {
      expect(StringUtils.formatIsoDateString).toBeDefined();
    });

    //it("should format as expected", function () {
    //  var input = new Date(2015, 02, 03, 04, 05, 06, 07);
    //  expect(StringUtils.formatIsoDateString(input)).toEqual('');
    //});

  });

  describe(".formatIsoFullDateString", function () {

    it("should exist", function() {
      expect(StringUtils.formatIsoFullDateString).toBeDefined();
    });

    //it("should format as expected", function () {
    //  var input = new Date(2015, 02, 03, 04, 05, 06, 07);
    //  expect(StringUtils.formatIsoDateString(input)).toEqual('');
    //});
  });

  describe(".textareaLines(line, maxLineLength, start, numberOfLinesCovered)", function () {

    it("should return 0 for a single line", function () {
      //function(line, maxLineLength, start, numberOfLinesCovered) {
      var input = 'Single Line';
      var lineLength = 100;
      expect(StringUtils.textareaLines(input, lineLength, 0, 0)).toEqual(0);
    });

    it("should return 0 for a single line equal to line length", function () {
      //function(line, maxLineLength, start, numberOfLinesCovered) {
      var input = 'This line is 31 characters long';
      var lineLength = 31;
      expect(StringUtils.textareaLines(input, lineLength, 0, 0)).toEqual(0);
    });

    it("should return 0 for a single line equal to line length", function () {
      //function(line, maxLineLength, start, numberOfLinesCovered) {Fixed edge case on
      var input = 'This line is 32 characters long ';
      var lineLength = 31;
      expect(StringUtils.textareaLines(input, lineLength, 0, 0)).toEqual(0);
    });

    it("should return 2 for a double line equal to line length", function () {
      //function(line, maxLineLength, start, numberOfLinesCovered) {
      var input = '1234 12345';
      var lineLength = 5;
      expect(StringUtils.textareaLines(input, lineLength, 0, 0)).toEqual(2);
    });

    it("should not stack overflow with this input", function () {
      var input = '### Where to find explanatory information\n[Explaining the concepts of employment, unemployment and economic inactivity](http://www.ons.gov.uk/ons/rel/lms/labour-market-guidance/interpreting-labour-market-statistics/explaining-employment--unemployment-and-inactivity.html "Explaining the concepts of employment, unemployment and economic inactivity") is available on the website as a short video.\n [Interpreting Labour Market statistics](http://www.ons.gov.uk/ons/rel/lms/labour-market-guidance/interpreting-labour-market-statistics/interpreting-lm-statistics.html "Interpreting Labour Market statistics"), available on the website, is designed to help users interpret labour market statistics and highlight some common misunderstandings.\n  A more detailed [Guide to Labour Market Statistics](http://www.ons.gov.uk/ons/rel/lms/labour-market-guidance/guide-to-labour-market-statistics/guide-to-lm-statistics.html "Guide to Labour Market Statistics"), which expands on “Interpreting Labour Market Statistics” and includes a [Glossary](http://www.ons.gov.uk/ons/rel/lms/labour-market-guidance/guide-to-labour-market-statistics/guide-to-lm-statistics.html#tab-supporting-info "Glossary") , is also available.';
      var lineLength = 110;
      expect(StringUtils.textareaLines(input, lineLength, 0, 0)).toEqual(12);
    });
  });

});
