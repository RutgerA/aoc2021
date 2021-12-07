"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

const calculated = {}

function calculateFuelSteps(steps) {
    if (steps === 0) return steps;
    if (calculated[steps]) return calculated[steps];

    let totalFuel = 0;
    for (let idx = 0; idx < steps; ++idx, ++totalFuel) {
        totalFuel += idx;
    }

    calculated[steps] = totalFuel;
    return totalFuel;
}

function calculateLowestFuelNeeded(values) {
    let lowest;
    for (let idx = 0; idx < values.length; ++idx) {
        let total = 0;
        for (let jdx = 0; jdx < values.length; ++jdx) {
            total += calculateFuelSteps(Math.abs(values[jdx] - idx));
        }

        if (!lowest || lowest > total) lowest = total;
    }

    return lowest;
}

function run() {
    const exampleResult = calculateLowestFuelNeeded(example);
    assert.equal(exampleResult, 168);

    const result = calculateLowestFuelNeeded(data);
    assert.equal(result, 100347031);

    console.log('Answer:', result);
}

run();