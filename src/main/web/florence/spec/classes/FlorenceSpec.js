describe("Florence", function() {

  window = {};
  window.location = {};
  window.location.host = 'http://florence.com';
  var Florence = require('../../js/classes/florence.js');

  it("should exist", function() {
    expect(Florence).toBeDefined();
  });

  describe("Editor", function() {

    it("should exist", function() {
      expect(Florence.Editor).toBeDefined();
    });

  });

  describe("Authentication", function() {

    it("should exist", function() {
      expect(Florence.Authentication).toBeDefined();
    });

    it("should exist", function() {
      expect(Florence.Authentication.accessToken).toBeDefined();
    });

    it("should exist", function() {
      expect(Florence.Authentication.isAuthenticated).toBeDefined();
    });

  });
});
