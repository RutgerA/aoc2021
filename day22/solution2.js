"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

function getRange(range) {
    const parsedRange = range.split('=')[1].split('..');
    return {
        start: parseInt(parsedRange[0]),
        end: parseInt(parsedRange[1])
    }
}

// function removeCubes(cubes, rangeX, rangeY, rangeZ) {
//     // if (rangeX.start < -50 || rangeX.end > 50) return;

//     for (let x = rangeX.start; x < rangeX.end + 1; ++x) {
//         for (let y = rangeY.start; y < rangeY.end + 1; ++y) {
//             for (let z = rangeZ.start; z < rangeZ.end + 1; ++z) {
//                 const key = x + ',' + y + ',' + z
//                 delete cubes[key];
//             }
//         }
//     }
// }

// function addCubes(cubes, rangeX, rangeY, rangeZ) {
//     // if (rangeX.start < -50 || rangeX.end > 50) return;

//     for (let x = rangeX.start; x < rangeX.end + 1; ++x) {
//         for (let y = rangeY.start; y < rangeY.end + 1; ++y) {
//             for (let z = rangeZ.start; z < rangeZ.end + 1; ++z) {
//                 const key = x + ',' + y + ',' + z
//                 cubes[key] = true;
//             }
//         }
//     }
// }

function calculateCubes(steps) {
    let cubes = {};
    for (let idx = 0; idx < steps.length; ++idx) {
        // const splittedLine = steps[idx].split(' ');
        // const operation = splittedLine[0];
        // const splittedComma = splittedLine[1].split(',');
        // const rangeX = getRange(splittedComma[0]);
        // const rangeY = getRange(splittedComma[1]);
        // const rangeZ = getRange(splittedComma[2]);

        // if (operation === 'on') {
        //     addCubes(cubes, rangeX, rangeY, rangeZ);
        // } else {
        //     removeCubes(cubes, rangeX, rangeY, rangeZ);
        // }

        // console.log('step index', idx);
    }

    return Object.keys(cubes).length;
}

function run() {
    const exampleResult = calculateCubes(example);
    assert.equal(exampleResult, 2758514936282235);

    // const result = calculateCubes(data);
    // assert.equal(result, 537042);

    // console.log('Answer:', result);
}

run();