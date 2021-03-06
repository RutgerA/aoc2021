"use strict"

const assert = require('assert');

const { data } = require('./data.json');
const { example } = require('./example.json');

function filterArray(dataSet, type, maxIndex, idx = 0) {
    if (dataSet.length === 1) return dataSet[0];
    if (idx >= maxIndex) return '';

    const zerosArray = [];
    const onesArray = [];
    for (let jdx = 0; jdx < dataSet.length; ++jdx) {
        if (dataSet[jdx][idx] === "0") {
            zerosArray.push(dataSet[jdx]);
        } else {
            onesArray.push(dataSet[jdx]);
        }
    }

    let filteredArray;
    if (type === "maxOne") {
        filteredArray = onesArray.length >= zerosArray.length ? onesArray : zerosArray
    } else {
        filteredArray = onesArray.length < zerosArray.length ? onesArray : zerosArray
    }

    return filterArray(filteredArray, type, maxIndex, ++idx);
}

function diagnose(report) {
    const binaryLength = report[0].length;
    const oxygen = filterArray(report, "maxOne", binaryLength);
    const co2Scrubber = filterArray(report, "minZero", binaryLength);

    //console.log("Oxygen:       %d \nCO2 Scrubber: %d", parseInt(oxygen, 2), parseInt(co2Scrubber, 2));
    return parseInt(oxygen, 2) * parseInt(co2Scrubber, 2);
}

function run() {
    const exampleResult = diagnose(example);
    assert.equal(exampleResult, 230);

    const result = diagnose(data);
    assert.equal(result, 3385170);

    console.log('Answer:', result);
}

run();