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

function floodFill(area, mask, point) {
    const idx = point.idx;
    const jdx = point.jdx;

    if (idx < 0 || jdx < 0) return;
    if (idx > area.length - 1) return;
    if (jdx > area[idx].length - 1) return;
    if (mask[idx][jdx] === 1) return;
    if (area[idx][jdx] === 9) return;

    mask[idx][jdx] = 1;

    floodFill(area, mask, { idx: idx, jdx: jdx - 1 });
    floodFill(area, mask, { idx: idx, jdx: jdx + 1 });
    floodFill(area, mask, { idx: idx - 1, jdx: jdx });
    floodFill(area, mask, { idx: idx + 1, jdx: jdx });

    return;
}

function calculateLowestPoints(area) {
    const lowestPoints = [];
    for (let idx = 0; idx < area.length; ++idx) {
        const row = area[idx];
        for (let jdx = 0; jdx < row.length; ++jdx) {
            const current = row[jdx];
            const left = jdx - 1 > -1 ? row[jdx - 1] : 9;
            const right = row.length > jdx + 1 ? row[jdx + 1] : 9;
            const up = idx - 1 > -1 ? area[idx - 1][jdx] : 9;
            const down = area.length > idx + 1 ? area[idx + 1][jdx] : 9;

            if (current < left && current < right && current < up && current < down) {
                lowestPoints.push({ idx: idx, jdx: jdx });
            }
        }
    }

    return lowestPoints;
}

function calculateLargestBasins(values) {
    const area = parseAreaValues(values, parseInt);
    const lowestPoints = calculateLowestPoints(area);

    const basins = [];
    for (let idx = 0; idx < lowestPoints.length; ++idx) {
        const mask = parseAreaValues(area, zero);
        const point = lowestPoints[idx];

        floodFill(area, mask, point);

        basins.push(calculateMask(mask));
    }

    const sortedBasins = basins.sort(function (a, b) { return a - b; });
    const topThreeLargest = sortedBasins.slice(sortedBasins.length - 3);

    return topThreeLargest.reduce(function (a, b) { return a * b });
}

function run() {
    const exampleResult = calculateLargestBasins(example);
    assert.equal(exampleResult, 1134);

    const result = calculateLargestBasins(data);
    assert.equal(result, 1076922);

    console.log('Answer:', result);
}

run();