const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

const DELTA = {
    R: { x: 1, y: 0 },
    L: { x: -1, y: 0 },
    U: { x: 0, y: 1 },
    D: { x: 0, y: -1 },
};

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const visited = new Map();
    const instructions = rawInput.split("\n").map((line) => {
        const [, direction, rawCount] = line.match(/^(.) (\d+)$/);
        return {
            direction,
            count: parseInt(rawCount),
        };
    });

    const head = { x: 0, y: 0 };
    const tail = { x: 0, y: 0 };
    visited.set("0_0", true);

    function moveOne(direction) {
        head.x += DELTA[direction].x;
        head.y += DELTA[direction].y;

        if (Math.abs(tail.x - head.x) <= 1 && Math.abs(tail.y - head.y) <= 1) {
            return;
        }

        tail.x = tail.x + Math.sign(head.x - tail.x);
        tail.y = tail.y + Math.sign(head.y - tail.y);
    }

    instructions.forEach(({ direction, count }) => {
        for (let i = 1; i <= count; i++) {
            moveOne(direction);
            visited.set(`${tail.x}_${tail.y}`, true);
        }
    });

    resolving.succeed(`Jour ${chalk.red(9)} - the answer is ${chalk.bold.magenta(visited.size)}`);
    console.timeEnd("exec");
}

main();
