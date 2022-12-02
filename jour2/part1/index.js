const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

const POINTS = {
    X: {
        base: 1,
        opponent: {
            A: 3,
            B: 0,
            C: 6,
        },
    },
    Y: {
        base: 2,
        opponent: {
            A: 6,
            B: 3,
            C: 0,
        },
    },
    Z: {
        base: 3,
        opponent: {
            A: 0,
            B: 6,
            C: 3,
        },
    },
};

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const score = rawInput.split('\n').reduce((score, line) => {
        const [opponentPlay, play] = line.split(' ');
        return score + POINTS[play].base + POINTS[play].opponent[opponentPlay]
    }, 0)

    resolving.succeed(`Jour ${chalk.red(2)} - the answer is ${chalk.bold.magenta(score)}`);
    console.timeEnd("exec");
}

main();
