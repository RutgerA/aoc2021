"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

const scoreMapping = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
}

const tagMapping = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">"
}

function calculateSyntaxScoring(line) {
    const levels = [];
    let levelIdx = 0;
    for (let idx = 0; idx < line.length; ++idx) {
        const current = line[idx];
        if (tagMapping[current]) {
            levels[levelIdx++] = current;
        } else {
            const thisLevel = levels[--levelIdx];

            if (tagMapping[thisLevel] === current) continue;
            return current;
        }
    }
}

function calculateSyntaxLines(values) {
    let total = 0;
    for (let idx = 0; idx < values.length; ++idx) {
        const foundItem = calculateSyntaxScoring(values[idx]);
        if (!foundItem) continue;

        total += scoreMapping[foundItem];
    }

    return total;
}

function run() {
    const exampleResult = calculateSyntaxLines(example);
    assert.equal(exampleResult, 26397);

    const result = calculateSyntaxLines(data);
    assert.equal(result, 339537);

    console.log('Answer:', result);
}

run();