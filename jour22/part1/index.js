const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

const DIRECTIONS = [
    { dx: 1, dy: 0 }, // RIGHT
    { dx: 0, dy: 1 }, // BOTTOM
    { dx: -1, dy: 0 }, // LEFT
    { dx: 0, dy: -1 }, // TOP
];

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const map = new Map();

    let [rawMap, instructions] = rawInput.split("\n\n");
    const lines = rawMap.split("\n");
    lines.forEach((line, y) => {
        [...line].forEach((carac, x) => {
            if (carac === " ") return;
            map.set(`${x}_${y}`, { x, y, isStop: carac === "#" });
        });
    });

    const maxY = lines.length - 1;
    const maxX = Math.max(...lines.map((line) => line.length - 1));

    const minMaxPerRow = {};
    const minMaxPerColumn = {};

    for (let x = 0; x <= maxX; x++) {
        for (let y = 0; y <= maxY; y++) {
            const point = map.get(`${x}_${y}`);
            if (!point) continue;
            if (!minMaxPerColumn[x]) {
                minMaxPerColumn[x] = { min: y, max: y };
            } else {
                minMaxPerColumn[x].min = Math.min(minMaxPerColumn[x].min, y);
                minMaxPerColumn[x].max = Math.max(minMaxPerColumn[x].max, y);
            }
            if (!minMaxPerRow[y]) {
                minMaxPerRow[y] = { min: x, max: x };
            } else {
                minMaxPerRow[y].min = Math.min(minMaxPerRow[y].min, x);
                minMaxPerRow[y].max = Math.max(minMaxPerRow[y].max, x);
            }
        }
    }

    let direction = 0; // RIGHT
    let x = minMaxPerRow[0].min;
    let y = 0;

    function getNext(x, y) {
        const { dx, dy } = DIRECTIONS[direction];
        if (dx !== 0) {
            const { min, max } = minMaxPerRow[y];
            const length = max - min + 1;
            let relativeX = x - min;
            const relativeNewX = (relativeX + dx + length) % length;
            return map.get(`${relativeNewX + min}_${y}`);
        }
        if (dy !== 0) {
            const { min, max } = minMaxPerColumn[x];
            const length = max - min + 1;
            let relativeY = y - min;
            const relativeNewy = (relativeY + dy + length) % length;
            return map.get(`${x}_${relativeNewy + min}`);
        }
    }

    function executeMovement(count) {
        let next;
        while (count > 0) {
            next = getNext(x, y);
            if (next.isStop) {
                return;
            }
            x = next.x;
            y = next.y;
            count--;
        }
    }
    function executeRotation(rotation) {
        if (rotation === "R") {
            direction = (direction + 1) % 4;
        } else {
            direction = (direction - 1 + 4) % 4; // avoid negative modulo
        }
    }

    while (instructions.length > 0) {
        const [, movement, rotation, next] = instructions.match(/^(\d+)(R|L)?(.*)$/);

        executeMovement(parseInt(movement));
        if (rotation) {
            executeRotation(rotation);
        }
        instructions = next;
    }

    console.log(`Column: ${x + 1}, row: ${y + 1}, direction: ${direction} `);
    const answer = 1000 * (y + 1) + 4 * (x + 1) + direction;

    resolving.succeed(`Jour ${chalk.red(22)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
