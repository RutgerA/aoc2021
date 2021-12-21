"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

let calculatedOutcomes = [];
let diceRolls = [];

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

function createPossibleDiceRolls(diceSize) {
    const diceLength = diceSize + 1;
    const resultDiceRolls = [];

    for (let idx = 1; idx < diceLength; ++idx) {
        for (let jdx = 1; jdx < diceLength; ++jdx) {
            for (let kdx = 1; kdx < diceLength; ++kdx) {
                const sum = idx + jdx + kdx;
                const resultDiceRoll = resultDiceRolls.find(r => { return r.sum === sum });
                if (resultDiceRoll) {
                    ++resultDiceRoll.count;
                } else {
                    resultDiceRolls.push({ sum: sum, count: 1 });
                }
            }
        }
    }

    return resultDiceRolls;
}

function createWinnerArray(totalPlayers, foundWinnerIndex) {
    const result = new Array(totalPlayers).fill(0);
    if (foundWinnerIndex !== undefined) result[foundWinnerIndex] = 1;

    return result;
}

function comparePlayers(p1, p2) {
    for (let idx = 0; idx < p1.length; ++idx) {
        if (p1[idx].score !== p2[idx].score) return false;
        if (p1[idx].position !== p2[idx].position) return false;
    }
    return true;
}

function compareOutcomes(c, t) {
    return c.turn === t.turn && comparePlayers(c.players, t.players);
}

function getPlayerForDiceRoll(players, turnIndex, sum) {
    const diceRollPlayers = [...players];
    const newScore = players[turnIndex].position + sum;
    const position = newScore % MAX_SIZE === 0 ? MAX_SIZE : newScore % MAX_SIZE;
    const score = players[turnIndex].score + position;
    diceRollPlayers[turnIndex] = { position, score };

    return diceRollPlayers;
}

function calculateGameUniverses(players, turnIndex = 0) {
    const totalPlayers = players.length;
    const foundWinnerIndex = players.findIndex(p => { return p.score > 20 });
    if (foundWinnerIndex > -1) return createWinnerArray(totalPlayers, foundWinnerIndex);

    const universeOutcome = {
        players: players,
        turn: turnIndex
    };

    const foundOutcome = calculatedOutcomes.find(c => { return compareOutcomes(c, universeOutcome) });
    if (foundOutcome) return foundOutcome.wins;

    const nextTurnIndex = turnIndex + 1;
    const wins = createWinnerArray(totalPlayers);

    for (let idx = 0; idx < diceRolls.length; ++idx) {
        const diceRollPlayers = getPlayerForDiceRoll(players, turnIndex, diceRolls[idx].sum);
        const calculatedWins = calculateGameUniverses(diceRollPlayers, nextTurnIndex % totalPlayers);
        for (let jdx = 0; jdx < totalPlayers; ++jdx) {
            wins[jdx] += diceRolls[idx].count * calculatedWins[jdx];
        }
    }

    universeOutcome.wins = wins;
    calculatedOutcomes.push(universeOutcome);

    return wins;
}

function playDiracDice(values) {
    const players = getPlayerInfo(values);
    calculatedOutcomes = [];

    const result = calculateGameUniverses(players);
    return Math.max(...result);
}

function run() {
    diceRolls = createPossibleDiceRolls(DEFAULT_STEPS);

    const exampleResult = playDiracDice(example);
    assert.equal(exampleResult, 444356092776315);

    const result = playDiracDice(data);
    assert.equal(result, 49975322685009);

    console.log('Answer:', result);
}

run();
