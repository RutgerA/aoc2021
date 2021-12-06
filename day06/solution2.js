"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

const TOTAL_DAYS = 256;

function calculateLanternfish(fishes) {
    const pool = new Array(9).fill(0);

    for (let idx = 0; idx < fishes.length; ++idx) {
        const lifespan = fishes[idx];
        ++pool[lifespan];
    }

    for (let idx = 0; idx < TOTAL_DAYS; ++idx) {
        const firstRow = pool[0];
        for (let jdx = 0; jdx < pool.length - 1; ++jdx) {
            pool[jdx] = pool[jdx + 1];
        }

        pool[6] += firstRow;
        pool[8] = firstRow;
    }

    return pool.reduce((a, b) => a + b, 0);
}

function run() {
    const exampleResult = calculateLanternfish(example);
    assert.equal(exampleResult, 26984457539);

    const result = calculateLanternfish(data);
    assert.equal(result, 1601616884019);

    console.log('Answer:', result);
}

run();