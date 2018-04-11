'use strict';

/**
 * This is a temporary fix until the next version of react-handsontable updates to version 0.35+ of handsontable.
 * It replicates the changes here: https://github.com/handsontable/handsontable/pull/4337
 */
const replace = require('replace-in-file');

const options = {
    files: [
        'node_modules/react-handsontable/**/*.js',
    ],
    from: [/^\s\.table /gm, /\\n\.table /gm, /\, \.table /g],
    to: ['.handsontable .table ', '\\n.handsontable .table ', ', .handsontable .table '],
};

console.log("Temporary fix until the next version of react-handsontable updates to version 0.35+ of handsontable");
console.log("It replicates the changes here: https://github.com/handsontable/handsontable/pull/4337");
try {
    const changes = replace.sync(options);
    console.log('Modified files:', changes.join(', '));
}
catch (error) {
    console.error('Error occurred:', error);
}
