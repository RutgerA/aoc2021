"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

function sortString(str) {
    return str.split('').sort().join('');
}

function splitAndSort(idx, value) {
    const items = value.split(' | ')[idx].split(' ');
    return items.map(sortString);
}

function remove(leftString, rightString) {
    if (!rightString) return -1;

    for (let idx = 0; idx < rightString.length; ++idx) {
        leftString = leftString.replace(rightString[idx], '');
    }

    return leftString.length;
}

function findDigit(sortedString, discovered) {
    const stringLength = sortedString.length;
    if (stringLength === 7) discovered[8] = sortedString;
    else if (stringLength === 6) {
        const removedFour = remove(sortedString, discovered[4]);
        if (removedFour === 2) return discovered[9] = sortedString;

        const removedSeven = remove(sortedString, discovered[7]);
        if (removedSeven === 3) return discovered[0] = sortedString;
        else if (removedSeven === 4) return discovered[6] = sortedString;
    } else if (stringLength === 5) {
        const removedOne = remove(sortedString, discovered[1]);
        if (removedOne === 3) return discovered[3] = sortedString;

        const removedFour = remove(sortedString, discovered[4]);
        if (removedFour === 2) return discovered[5] = sortedString;
        else if (removedFour === 3) return discovered[2] = sortedString;
    }
    else if (stringLength === 4) discovered[4] = sortedString;
    else if (stringLength === 3) discovered[7] = sortedString;
    else if (stringLength === 2) discovered[1] = sortedString;
}

function getDigitsMapping(signals) {
    const mappingByDigit = {};
    while (Object.keys(mappingByDigit).length !== 10) {
        for (let jdx = 0; jdx < signals.length; ++jdx) {
            findDigit(signals[jdx], mappingByDigit);
        }
    }

    const mappingBySignal = {};
    Object.values(mappingByDigit).forEach((val, idx) => {
        mappingBySignal[val] = idx;
    });

    return mappingBySignal;
}

function calculateDigits(values) {
    const signals = values.map(value => { return splitAndSort(0, value); });
    const outputs = values.map(value => { return splitAndSort(1, value); });

    let total = 0;
    for (let idx = 0; idx < signals.length; ++idx) {
        const mapping = getDigitsMapping(signals[idx]);

        const output = outputs[idx];
        const parsedNumbers = [];
        for (let jdx = 0; jdx < output.length; ++jdx) {
            parsedNumbers[jdx] = mapping[output[jdx]];
        }

        total += parseInt(parsedNumbers.join(''));
    }
    return total;
}

function run() {
    const exampleResult = calculateDigits(example);
    assert.equal(exampleResult, 61229);

    const result = calculateDigits(data);
    assert.equal(result, 1083859);

    console.log('Answer:', result);
}

run();