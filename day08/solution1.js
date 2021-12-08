"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

function calculateDigits(values) {
    let counter = 0;
    const secondParts = values.map(value => { return value.split(' | ')[1].split(' ') });

    for (let idx = 0; idx < secondParts.length; ++idx) {
        const rightSide = secondParts[idx];
        for (let jdx = 0; jdx < rightSide.length; ++jdx) {
            const length = rightSide[jdx].length;
            if ([2, 3, 4, 7].includes(length)) {
                ++counter;
            }
        }
    }

    return counter;
}

function run() {
    const exampleResult = calculateDigits(example);
    assert.equal(exampleResult, 26);

    const result = calculateDigits(data);
    assert.equal(result, 525);

    console.log('Answer:', result);
}

run();