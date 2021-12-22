"use strict"

const assert = require('assert');

const { data, dataFolds } = require('./data');
const { example, exampleFolds } = require('./example');


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


function calculateOrigami(coordinates, folds) {
    let parsedCoordinates = parseCoordinates(coordinates);
    const parsedFolds = parseFolds(folds);

    for (let idx = 0; idx < 1; ++idx) {
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

    parsedCoordinates = parsedCoordinates.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.x === value.x && t.y === value.y
        ))
    )


    return parsedCoordinates.length;
}

function run() {
    const exampleResult = calculateOrigami(example, exampleFolds);
    assert.equal(exampleResult, 17);

    const result = calculateOrigami(data, dataFolds);
    assert.equal(result, 763);

    console.log('Answer:', result);
}

run();