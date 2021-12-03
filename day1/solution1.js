"use strict"

const { data } = require('./data.json');

function run() {
    let prevNumber;
    let count = 0;
    for (let idx = 0; idx < data.length; ++idx) {
        if (prevNumber && prevNumber < data[idx]) {
            ++count;
        }

        prevNumber = data[idx];
    }

    return count;
}

console.log(run());