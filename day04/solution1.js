"use strict"

const assert = require('assert');

const data = require('./data');
const example = require('./example');

function calculateResult(num, card) {
    const total = card.reduce(function (a, b) { return a.concat(b) })
        .reduce(function (a, b) { return a + b });

    return total * num;
}

function checkWinner(num, cards, masks) {
    // Update all masks
    for (let idx = 0; idx < cards.length; ++idx) {
        const card = cards[idx];
        for (let jdx = 0; jdx < card.length; ++jdx) {
            const kdx = card[jdx].indexOf(num);
            if (kdx === -1) continue;

            masks[idx][jdx][kdx] = 1;
        }
    }

    // Update card value and return winner if found
    for (let idx = 0; idx < cards.length; ++idx) {
        const card = cards[idx];
        for (let jdx = 0; jdx < card.length; ++jdx) {
            const kdx = card[jdx].indexOf(num);
            if (kdx === -1) continue;

            card[jdx][kdx] = 0;
            if (!masks[idx][jdx].includes(0)) return calculateResult(num, card);

            const column = masks[idx].map(item => { return item[kdx] });
            if (!column.includes(0)) return calculateResult(num, card);
        }
    }

    return null;
}

function calculateFirstBingoWinner(rolls, cards) {
    const boardsParsed = [];
    const boardMasks = [];

    for (let idx = 0; idx < cards.length; ++idx) {
        const splittedRows = cards[idx].split(';');
        const newBoard = [];
        const boardMask = [];
        for (let jdx = 0; jdx < splittedRows.length; ++jdx) {
            const splittedColumns = splittedRows[jdx].split(',');
            newBoard.push(splittedColumns.map(item => { return parseInt(item) }));
            boardMask.push(new Array(splittedColumns.length).fill(0));
        }

        boardsParsed.push(newBoard);
        boardMasks.push(boardMask);
    }

    for (let idx = 0; idx < rolls.length; ++idx) {
        const bingoNumber = rolls[idx];
        const winner = checkWinner(bingoNumber, boardsParsed, boardMasks);

        if (winner) {
            return winner;
        }
    }
}

function run() {
    const exampleResult = calculateFirstBingoWinner(example.numbers, example.boards);
    assert.equal(exampleResult, 4512);

    const result = calculateFirstBingoWinner(data.numbers, data.boards);
    assert.equal(result, 28082);

    console.log('Answer:', result);
}

run();