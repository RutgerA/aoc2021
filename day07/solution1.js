"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

function calculateLowestFuelNeeded(values) {
    let lowest;
    for (let idx = 0; idx < values.length; ++idx) {
        let total = 0;
        for (let jdx = 0; jdx < values.length; ++jdx) {
            total += Math.abs(values[jdx] - idx);
        }

        if (!lowest || total < lowest) lowest = total;
    }

    return lowest;
}

function run() {
    const exampleResult = calculateLowestFuelNeeded(example);
    assert.equal(exampleResult, 37);

    const result = calculateLowestFuelNeeded(data);
    assert.equal(result, 356922);

    console.log('Answer:', result);
}

run();