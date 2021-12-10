"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

const beginTags = "([{<";
const endTags = ")]}>";

const tagMapping = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">"
}

const scoreMapping = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
}

function addTotal(total, tag) {
    total *= 5;
    total += scoreMapping[tag];
    return total;
}

function calculateClosingTags(line) {
    const levels = [];

    for (let idx = 0; idx < line.length; ++idx) {
        const current = line[idx];
        if (beginTags.includes(current)) {
            levels.push(current);
        } else if (endTags.includes(current)) {
            levels.pop();
        }
    }
    levels.reverse();

    return levels.map(tag => { return tagMapping[tag]; });
}

function calculateSyntaxMiddleScore(values) {
    const subTotals = [];
    for (let idx = 0; idx < values.length; ++idx) {
        let subTotal = 0;
        const closingTags = calculateClosingTags(values[idx]);

        for (let jdx = 0; jdx < closingTags.length; ++jdx) {
            subTotal = addTotal(subTotal, closingTags[jdx]);
        }

        subTotals.push(subTotal);
    }

    const sortedTotals = subTotals.sort(function (a, b) { return a - b; });
    return sortedTotals[Math.ceil(sortedTotals.length / 2)];
}

function run() {
    const exampleResult = calculateSyntaxMiddleScore(example);
    assert.equal(exampleResult, 288957);

    const result = calculateSyntaxMiddleScore(data);
    assert.equal(result, 2412013412);

    console.log('Answer:', result);
}

run();