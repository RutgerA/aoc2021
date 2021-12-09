"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

function parseAreaValues(values) {
    const result = [];
    for (let idx = 0; idx < values.length; ++idx) {
        const row = values[idx];
        result[idx] = [];
        for (let jdx = 0; jdx < row.length; ++jdx) {
            result[idx][jdx] = parseInt(row[jdx]);
        }
    }

    return result;
}

function calculateLowPoints(values) {
    const area = parseAreaValues(values);

    let total = 0;
    for (let idx = 0; idx < area.length; ++idx) {
        const row = area[idx];
        for (let jdx = 0; jdx < row.length; ++jdx) {
            const current = row[jdx];
            const left = jdx - 1 > -1 ? row[jdx - 1] : 9;
            const right = row.length > jdx + 1 ? row[jdx + 1] : 9;
            const up = idx - 1 > -1 ? area[idx - 1][jdx] : 10;
            const down = area.length > idx + 1 ? area[idx + 1][jdx] : 9;

            if (current < left && current < right && current < up && current < down) {
                total += current + 1;
            }
        }
    }

    return total;
}

function run() {
    const exampleResult = calculateLowPoints(example);
    assert.equal(exampleResult, 15);

    const result = calculateLowPoints(data);
    assert.equal(result, 562);

    console.log('Answer:', result);
}

run();