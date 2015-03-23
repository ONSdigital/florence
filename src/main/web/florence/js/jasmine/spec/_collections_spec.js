describe("Create Collection", function() {

  beforeEach(function(){
    jasmine.Ajax.install();
  });

  afterEach(function(){
    jasmine.Ajax.uninstall();
  });

  it("knows to format the '/' in urls to '<first part>/<second part>/<third part>", function() {
    expect(makeUrl('hello','/world/')).toBe('hello/world');
    expect(makeUrl('/hello','/world/')).toBe('hello/world');
    expect(makeUrl('/hello/','world/')).toBe('hello/world');
  });

  it("requests data from the servers collections api",function(){
    describe("collections API",function(){
      beforeEach(function(){
        viewCollections.respondWith(TestResponses.collections.success);
      })
    })
    viewCollections()

    expect(jasmine.Ajax.requests.mostRecent().url).toBe('http://localhost:8082/collections');
    console.log(jasmine.Ajax.requests.mostRecent())
  });



});
