"use strict"

const { data } = require('./data.json');

function flipBits(str) {
    return str.split('').map(b => (1 - b).toString()).join('');
}

function run() {
    const length = data.length;
    const binaryLength = data[0].length;
    let highestBinary = "";

    for (let idx = 0; idx < binaryLength; ++idx) {
        let zeros = 0;

        for (let jdx = 0; jdx < length; ++jdx) {
            if (data[jdx][idx] === "0") ++zeros;
        }

        highestBinary += length - zeros > zeros ? "0" : "1";
    }

    return parseInt(highestBinary, 2) * parseInt(flipBits(highestBinary), 2);
}

console.log(run());