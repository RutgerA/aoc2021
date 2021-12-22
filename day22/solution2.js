"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

const AXIS = ['x', 'y', 'z'];

function lowToHigh(a, b) {
    return a - b;
}

function parseDimensions(step, range) {
    const dimensions = []
    const splittedComma = range.split(',');

    let key;
    for (let idx = 0; idx < splittedComma.length; ++idx) {
        const parsedRange = splittedComma[idx].split('=')[1].split('..');
        key = AXIS[idx] + 0;
        step[key] = parseInt(parsedRange[0]);
        key = AXIS[idx] + 1;
        step[key] = parseInt(parsedRange[1]);
    }

    return dimensions;
}

function getBoundaries(steps) {
    const [boundaryX, boundaryY, boundaryZ] = [[], [], []];
    for (const { operation, x0, x1, y0, y1, z0, z1 } of steps) {
        boundaryX.push(x0);
        boundaryX.push(x1 + 1);
        boundaryY.push(y0);
        boundaryY.push(y1 + 1);
        boundaryZ.push(z0);
        boundaryZ.push(z1 + 1);
    }
    boundaryX.sort(lowToHigh);
    boundaryY.sort(lowToHigh);
    boundaryZ.sort(lowToHigh);

    return [boundaryX, boundaryY, boundaryZ];
}

function calculateActiveCuboids(steps, activeCuboids, boundaries, yFactor, zFactor) {
    const [boundaryX, boundaryY, boundaryZ] = boundaries;
    for (let { operation, x0, x1, y0, y1, z0, z1 } of steps) {
        x0 = boundaryX.findIndex(idx => { return idx === x0; });
        x1 = boundaryX.findIndex(idx => { return idx === x1 + 1; });
        y0 = boundaryY.findIndex(idx => { return idx === y0; });
        y1 = boundaryY.findIndex(idx => { return idx === y1 + 1; });
        z0 = boundaryZ.findIndex(idx => { return idx === z0; });
        z1 = boundaryZ.findIndex(idx => { return idx === z1 + 1; });
        for (let idx = x0; idx < x1; ++idx) {
            for (let jdx = y0; jdx < y1; ++jdx) {
                for (let kdx = z0; kdx < z1; ++kdx) {
                    if (operation === "on") activeCuboids[kdx * zFactor + jdx * yFactor + idx] = true;
                    else activeCuboids[kdx * zFactor + jdx * yFactor + idx] = false;
                }
            }
        }
    }

    return activeCuboids;
}

function calculateTotal(activeCuboids, boundaries, yFactor, zFactor) {
    const [boundaryX, boundaryY, boundaryZ] = boundaries;
    const xLength = boundaryX.length;
    const yLength = boundaryY.length;
    const zLength = boundaryZ.length;

    let total = 0;
    for (let idx = 0; idx < xLength; ++idx) {
        let x0 = boundaryX[idx];
        let x1 = boundaryX[idx + 1];
        for (let jdx = 0; jdx < yLength; ++jdx) {
            let y0 = boundaryY[jdx];
            let y1 = boundaryY[jdx + 1];
            for (let kdx = 0; kdx < zLength; ++kdx) {
                if (activeCuboids[kdx * zFactor + jdx * yFactor + idx]) {
                    let z0 = boundaryZ[kdx];
                    let z1 = boundaryZ[kdx + 1];
                    let area = (x1 - x0) * (y1 - y0) * (z1 - z0);
                    total += area;
                }
            }
        }
    }

    return total;
}

function calculateCubeBorders(steps) {
    const boundaries = getBoundaries(steps);

    const [boundaryX, boundaryY, boundaryZ] = boundaries;
    const xLength = boundaryX.length;
    const yLength = boundaryY.length;
    const zLength = boundaryZ.length;

    const reactorSpace = new Int8Array(xLength * yLength * zLength);
    let yFactor = xLength;
    let zFactor = xLength * yLength;
    const activeCuboids = calculateActiveCuboids(steps, reactorSpace, boundaries, yFactor, zFactor);

    return calculateTotal(activeCuboids, boundaries, yFactor, zFactor);
}

function calculateCubes(steps) {
    const parsedSteps = [];
    for (let idx = 0; idx < steps.length; ++idx) {
        const splittedLine = steps[idx].split(' ');
        const operation = splittedLine[0];
        const parsedStep = { operation };
        parseDimensions(parsedStep, splittedLine[1]);
        parsedSteps.push(parsedStep);
    }

    return calculateCubeBorders(parsedSteps);
}

function run() {
    const exampleResult = calculateCubes(example);
    assert.equal(exampleResult, 39769202357779);

    const result = calculateCubes(data);
    assert.equal(result, 1304385553084863);

    console.log('Answer:', result);
}

run();