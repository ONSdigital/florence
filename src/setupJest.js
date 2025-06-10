// Add Node functions not present in window environment
const { TextDecoder, TextEncoder, ReadableStream, MessagePort } = require("util")

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
  MessagePort: { value: MessagePort },
})

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

// Mock out getEnv
Object.defineProperty(window, 'getEnv', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
        apiRouterVersion: "v1",
    })),
});
