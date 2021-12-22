"use strict"

const assert = require('assert');

const { template, data } = require('./data');
const { exampleTemplate, example } = require('./example');

let calculatedResults;
let mutations;

function mergeObjects(obj1, obj2) {
    for (const [key, value] of Object.entries(obj2)) {
        obj1[key] = obj1[key] ? obj1[key] + value : value;
    }

    return obj1;
}

function insertPair(pair, currentStep) {
    if (currentStep === 0) return {};

    const found = calculatedResults.find(s => { return s.pair === pair && s.currentStep === currentStep });
    if (found) return found.result;

    for (let idx = 0; idx < mutations.length; ++idx) {
        const mutation = mutations[idx];
        if (mutation.from === pair) {
            let result = {};
            result[mutation.into] = 1;
            const leftSide = insertPair(mutation.from[0] + mutation.into, currentStep - 1);
            const rightSide = insertPair(mutation.into + mutation.from[1], currentStep - 1);
            result = mergeObjects(result, leftSide);
            result = mergeObjects(result, rightSide);

            calculatedResults.push({ pair, currentStep, result });
            return result
        }
    }
}

function getCharacterCount(input) {
    const result = {};
    for (let idx = 0; idx < input.length; ++idx) {
        result[input[idx]] = result[input[idx]] ? ++result[input[idx]] : 1;
    }

    return result;
}

function convertInsertionPairs(insertionPairs) {
    const result = [];
    for (let idx = 0; idx < insertionPairs.length; ++idx) {
        const pair = insertionPairs[idx].split(' ');
        result.push({
            from: pair[0],
            into: pair[2]
        });
    }

    return result;
}

function calculatePolymer(polymerTemplate, insertionPairs, depth) {
    let letterCount = getCharacterCount(polymerTemplate);
    calculatedResults = [];
    mutations = convertInsertionPairs(insertionPairs);

    for (let idx = 1; idx < polymerTemplate.length; ++idx) {
        const step = insertPair(polymerTemplate[idx - 1] + polymerTemplate[idx], depth);
        letterCount = mergeObjects(letterCount, step);
    }

    const countArray = Object.values(letterCount).sort(function (a, b) { return a - b });

    return countArray[countArray.length - 1] - countArray[0];
}

function run() {
    const totalSteps = 10;

    const exampleResult = calculatePolymer(exampleTemplate, example, totalSteps);
    assert.equal(exampleResult, 1588);

    const result = calculatePolymer(template, data, totalSteps);
    assert.equal(result, 3831);

    console.log('Answer:', result);
}

run();