"use strict"

const assert = require('assert');

const { data } = require('./data.json');
const { example } = require('./example.json');

function sonarSweep(report) {
    let prevNumber;
    let count = 0;
    for (let idx = 0; idx < report.length; ++idx) {
        if (prevNumber && prevNumber < report[idx]) {
            ++count;
        }

        prevNumber = report[idx];
    }

    return count;
}

function run() {
    const exampleResult = sonarSweep(example);
    assert.equal(exampleResult, 7);

    const result = sonarSweep(data);
    assert.equal(result, 1752);

    console.log('Answer:', result);
}

run();