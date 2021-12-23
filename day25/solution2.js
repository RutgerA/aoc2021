"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');


function temp(values) {

}

function run() {
    const exampleResult = temp(example);
    assert.equal(exampleResult, 195);

    const result = temp(data);
    assert.equal(result, 237);

    console.log('Answer:', result);
}

run();