window.fetch = require('jest-fetch-mock');

// Mock the Date object and allows us to use Date.now() and get a consistent date back
const mockedCurrentDate = new Date("2017-10-06T13:45:28.975Z");
require('jest-mock-now')(mockedCurrentDate);