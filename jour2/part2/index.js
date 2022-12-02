const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

const POINTS = {
    A: {
        X: 0 + 3,
        Y: 3 + 1,
        Z: 6 + 2,
    },
    B: {
        X: 0 + 1,
        Y: 3 + 2,
        Z: 6 + 3,
    },
    C: {
        X: 0 + 2,
        Y: 3 + 3,
        Z: 6 + 1,
    },
};

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const score = rawInput.split('\n').reduce((score, line) => {
        const [opponentPlay, play] = line.split(' ');
        return score + POINTS[opponentPlay][play]
    }, 0)

    resolving.succeed(`Jour ${chalk.red(2)} - the answer is ${chalk.bold.magenta(score)}`);
    console.timeEnd("exec");
}

main();
