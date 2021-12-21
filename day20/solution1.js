"use strict"

const assert = require('assert');

const { input, data } = require('./data');
const { exampleInput, example } = require('./example');

const pixelMapping = {
    '.': '0',
    '#': '1'
}

const TOTAL_STEPS = 2;

function calculateTotal(image) {
    const totalString = image.reduce(function (a, b) { return a.concat(b) });
    let total = 0;
    for (let idx = 0; idx < totalString.length; ++idx) {
        if (totalString[idx] === '1') ++total;
    }

    return total
}

function convertAlgorithm(algorithm) {
    const result = []
    for (let idx = 0; idx < algorithm.length; ++idx) {
        result.push(pixelMapping[algorithm[idx]]);
    }

    return result;
}

function convertImage(image, steps) {
    const result = [];
    const stepValue = '0';

    for (let idx = 0; idx < steps; ++idx)
        result.push(new Array(image[0].length + (steps * 2)).fill(stepValue).join(''));

    for (let idx = 0; idx < image.length; ++idx) {
        let row = '';
        for (let jdx = 0; jdx < steps; ++jdx) {
            row += stepValue;
        }

        for (let jdx = 0; jdx < image[idx].length; ++jdx) {
            row += pixelMapping[image[idx][jdx]];
        }

        for (let jdx = 0; jdx < steps; ++jdx) {
            row += stepValue;
        }
        result.push(row);
    }

    for (let idx = 0; idx < steps; ++idx)
        result.push(new Array(image[0].length + (steps * 2)).fill(stepValue).join(''));

    return result;
}

// function printImage(image) {
//     for (let idx = 0; idx < image.length; ++idx) {
//         console.log(image[idx]);
//     }
// }

function determineValue(idx, jdx, image, step) {
    const returnValue = step % 2 == 0 ? '0' : '1'
    if (idx < 0 || jdx < 0) return returnValue;
    if (idx > image.length - 1) return returnValue;
    if (jdx > image[idx].length - 1) return returnValue;

    return null;
}

function calculatePixel(idx, jdx, image, step) {
    const locations = [
        { i: idx - 1, j: jdx - 1 },
        { i: idx - 1, j: jdx },
        { i: idx - 1, j: jdx + 1 },
        { i: idx, j: jdx - 1 },
        { i: idx, j: jdx },
        { i: idx, j: jdx + 1 },
        { i: idx + 1, j: jdx - 1 },
        { i: idx + 1, j: jdx },
        { i: idx + 1, j: jdx + 1 }
    ]

    let code = '';
    for (let kdx = 0; kdx < locations.length; ++kdx) {
        const location = locations[kdx];
        const dValue = determineValue(location.i, location.j, image, step);
        if (dValue) {
            code += dValue;
        } else {
            code += image[location.i][location.j];
        }
    }

    return code;
}

function calculateTrenchMapStep(image, algorithm, step) {
    const result = [];

    for (let idx = 0; idx < image.length; ++idx) {
        let row = '';
        for (let jdx = 0; jdx < image[idx].length; ++jdx) {
            const res = calculatePixel(idx, jdx, image, step);
            row += algorithm[parseInt(res, 2)];
        }

        result.push(row);
    }

    return result;
}

function calculateTrenchMapDefault(imageEnhancementAlgorithm, inputImage) {
    const algorithm = convertAlgorithm(imageEnhancementAlgorithm);

    let newImage = convertImage(inputImage, TOTAL_STEPS);
    for (let kdx = 0; kdx < TOTAL_STEPS; ++kdx) {
        newImage = calculateTrenchMapStep(newImage, algorithm, 0);
    }

    return calculateTotal(newImage);
}

function calculateTrenchMap(imageEnhancementAlgorithm, inputImage) {
    const algorithm = convertAlgorithm(imageEnhancementAlgorithm);

    let newImage = convertImage(inputImage, TOTAL_STEPS);
    for (let kdx = 0; kdx < TOTAL_STEPS; ++kdx) {
        newImage = calculateTrenchMapStep(newImage, algorithm, kdx);
    }

    return calculateTotal(newImage);
}

function run() {
    const exampleResult = calculateTrenchMapDefault(exampleInput, example);
    assert.equal(exampleResult, 35);

    const result = calculateTrenchMap(input, data);
    assert.equal(result, 5349);

    console.log('Answer:', result);
}

run();