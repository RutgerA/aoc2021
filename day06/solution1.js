"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

const TOTAL_DAYS = 80;

function calculateLanternfish(fishes) {
    for (let idx = 0; idx < TOTAL_DAYS; ++idx) {
        for (let jdx = 0; jdx < fishes.length; ++jdx) {
            const lifespan = fishes[jdx];
            --fishes[jdx];

            if (lifespan === 0) {
                fishes[jdx] = 6;
                fishes.push(9);
            }
        }
    }

    return fishes.length;
}

function run() {
    const exampleResult = calculateLanternfish(example);
    assert.equal(exampleResult, 5934);

    const result = calculateLanternfish(data);
    assert.equal(result, 352151);

    console.log('Answer:', result);
}

run();