"use strict"

const assert = require('assert');

const { data } = require('./data');
const { example } = require('./example');

const MAX_INT = Number.MAX_SAFE_INTEGER;
const DIMENSION_SIZE = 5;

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

function calculateMaximumLargeTotalRiskLevels(dangerLevels, xLength, yLength, xLargeLength, yLargeLength) {
    let largeRisk = [];
    for (let idx = 0; idx < xLargeLength; ++idx) {
        let largeRiskRow = [];
        for (let jdx = 0; jdx < yLargeLength; ++jdx) {
            const level = dangerLevels[idx % xLength][jdx % yLength]
            let riskValue = level + Math.floor(idx / xLength) + Math.floor(jdx / yLength);
            riskValue = riskValue > 9 ? riskValue - 9 : riskValue;
            largeRiskRow.push(riskValue);
        }
        largeRisk.push(largeRiskRow);
    }

    return largeRisk;
}

function calculateMaximumTotalRiskLevels(xLength, yLength) {
    let totalRisk = [];

    for (let idx = 0; idx < xLength; ++idx) {
        let column = [];
        for (let jdx = 0; jdx < yLength; ++jdx) {
            column.push(MAX_INT);
        }
        totalRisk.push(column);
    }
    totalRisk[0][0] = 0;

    return totalRisk;
}

function calculateLowestRisk(dangerLevels) {
    dangerLevels = getChitonDensityLevels(dangerLevels);
    const yLength = dangerLevels.length;
    const xLength = dangerLevels[0].length;

    const xLargeLength = xLength * DIMENSION_SIZE;
    const yLargeLength = yLength * DIMENSION_SIZE;
    let largeRisk = calculateMaximumLargeTotalRiskLevels(dangerLevels, xLength, yLength, xLargeLength, yLargeLength);
    let totalRisk = calculateMaximumTotalRiskLevels(xLargeLength, yLargeLength);
    let undiscovered = [];
    undiscovered.push([0, 0]);

    while (undiscovered.length > 0) {
        let leastDanger = MAX_INT;
        let leastDangerPosition = null;

        for (let idx = 0; idx < undiscovered.length; ++idx) {
            let x = undiscovered[idx][0];
            let y = undiscovered[idx][1];
            if (totalRisk[x][y] < leastDanger) {
                leastDanger = totalRisk[x][y];
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
                let posX = leastDangerPosition[0] + idx;
                let posY = leastDangerPosition[1] + jdx;
                if (posX >= 0 && posX < xLargeLength && posY >= 0 && posY < yLargeLength &&
                    (idx != 0 || jdx != 0) && (idx == 0 || jdx == 0)) {
                    let neighbourRisk = totalRisk[leastDangerPosition[0]][leastDangerPosition[1]] + largeRisk[posX][posY];
                    if (totalRisk[posX][posY] == MAX_INT) {
                        undiscovered.push([posX, posY])
                    }

                    if (!totalRisk[posX][posY] || neighbourRisk < totalRisk[posX][posY]) {
                        totalRisk[posX][posY] = neighbourRisk;
                    }
                }
            }
        }
    }

    return totalRisk[xLargeLength - 1][yLargeLength - 1];
}

function run() {
    const exampleResult = calculateLowestRisk(example);
    assert.equal(exampleResult, 315);

    const result = calculateLowestRisk(data);
    assert.equal(result, 2963);

    console.log('Answer:', result);
}

run();