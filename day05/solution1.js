"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

function calculateMultipleMarkedLocations(areas) {
    const doubleArray = [];
    for (let idx = 0; idx < areas.length; ++idx) {
        doubleArray.push(areas[idx].split(' -> '));
    }

    const markedLocations = {};
    for (let idx = 0; idx < doubleArray.length; ++idx) {
        const leftSide = doubleArray[idx][0].split(',');
        const rightSide = doubleArray[idx][1].split(',');

        const x0 = parseInt(leftSide[0]);
        const x1 = parseInt(rightSide[0]);
        const y0 = parseInt(leftSide[1]);
        const y1 = parseInt(rightSide[1]);

        if (x0 !== x1 && y0 !== y1) continue;

        if (x0 !== x1) {
            const minX = Math.min(x0, x1);
            const maxX = Math.max(x0, x1);
            const length = maxX - minX;
            for (let jdx = 0; jdx < length + 1; ++jdx) {
                const location = (minX + jdx) + ',' + y0;
                markedLocations[location] = markedLocations[location] ? ++markedLocations[location] : 1;
            }
        } else {
            const minY = Math.min(y0, y1);
            const maxY = Math.max(y0, y1);
            const length = maxY - minY;
            for (let jdx = 0; jdx < length + 1; ++jdx) {
                const location = x0 + ',' + (minY + jdx);
                markedLocations[location] = markedLocations[location] ? ++markedLocations[location] : 1;
            }
        }
    }

    const objectKeys = Object.keys(markedLocations);
    let counter = 0;
    for (let idx = 0; idx < objectKeys.length; ++idx) {
        const key = objectKeys[idx];
        if (markedLocations[key] > 1) ++counter;
    }

    return counter;
}

function run() {
    const exampleResult = calculateMultipleMarkedLocations(example);
    assert.equal(exampleResult, 5);

    const result = calculateMultipleMarkedLocations(data);
    assert.equal(result, 4421);

    console.log('Answer:', result);
}

run();