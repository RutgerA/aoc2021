"use strict"

const { data } = require('./data.json');

function run() {
    const length = data.length;

    let count = 0;
    let prevNumber = data[0] + data[1] + data[2];
    for (let idx = 3; idx < length; ++idx) {
        const nextNumber = (prevNumber - data[idx - 3]) + data[idx];

        if (prevNumber < nextNumber) {
            ++count;
        }

        prevNumber = nextNumber;
    }

    return count;
}

console.log(run());