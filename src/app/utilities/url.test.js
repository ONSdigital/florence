import url from './url';

function setLocation(href) {
    jsdom.reconfigure({
        url: href
      });
}
setLocation('http://publishing.onsdigital.co.uk/florence/datasets');

jest.mock('../utilities/logging/log', () => {
    return {
        event: function() {
            // do nothing
        }
    }
});

jest.mock('../utilities/notifications', () => {
    return {
        add: function() {
            // do nothing
        }
    }
});

afterEach(() => {
    setLocation('http://publishing.onsdigital.co.uk/florence/datasets');
});

describe("'../' should remove one route from the path", () => {
    it("'../' will go up one level", () => {
        expect(url.resolve("../")).toBe("/florence");
    })

    it("'../../' will go up two levels", () => {
        setLocation('http://publishing.onsdigital.co.uk/florence/datasets/an-id-12345/metadata');
        expect(url.resolve("../../")).toBe("/florence/datasets");
    })
    it("'../../../teams' will go up three levels and to the teams path", () => {
        setLocation('http://publishing.onsdigital.co.uk/florence/datasets/an-id-12345/metadata');
        expect(url.resolve("../../../teams")).toBe("/florence/teams");
    })
});

test("Routes relative to the root are prefixed with '/florence'", () => {
    expect(url.resolve('/teams')).toBe("/florence/teams");
    expect(url.resolve('/')).toBe("/florence");
});

test("Replacing the last route at the root of the app still prefixes the path with '/florence'", () => {
    setLocation('http://publishing.onsdigital.co.uk/florence');
    expect(url.resolve("datasets")).toBe("/florence/datasets");
})

test("Path from current location replaces the last route with the new path", () => {
    expect(url.resolve("teams")).toBe("/florence/teams");
})

test("Slugged URL with leading slash produces correct slug without leading dash", () => {
    expect(url.slug("/economy/grossdomesticproduct/bulletins/gdp/jan2017")).toBe("economy-grossdomesticproduct-bulletins-gdp-jan2017");
});

test("Slugged URL without leading slash produces correct slug", () => {
    expect(url.slug("economy/grossdomesticproduct/bulletins/gdp/jan2017")).toBe("economy-grossdomesticproduct-bulletins-gdp-jan2017");
});

describe("Resolved URLs include query parameters", () => {
    it("includes queries on routes from the root path", () => {
        expect(url.resolve("/datasets/my-dataset/editions/current/versions/1?collection=my-collection")).toBe("/florence/datasets/my-dataset/editions/current/versions/1?collection=my-collection");
    });
    
    it("includes queries on relative routes", () => {
        setLocation('http://publishing.onsdigital.co.uk/florence/datasets/my-dataset-id');
        expect(url.resolve("../?collection=my-collection")).toBe("/florence/datasets?collection=my-collection");
    });

    it("excludes queries when the caller passes in the correct argument", () => {
        setLocation('http://publishing.onsdigital.co.uk/florence/datasets/my-dataset-id?collection=my-collection-id');
        expect(url.resolve("/collections?collection=my-collection-id", true)).toBe("/florence/collections");
    });
});