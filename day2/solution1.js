"use strict"

const { data } = require('./data.json');

function run() {
    let horizontal = 0;
    let depth = 0;

    for (let idx = 0; idx < data.length; ++idx) {
        const splittedValue = data[idx].split(' ');
        const direction = splittedValue[0];
        const value = parseInt(splittedValue[1]);

        if (direction === "forward") {
            horizontal += value;
        } else if (direction === "down") {
            depth += value;
        } else {
            depth -= value;
        }
    }

    return horizontal * depth;
}

console.log(run());