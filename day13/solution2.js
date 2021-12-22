"use strict"

const assert = require('assert');

const { data, dataFolds } = require('./data');
const { example, exampleFolds } = require('./example');

const MAX_INT = Number.MAX_SAFE_INTEGER;
const MIN_INT = Number.MIN_SAFE_INTEGER;

function parseCoordinates(coordinates) {
    const result = [];
    for (let idx = 0; idx < coordinates.length; ++idx) {
        const coordinate = coordinates[idx].split(',');
        result.push({ x: parseInt(coordinate[0]), y: parseInt(coordinate[1]) });
    }

    return result;
}

function parseFolds(folds) {
    const result = [];
    for (let idx = 0; idx < folds.length; ++idx) {
        const fold = folds[idx].split(' ')[2].split('=');
        result.push({
            axis: fold[0],
            value: parseInt(fold[1])
        });
    }

    return result;
}

function filterCoordinateDuplicates(arr) {
    return arr.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.x === value.x && t.y === value.y
        ))
    );
}

function printImage(coordinates) {
    let lowX = MAX_INT, highX = MIN_INT, lowY = MAX_INT, highY = MIN_INT;
    for (let idx = 0; idx < coordinates.length; ++idx) {
        const x = coordinates[idx].x;
        const y = coordinates[idx].y;
        lowX = Math.min(lowX, x)
        highX = Math.max(highX, x)
        lowY = Math.min(lowY, y)
        highY = Math.max(highY, y)
    }

    for (let idx = lowY; idx < highY + 1; ++idx) {
        const row = [];
        for (let jdx = 0; jdx < highX - lowX + 1; ++jdx) row.push(' ');

        for (let jdx = lowX; jdx < highX + 1; ++jdx) {
            const foundCoordinate = coordinates.find(p => { return p.x === jdx && p.y === idx });
            if (foundCoordinate) row[jdx] = '#';
        }

        console.log(row.join(''));
    }
}


function calculateOrigami(coordinates, folds) {
    let parsedCoordinates = parseCoordinates(coordinates);
    const parsedFolds = parseFolds(folds);

    for (let idx = 0; idx < folds.length; ++idx) {
        const axis = parsedFolds[idx].axis;
        const value = parsedFolds[idx].value;
        const toRemove = [];
        const toAdd = [];

        for (let jdx = 0; jdx < parsedCoordinates.length; ++jdx) {
            const x = parsedCoordinates[jdx].x;
            const y = parsedCoordinates[jdx].y;
            if ((axis === 'x' && x > value) || (axis === 'y' && y > value)) {
                toRemove.push({ x, y });
                if (axis === 'x') {
                    toAdd.push({ x: 2 * value - x, y });
                } else {
                    toAdd.push({ x, y: 2 * value - y });
                }
            }
        }

        parsedCoordinates = parsedCoordinates.concat(toAdd);
        parsedCoordinates = parsedCoordinates.filter(p => {
            return !toRemove.find(t => {
                return p.x === t.x && p.y === t.y
            })
        });
    }

    parsedCoordinates = filterCoordinateDuplicates(parsedCoordinates);
    printImage(parseCoordinates);

    return parsedCoordinates.length;
}

function run() {
    const exampleResult = calculateOrigami(example, exampleFolds);
    assert.equal(exampleResult, 16);

    const result = calculateOrigami(data, dataFolds);
    assert.equal(result, 103);

    console.log('Answer:', result);
}

run();