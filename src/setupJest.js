import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

window.fetch = require('jest-fetch-mock');
import "regenerator-runtime/runtime";

// Mock the Date object and allows us to use Date.now() and get a consistent date back
const mockedCurrentDate = new Date("2017-10-06T13:45:28.975Z");
require('jest-mock-now')(mockedCurrentDate);

// Mock document functions (specifically for the CollectionsController component)
const mockedGetElement = () => ({
    getBoundingClientRect: () => ({
        top: 0
    }),
    scrollTop: 0,
    scrollIntoView: () => { }
});
Object.defineProperty(document, 'getElementById', {
    value: mockedGetElement,
});

Object.defineProperty(window, 'getEnv', {
    writable: true,
    value: jest.fn().mockImplementation(() => { }),
});
