const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const jets = rawInput.split("").map((turn) => (turn === ">" ? 1 : -1));

    let jetTurn = 0;
    function getJet(turn) {
        return jets[turn % jets.length];
    }
    const SHAPES = [
        [
            { x: 2, y: 4 },
            { x: 3, y: 4 },
            { x: 4, y: 4 },
            { x: 5, y: 4 },
        ],
        [
            { x: 2, y: 5 },
            { x: 3, y: 5 },
            { x: 4, y: 5 },
            { x: 3, y: 4 },
            { x: 3, y: 6 },
        ],
        [
            { x: 2, y: 4 },
            { x: 3, y: 4 },
            { x: 4, y: 4 },
            { x: 4, y: 5 },
            { x: 4, y: 6 },
        ],
        [
            { x: 2, y: 4 },
            { x: 2, y: 5 },
            { x: 2, y: 6 },
            { x: 2, y: 7 },
        ],
        [
            { x: 2, y: 4 },
            { x: 2, y: 5 },
            { x: 3, y: 4 },
            { x: 3, y: 5 },
        ],
    ];
    let rockTurn = 0;
    function getRock(turn) {
        return JSON.parse(JSON.stringify(SHAPES[turn % SHAPES.length]));
    }

    let restingRocks = new Map();
    function isPossible(points) {
        return points.every(({ x, y }) => x >= 0 && x <= 6 && !restingRocks.has(`${x}_${y}`) && y > 0);
    }

    let max = 0;
    function oneRock(points) {
        while (true) {
            const jet = getJet(jetTurn);
            const nextPositionAfterJet = points.map(({ x, y }) => ({ x: x + jet, y }));
            if (isPossible(nextPositionAfterJet)) {
                points = nextPositionAfterJet;
            }
            jetTurn++;
            nextPositionAfterDown = points.map(({ x, y }) => ({ x, y: y - 1 }));
            if (isPossible(nextPositionAfterDown)) {
                points = nextPositionAfterDown;
            } else {
                max = Math.max(...points.map(({ y }) => y), max);
                points.forEach(({ x, y }) => restingRocks.set(`${x}_${y}`, true));
                break;
            }
        }
    }

    while (rockTurn < 2022) {
        let points = getRock(rockTurn).map(({ x, y }) => ({ x, y: y + max }));
        oneRock(points);
        rockTurn++;
    }

    resolving.succeed(`Jour ${chalk.red(17)} - the answer is ${chalk.bold.magenta(max)}`);
    console.timeEnd("exec");
}

main();
