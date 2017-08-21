# ONS pattern library

A tile design friendly pattern library with a simple responsive grid inspired by BBC’s GEL consisting of 16px columns.

Use the [pattern library's site][site] to see examples of how to use it.

## How to install and run

1. Clone this repo onto your machine.
2. Install [Node][node] and [NPM][npm].
3. Run `npm install` from the root of the repo you've cloned onto your machine.
4. Use the JS and CSS files in the `dist` directory.

Optional (for local development):
* Either run `npm run dev` or `run.sh` in the root of the project. This boots up an npm watch command that'll re-build your JS, CSS on change and host it at localhost:9000/dist/folder/file.
* New JS files go into the `js` directory and the path added into the config object in the package.json. You'll need to restart `npm run dev` if you edit the package.json for the watch to detect them.
* New SCSS files should be added to the `scss` directory. Add the path into `main.scss` and `old-ie.scss`. 

[site]: <https://onsdigital.github.io/ons-pattern-library-starter/>
[node]: <https://nodejs.org/en/>
[npm]: <https://www.npmjs.com/>
