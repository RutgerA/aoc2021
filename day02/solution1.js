"use strict"

const assert = require('assert');

const { data } = require('./data.json');
const { example } = require('./example.json');

function dive(steps) {
    let horizontal = 0;
    let depth = 0;

    for (let idx = 0; idx < steps.length; ++idx) {
        const splittedValue = steps[idx].split(' ');
        const direction = splittedValue[0];
        const value = parseInt(splittedValue[1]);

        if (direction === "forward") {
            horizontal += value;
        } else if (direction === "down") {
            depth += value;
        } else {
            depth -= value;
        }
    }

    return horizontal * depth;
}

function run() {
    const exampleResult = dive(example);
    assert.equal(exampleResult, 150);

    const result = dive(data);
    assert.equal(result, 2039912);

    console.log('Answer:', result);
}

run();