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

    const repeat = new Map();
    let max = 0;
    const H = 300;
    function checkRepeat() {
        let stack = "";
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < 7; x++) {
                stack += restingRocks.has(`${x}_${y}`) ? `1` : "0";
            }
        }
        const hash = `${stack}_${jetTurn % jets.length}_${rockTurn % SHAPES.length}`;
        if (repeat.has(hash)) {
            return repeat.get(hash);
        } else {
            repeat.set(hash, { height: max, rockTurn });
        }
    }
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

    const NUMBER_TURN = 1000000000000;
    let IS_REPEAT;
    while (rockTurn < NUMBER_TURN) {
        IS_REPEAT = checkRepeat();
        if (IS_REPEAT) {
            console.log("BREAK !");
            break;
        }
        let points = getRock(rockTurn).map(({ x, y }) => ({ x, y: y + max }));
        oneRock(points);
        rockTurn++;
    }

    const { height: MAX_BEFORE_REPEAT, rockTurn: TURN_BEFORE_REPEAT } = IS_REPEAT;
    const cycleLength = rockTurn - TURN_BEFORE_REPEAT;
    const HEIGHT_PER_REPEAT = max - MAX_BEFORE_REPEAT;

    const cycles = Math.floor((NUMBER_TURN - TURN_BEFORE_REPEAT) / cycleLength);
    let answer = MAX_BEFORE_REPEAT + HEIGHT_PER_REPEAT * cycles;

    console.log(`Doing ${cycles} cycles of length ${cycleLength}, with a max of ${answer}`);

    rockTurn = TURN_BEFORE_REPEAT + cycles * cycleLength;
    const MAX_BEFORE_LAST = max;
    while (rockTurn < NUMBER_TURN) {
        let points = getRock(rockTurn).map(({ x, y }) => ({ x, y: y + max }));
        oneRock(points);
        rockTurn++;
    }
    const HEIGHT_FOR_LAST = max - MAX_BEFORE_LAST;

    answer += HEIGHT_FOR_LAST;

    resolving.succeed(`Jour ${chalk.red(17)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
