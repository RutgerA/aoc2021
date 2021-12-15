"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example1 } = require('./example1');
const { example2 } = require('./example2');
const { example3 } = require('./example3');

function isLower(s) {
    return s === s.toLowerCase();
}

function createNeighbours(values) {
    const neighbours = [];

    for (let idx = 0; idx < values.length; ++idx) {
        const splittedPath = values[idx].split('-');
        neighbours.push({ from: splittedPath[0], to: splittedPath[1] });
        neighbours.push({ from: splittedPath[1], to: splittedPath[0] });
    }

    return neighbours;
}

function canVisit(nodeFrom, nameTo) {
    if (!isLower(nameTo)) return true;

    let node = nodeFrom;
    while (node) {
        if (node['name'] === nameTo) return false;
        node = node['prev'];
    }

    return true;
}

function calculatePaths(values) {
    const neighbours = createNeighbours(values);
    const stack = [];
    stack.push({ name: 'start', prev: null })

    let total = 0;
    let node;
    while (stack.length > 0) {
        node = stack.pop();

        if (node['name'] == 'end') ++total;

        const currentNeighbours = neighbours.filter(n => { return n.from === node['name'] });
        for (let idx = 0; idx < currentNeighbours.length; ++idx) {
            const neighbourTo = currentNeighbours[idx].to;
            if (canVisit(node, neighbourTo)) {
                stack.push({ "name": neighbourTo, "prev": node })
            }
        }
    }

    return total;
}


function run() {
    const exampleResult1 = calculatePaths(example1);
    assert.equal(exampleResult1, 10);

    const exampleResult2 = calculatePaths(example2);
    assert.equal(exampleResult2, 19);

    const exampleResult3 = calculatePaths(example3);
    assert.equal(exampleResult3, 226);

    const result = calculatePaths(data);
    assert.equal(result, 4495);

    console.log('Answer:', result);
}

run();