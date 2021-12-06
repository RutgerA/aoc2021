"use strict"

const assert = require('assert');

const { data } = require('./data.json');
const { example } = require('./example.json');

function sonarSweep(report) {
    const length = report.length;

    let count = 0;
    let prevNumber = report[0] + report[1] + report[2];
    for (let idx = 3; idx < length; ++idx) {
        const nextNumber = (prevNumber - report[idx - 3]) + report[idx];

        if (prevNumber < nextNumber) ++count;
        prevNumber = nextNumber;
    }

    return count;
}


function run() {
    const exampleResult = sonarSweep(example);
    assert.equal(exampleResult, 5);

    const result = sonarSweep(data);
    assert.equal(result, 1781);

    console.log('Answer:', result);
}

run();