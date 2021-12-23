"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

const GRAVITY = 1;
const DRAG = 1;

function getTargets(targetArea) {
    const result = [];
    const splittedAxis = targetArea.split('x=')[1].split(', y=');
    result.push(splittedAxis[0].split('..').map(x => parseInt(x, 10)));
    result.push(splittedAxis[1].split('..').map(y => parseInt(y, 10)));

    return result;
}

function isValid(positions) {
    let valid = false;
    if (positions.length > 0) {
        for (let idx = 0; idx < positions.length; ++idx) {
            let x = positions[idx][0];
            let y = positions[idx][1];
            if (x >= target[0][0] && x <= target[0][1] && y >= target[1][0] && y <= target[1][1]) {
                valid = true;
                break;
            }
        }
    }

    return valid;
}

function calculateProjectile(velocity, target) {
    if (velocity[0] < 0) return;
    let x = 0;
    let y = 0;
    let velocityX = velocity[0];
    let velocityY = velocity[1];

    let previousPositions = []
    while (x < target[0][1] && y > target[1][0]) {
        x += velocityX;
        y += velocityY;
        previousPositions.push([x, y]);

        if (velocityX > 0) {
            velocityX = velocityX - DRAG;
        }

        velocityY -= GRAVITY;
    }

    return isValid(previousPositions);
}

function calculateTrickShot(targetArea) {
    const targets = getTargets(targetArea);

    let count = 0;
    for (let idx = 0; idx < 300; ++idx) {
        for (let jdx = -300; jdx < 300; ++jdx) {
            const valid = calculateProjectile([idx, jdx], targets);
            if (valid) ++count;
        }
    }

    return count;
}

function run() {
    const exampleResult = calculateTrickShot(example);
    assert.equal(exampleResult, 112);

    const result = calculateTrickShot(data);
    assert.equal(result, 4433);

    console.log('Answer:', result);
}

run();