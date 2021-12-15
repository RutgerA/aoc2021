"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

function zero() {
    return 0;
}

function parseAreaValues(values, method) {
    const result = [];
    for (let idx = 0; idx < values.length; ++idx) {
        const row = values[idx];
        result[idx] = [];
        for (let jdx = 0; jdx < row.length; ++jdx) {
            result[idx][jdx] = method(row[jdx]);
        }
    }

    return result;
}

function calculateMask(mask) {
    return mask.reduce(function (a, b) { return a.concat(b) })
        .reduce(function (a, b) { return a + b });
}

function flash(idx, jdx, octopuses, flashed) {
    if (idx < 0 || jdx < 0) return;
    if (idx > octopuses.length - 1) return;
    if (jdx > octopuses[idx].length - 1) return;

    if (!flashed[idx][jdx]) {
        ++octopuses[idx][jdx];
    }

    if (octopuses[idx][jdx] === 10) {
        octopuses[idx][jdx] = 0;
        flashed[idx][jdx] = 1;

        flash(idx, jdx + 1, octopuses, flashed);
        flash(idx, jdx - 1, octopuses, flashed);
        flash(idx + 1, jdx, octopuses, flashed);
        flash(idx - 1, jdx, octopuses, flashed);
        flash(idx + 1, jdx + 1, octopuses, flashed);
        flash(idx + 1, jdx - 1, octopuses, flashed);
        flash(idx - 1, jdx + 1, octopuses, flashed);
        flash(idx - 1, jdx - 1, octopuses, flashed);
    }
}

function octoflash(octopuses, flashed) {
    for (let idx = 0; idx < octopuses.length; ++idx) {
        const octoRow = octopuses[idx];
        for (let jdx = 0; jdx < octoRow.length; ++jdx) {
            flash(idx, jdx, octopuses, flashed);
        }
    }
}

function calculateOctopusFlashes(values) {
    const octopuses = parseAreaValues(values, parseInt);

    let step = 0;
    while (true) {
        ++step;
        const flashed = parseAreaValues(octopuses, zero);
        octoflash(octopuses, flashed);

        if (calculateMask(flashed) === 100) break;
    }

    return step;
}

function run() {
    const exampleResult = calculateOctopusFlashes(example);
    assert.equal(exampleResult, 195);

    const result = calculateOctopusFlashes(data);
    assert.equal(result, 237);

    console.log('Answer:', result);
}

run();