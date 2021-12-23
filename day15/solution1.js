"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

const MAX_INT = Number.MAX_SAFE_INTEGER;

function equals(arr1, arr2) {
    if (JSON.stringify(arr1) === JSON.stringify(arr2)) {
        return true;
    }
    return false;
}

function getChitonDensityLevels(cavern) {
    const dangerLevels = []
    for (let idx = 0; idx < cavern.length; ++idx) {
        const row = cavern[idx];
        const rowDanger = [];
        for (let jdx = 0; jdx < row.length; ++jdx) {
            rowDanger.push(parseInt(row[jdx], 10));
        }
        dangerLevels.push(rowDanger);
    }

    return dangerLevels;
}

function calculateMaximumTotalRiskLevels(xLength, yLength) {
    let totalRisk = [];

    for (let idx = 0; idx < xLength; ++idx) {
        let column = [];
        for (let jdx = 0; jdx < yLength; jdx++) {
            column.push(Number.MAX_SAFE_INTEGER);
        }
        totalRisk.push(column);
    }
    totalRisk[0][0] = 0;

    return totalRisk;
}

function calculateLowestRisk(cavern) {
    const dangerLevels = getChitonDensityLevels(cavern);
    const yLength = dangerLevels.length;
    const xLength = dangerLevels[0].length;

    let totalDanger = calculateMaximumTotalRiskLevels(xLength, yLength);
    let undiscovered = [];
    undiscovered.push([0, 0]);

    while (undiscovered.length > 0) {
        let leastDanger = MAX_INT;
        let leastDangerPosition = null;

        for (let idx = 0; idx < undiscovered.length; ++idx) {
            let x = undiscovered[idx][0];
            let y = undiscovered[idx][1];
            if (totalDanger[x][y] < leastDanger) {
                leastDanger = totalDanger[x][y];
                leastDangerPosition = [x, y];
            }
        }

        for (let idx = 0; idx < undiscovered.length; ++idx) {
            if (equals(undiscovered[idx], leastDangerPosition)) {
                undiscovered.splice(idx, 1)
                break;
            }
        }

        for (let idx = -1; idx <= 1; ++idx) {
            for (let jdx = -1; jdx <= 1; ++jdx) {
                let x = leastDangerPosition[0] + idx;
                let y = leastDangerPosition[1] + jdx;
                if (x >= 0 && x < xLength && y >= 0 && y < yLength &&
                    (idx != 0 || jdx != 0) && (idx == 0 || jdx == 0)) {
                    let neighbourRisk = totalDanger[leastDangerPosition[0]][leastDangerPosition[1]] + dangerLevels[x][y];
                    if (totalDanger[x][y] == MAX_INT) {
                        undiscovered.push([x, y])
                    }

                    if (!totalDanger[x][y] || neighbourRisk < totalDanger[x][y]) {
                        totalDanger[x][y] = neighbourRisk;
                    }
                }
            }
        }
    }

    return totalDanger[xLength - 1][yLength - 1];
}

function run() {
    const exampleResult = calculateLowestRisk(example);
    assert.equal(exampleResult, 40);

    const result = calculateLowestRisk(data);
    assert.equal(result, 769);

    console.log('Answer:', result);
}

run();