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

function parsePacket(binary, startPosition) {
    let version = parseBinary(binary, startPosition, startPosition + PACKET_VERSION);
    const typeId = parseBinary(binary, startPosition + PACKET_VERSION, startPosition + TYPE_ID);

    startPosition += TYPE_ID;
    if (typeId === LITERAL_VALUE) {
        while (binary[startPosition] === '1') startPosition += PACKET_LENGTH;
        startPosition += PACKET_LENGTH;
        return [version, startPosition];
    }

    startPosition += 1;
    let subVersion = 0;
    if (binary[startPosition - 1] === '0') {
        const bitlength = parseBinary(binary, startPosition, startPosition + TOTAL_BITS_LENGTH)
        startPosition += TOTAL_BITS_LENGTH;
        const currentPosition = startPosition;

        while (startPosition - currentPosition < bitlength) {
            [subVersion, startPosition] = parsePacket(binary, startPosition);
            version += subVersion;
        }
    } else {
        const packetlength = parseBinary(binary, startPosition, startPosition + CONTAINED_SUB_PACKETS);
        startPosition += CONTAINED_SUB_PACKETS;
        let parsedPackets = 0;

        while (parsedPackets < packetlength) {
            [subVersion, startPosition] = parsePacket(binary, startPosition);
            version += subVersion;
            parsedPackets += 1;
        }
    }

    return [version, startPosition];
}

function ifAllZeroAfterPosition(binary, pos) {
    for (let idx = pos; idx < binary.length; ++idx) {
        if (binary[idx] !== '0') return true;
    }
    return false;
}


function decodePacket(hexadecimalString) {
    const binary = createBinaryArrayFromHexString(hexadecimalString);
    let total = 0;
    let position = 0;
    let version;

    while (position < binary.length) {
        [version, position] = parsePacket(binary, position);
        total += version;

        if (!ifAllZeroAfterPosition(binary, position)) break;
    }

    return total;
}

function run() {
    const exampleResult = decodePacket(example);
    assert.equal(exampleResult, 31);

    const result = decodePacket(data);
    assert.equal(result, 1038);

    console.log('Answer:', result);
}

run();