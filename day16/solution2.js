"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

const PACKET_VERSION = 3;
const TYPE_ID = PACKET_VERSION + 3;
const PACKET_LENGTH = 5;

const TOTAL_BITS_LENGTH = 15;
const CONTAINED_SUB_PACKETS = 11;
const LITERAL_VALUE = 4;


function add(a, b) {
    return a + b;
}

function arrayAdd(arr) {
    return arr.reduce(add, 0);
}

function arrayMultiply(arr) {
    return arr.reduce((a, b) => a * b);
}

function arrayMin(arr) {
    return Math.min(...arr);
}

function arrayMax(arr) {
    return Math.max(...arr);
}

function createBinaryArrayFromHexString(hexadecimalString) {
    const binary = [];
    for (let idx = 0; idx < hexadecimalString.length; ++idx) {
        const char = hexadecimalString[idx];
        const hex = '' + parseInt(char, 16).toString(2);
        const padding = new Array((4 - hex.length) + 1).join('0');
        const paddedHex = padding + hex;
        for (let jdx = 0; jdx < paddedHex.length; ++jdx) {
            binary.push(paddedHex[jdx]);
        }
    }

    return binary;
}

function parseBinary(binary, start, end) {
    let result = '';
    for (let idx = start; idx < end; ++idx) {
        if (binary[idx] === undefined) return 0;
        result += binary[idx];
    }

    return parseInt(result, 2);
}

function addBinaryRange(vals, binary, start, end) {
    for (let idx = start; idx < end; ++idx) {
        vals.push(binary[idx]);
    }
}

function calculateExpression(typeId, subPackets, position) {
    switch (typeId) {
        case 0: return [arrayAdd(subPackets), position];
        case 1: return [arrayMultiply(subPackets), position];
        case 2: return [arrayMin(subPackets), position];
        case 3: return [arrayMax(subPackets), position];
        case 5: return [subPackets[0] > subPackets[1] ? 1 : 0, position];
        case 6: return [subPackets[0] < subPackets[1] ? 1 : 0, position];
        case 7: return [subPackets[0] === subPackets[1] ? 1 : 0, position];
    }
}

function parsePacket(binary, startPosition) {
    const typeId = parseBinary(binary, startPosition + PACKET_VERSION, startPosition + TYPE_ID);

    startPosition += TYPE_ID;
    if (typeId === LITERAL_VALUE) {
        const subPackets = [];
        while (binary[startPosition] === '1') {
            addBinaryRange(subPackets, binary, startPosition + 1, startPosition + PACKET_LENGTH);
            startPosition += PACKET_LENGTH;
        }
        addBinaryRange(subPackets, binary, startPosition + 1, startPosition + PACKET_LENGTH);
        startPosition += PACKET_LENGTH;
        return [parseInt(subPackets.join(''), 2), startPosition];
    }

    startPosition += 1;
    let value = 0;
    const subPackets = [];
    if (binary[startPosition - 1] === '0') {
        const bitlength = parseBinary(binary, startPosition, startPosition + TOTAL_BITS_LENGTH)
        startPosition += TOTAL_BITS_LENGTH;
        const currentPosition = startPosition;

        while (startPosition - currentPosition < bitlength) {
            [value, startPosition] = parsePacket(binary, startPosition);
            subPackets.push(value);
        }
    } else {
        const packetlength = parseBinary(binary, startPosition, startPosition + CONTAINED_SUB_PACKETS);
        startPosition += CONTAINED_SUB_PACKETS;
        let parsedPackets = 0;

        while (parsedPackets < packetlength) {
            [value, startPosition] = parsePacket(binary, startPosition);
            subPackets.push(value);
            parsedPackets += 1;
        }
    }

    return calculateExpression(typeId, subPackets, startPosition);
}

function decodePacket(hexadecimalString) {
    const binary = createBinaryArrayFromHexString(hexadecimalString);
    return parsePacket(binary, 0)[0];
}

function run() {
    const exampleResult = decodePacket(example);
    assert.equal(exampleResult, 54);

    const result = decodePacket(data);
    assert.equal(result, 246761930504);

    console.log('Answer:', result);
}

run();