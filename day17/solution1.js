"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

const GRAVITY = 1;
const DRAG = 1;
const MAX_VELOCITY = 300;

function getTargets(targetArea) {
    const result = [];
    const splittedAxis = targetArea.split('x=')[1].split(', y=');
    result.push(splittedAxis[0].split('..').map(x => parseInt(x, 10)));
    result.push(splittedAxis[1].split('..').map(y => parseInt(y, 10)));

    return result;
}

function findOptimalXVelocity(target) {
    let optimalVelocity = 0;
    let found = false;
    while (!found) {
        ++optimalVelocity;

        let idx = 0;
        let velocity = optimalVelocity;
        while (velocity != 0) {
            idx += velocity;
            velocity -= DRAG;
        }

        if (idx >= target[0] && idx <= target[1]) {
            found = true;
        }
    }

    return optimalVelocity;
}

function findOptimalYVelocity(target) {
    let currentVelocity = MAX_VELOCITY;
    let found = false;
    while (!found && currentVelocity > 1) {
        --currentVelocity;

        let idx = 0;
        let velocity = currentVelocity;
        while (idx > target[1]) {
            idx += velocity;
            velocity -= GRAVITY;
        }

        if (idx >= target[0] && idx <= target[1]) {
            found = true;
        }
    }

    return currentVelocity;
}

function getVelocities(targetX, targetY) {
    return [findOptimalXVelocity(targetX), findOptimalYVelocity(targetY)];
}

function calculateHighest(highest, position) {
    if (position[1] > highest) return position[1];
    return highest;
}

function calculateProjectile(velocity, targets) {
    if (velocity[0] < 0) return;
    let x = 0;
    let y = 0;
    let velocityX = velocity[0];
    let velocityY = velocity[1];

    const previousPositions = [];
    while (x < targets[0][1] && y > targets[1][0]) {
        x += velocityX;
        y += velocityY;
        previousPositions.push([x, y]);

        if (velocityX > 0) {
            velocityX = velocityX - DRAG;
        }

        velocityY -= GRAVITY;
    }

    return previousPositions.reduce(calculateHighest, 0);
}

function calculateTrickShot(targetArea) {
    const targets = getTargets(targetArea);
    const [targetX, targetY] = targets;

    const velocities = getVelocities(targetX, targetY);
    const highestY = calculateProjectile(velocities, targets);

    return highestY;
}

function run() {
    const exampleResult = calculateTrickShot(example);
    assert.equal(exampleResult, 45);

    const result = calculateTrickShot(data);
    assert.equal(result, 30628);

    console.log('Answer:', result);
}

run();