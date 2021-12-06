"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

function placeholder(values) {

}

function run() {
    const exampleResult = placeholder(example);
    assert.equal(exampleResult, 123);

    const result = placeholder(data);
    assert.equal(result, 1234);

    console.log('Answer:', result);
}

run();