"use strict"

const assert = require('assert');

const { data } = require('./data.json');
const { example } = require('./example.json');

function flipBits(str) {
    return str.split('').map(b => (1 - b).toString()).join('');
}

function diagnose(report) {
    const length = report.length;
    const binaryLength = report[0].length;
    let highestBinary = "";

    for (let idx = 0; idx < binaryLength; ++idx) {
        let zeros = 0;

        for (let jdx = 0; jdx < length; ++jdx) {
            if (report[jdx][idx] === "0") ++zeros;
        }

        highestBinary += length - zeros > zeros ? "0" : "1";
    }

    return parseInt(highestBinary, 2) * parseInt(flipBits(highestBinary), 2);
}

function run() {
    const exampleResult = diagnose(example);
    assert.equal(exampleResult, 198);

    const result = diagnose(data);
    assert.equal(result, 3882564);

    console.log('Answer:', result);
}

run();