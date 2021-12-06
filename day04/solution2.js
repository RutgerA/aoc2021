"use strict"

const assert = require('assert');

const data = require('./data');
const example = require('./example');

function initializeBoards(boards) {
    const cards = [];
    const masks = [];

    for (let idx = 0; idx < boards.length; ++idx) {
        const splittedRows = boards[idx].split(';');
        const card = [];
        const mask = [];
        for (let jdx = 0; jdx < splittedRows.length; ++jdx) {
            const splittedColumns = splittedRows[jdx].split(',');
            card.push(splittedColumns.map(item => { return parseInt(item) }));
            mask.push(new Array(splittedColumns.length).fill(0));
        }

        cards.push(card);
        masks.push(mask);
    }

    return {
        cards,
        masks
    }
}

function calculateResult(idx, num, card) {
    const total = card.reduce(function (a, b) { return a.concat(b) })
        .reduce(function (a, b) { return a + b });

    return {
        index: idx,
        result: total * num
    };
}

function updateMasks(num, cards, masks) {
    // Update all masks
    for (let idx = 0; idx < cards.length; ++idx) {
        const card = cards[idx];
        for (let jdx = 0; jdx < card.length; ++jdx) {
            const kdx = card[jdx].indexOf(num);
            if (kdx === -1) continue;

            masks[idx][jdx][kdx] = 1;
        }
    }
}

function checkWinner(num, cards, masks) {
    // Update card value and return winner if found
    for (let idx = 0; idx < cards.length; ++idx) {
        const card = cards[idx];
        for (let jdx = 0; jdx < card.length; ++jdx) {
            const kdx = card[jdx].indexOf(num);
            if (kdx === -1) continue;

            card[jdx][kdx] = 0;
            if (!masks[idx][jdx].includes(0)) return calculateResult(idx, num, card);

            const column = masks[idx].map(item => { return item[kdx] });
            if (!column.includes(0)) return calculateResult(idx, num, card);
        }
    }

    return null;
}

function calculateLastBingoWinner(rolls, boards) {
    const { cards, masks } = initializeBoards(boards);

    let lastWinner;
    for (let idx = 0; idx < rolls.length; ++idx) {
        const bingoNumber = rolls[idx];
        updateMasks(bingoNumber, cards, masks);

        while (true) {
            const winner = checkWinner(bingoNumber, cards, masks);
            if (winner) {
                cards.splice(winner.index, 1);
                masks.splice(winner.index, 1);
                lastWinner = winner;
            } else {
                break;
            }
        }
    }

    return lastWinner.result;
}

function run() {
    const exampleResult = calculateLastBingoWinner(example.numbers, example.boards);
    assert.equal(exampleResult, 1924);

    const result = calculateLastBingoWinner(data.numbers, data.boards);
    assert.equal(result, 8224);

    console.log('Answer:', result);
}

run();