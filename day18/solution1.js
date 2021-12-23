"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

let doSplit;

function parseLines(lines) {
    const result = [];
    for (let idx = 0; idx < lines.length; ++idx) {
        result.push(JSON.parse(lines[idx]));
    }

    return result;
}

function reduction(tree) {
    do {
        doSplit = false;
        split(tree);
        explode(tree);
    } while (doSplit)
}

function calculateMagnitude(node) {
    let firstNode = node[0];
    let secondNode = node[1];

    if (Array.isArray(firstNode)) firstNode = calculateMagnitude(firstNode);
    if (Array.isArray(secondNode)) secondNode = calculateMagnitude(secondNode);

    return firstNode * 3 + secondNode * 2;
}

function collect(node, array) {
    if (node.value === undefined) {
        let cell = [];
        array.push(cell);
        collect(node.left, cell);
        collect(node.right, cell);
    } else {
        array.push(node.value);
    }
}

function createSides(node, depth) {
    let left = {};
    left.isLeft = true;
    left.parent = node;
    left.depth = depth;

    let right = {};
    right.isLeft = false;
    right.parent = node;
    right.depth = depth;

    return [left, right];
}


function getTree(line, node, depth) {
    ++depth;
    const [left, right] = createSides(node, depth);
    [node.left, node.right] = [left, right];
    let leftValue = line[0];
    let rightValue = line[1];

    if (Array.isArray(leftValue)) {
        left.value = undefined;
        getTree(leftValue, left, depth);
    } else {
        left.value = leftValue;
    }

    if (Array.isArray(rightValue)) {
        right.value = undefined;
        getTree(rightValue, right, depth);
    } else {
        right.value = rightValue;
    }
}


function split(node) {
    if (doSplit) return;

    if (node.value > 9) {
        doSplit = true;
        const [left, right] = createSides(node, node.depth + 1);
        left.value = Math.floor(node.value / 2);
        right.value = Math.ceil(node.value / 2);

        [node.left, node.right] = [left, right];
        delete node.value;
    } else if (node.value === undefined) {
        split(node.left);
        split(node.right);
    }
}


function findLeft(nextNode, left) {
    if (nextNode.value !== undefined) {
        nextNode.value += left;
        return;
    }

    while (nextNode.right.value === undefined) {
        nextNode = nextNode.right;
    }
    nextNode.right.value += left;
}


function findRight(nextNode, right) {
    if (nextNode.value !== undefined) {
        nextNode.value += right;
        return;
    }

    while (nextNode.left.value === undefined) {
        nextNode = nextNode.left;
    }
    nextNode.left.value += right;
}

function findAdjacentLeft(node, nextNode, left, right) {
    while (nextNode.isLeft === true) nextNode = nextNode.parent;

    if (nextNode.parent !== undefined) {
        nextNode = nextNode.parent.left;
        findLeft(nextNode, left);
    }

    nextNode = node.parent.parent.right;
    findRight(nextNode, right);
}

function findAdjacentRight(node, nextNode, left, right) {
    while (nextNode.isLeft === false) nextNode = nextNode.parent;

    if (nextNode.parent !== undefined) {
        nextNode = nextNode.parent.right;
        findRight(nextNode, right);
    }

    nextNode = node.parent.parent.left;
    findLeft(nextNode, left);
}

function findAdjacent(node, left, right) {
    let nextNode = node.parent;

    if (nextNode.isLeft) findAdjacentLeft(node, nextNode, left, right);
    else findAdjacentRight(node, nextNode, left, right);
}

function explode(node) {
    if (node.value === undefined) {
        explode(node.left);
        explode(node.right);
    } else if (node.depth === 5 && !node.isLeft) {
        let left = node.parent.left.value;
        let right = node.parent.right.value;

        findAdjacent(node, left, right);
        node.parent.value = 0;
        delete node.parent.left;
        delete node.parent.right;
    }
}


function calculateSumMagnitude(lines) {
    const parsedLines = parseLines(lines);

    const acc = parsedLines.reduce((leftValue, rightValue) => {
        const tree = {};
        getTree([leftValue, rightValue], tree, 0);
        explode(tree);
        reduction(tree);

        const result = [];
        collect(tree, result);
        return result[0];
    })

    return calculateMagnitude(acc);
}

function run() {
    const exampleResult = calculateSumMagnitude(example);
    assert.equal(exampleResult, 4140);

    const result = calculateSumMagnitude(data);
    assert.equal(result, 3524);

    console.log('Answer:', result);
}

run();