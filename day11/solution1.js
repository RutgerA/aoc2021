"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

const TOTAL_STEPS = 100;

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

function flash(idx, jdx, octopuses, flashed) {
    if (idx < 0 || jdx < 0) return;
    if (idx > octopuses.length - 1) return;
    if (jdx > octopuses[idx].length - 1) return;

    if (!flashed[idx][jdx]) {
        ++octopuses[idx][jdx];
    }

    if (octopuses[idx][jdx] === 10) {
        ++totalFlashes;
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

function octoflash(octopuses) {
    const flashed = parseAreaValues(octopuses, zero);

    for (let idx = 0; idx < octopuses.length; ++idx) {
        const octoRow = octopuses[idx];
        for (let jdx = 0; jdx < octoRow.length; ++jdx) {
            flash(idx, jdx, octopuses, flashed);
        }
    }
}

let totalFlashes;
function calculateOctopusFlashes(values) {
    totalFlashes = 0;
    const octopuses = parseAreaValues(values, parseInt);

    for (let idx = 0; idx < TOTAL_STEPS; ++idx) {
        octoflash(octopuses);
    }

    return totalFlashes;
}

function run() {
    const exampleResult = calculateOctopusFlashes(example);
    assert.equal(exampleResult, 1656);

    const result = calculateOctopusFlashes(data);
    assert.equal(result, 1729);

    console.log('Answer:', result);
}

run();