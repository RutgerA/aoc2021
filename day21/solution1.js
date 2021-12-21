"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

const MAX_SIZE = 10;
const DEFAULT_STEPS = 3;

function getPlayerInfo(values) {
    const players = [];
    for (let idx = 0; idx < values.length; ++idx) {
        players.push({
            name: values[idx].split('starting position')[0].trim(),
            position: parseInt(values[idx].split(':')[1].trim()),
            score: 0
        });
    }

    return players;
}

function playDiracDice(values) {
    const players = getPlayerInfo(values);

    let idx = 1;
    while (true) {
        const currentPlayerIdx = idx % 2 === 0 ? 1 : 0;
        const currentPlayer = players[currentPlayerIdx];
        const total = (idx * DEFAULT_STEPS) + DEFAULT_STEPS + currentPlayer.position;
        idx += DEFAULT_STEPS;

        const position = total % MAX_SIZE === 0 ? MAX_SIZE : total % MAX_SIZE;
        currentPlayer.position = position;
        currentPlayer.score += position;

        if (currentPlayer.score > 999) break;
    }

    players.sort(function (a, b) {
        return a.score - b.score
    })

    const lowestScore = players[0];
    return lowestScore.score * (idx - 1);
}

function run() {
    const exampleResult = playDiracDice(example);
    assert.equal(exampleResult, 739785);

    const result = playDiracDice(data);
    assert.equal(result, 571032);

    console.log('Answer:', result);
}

run();