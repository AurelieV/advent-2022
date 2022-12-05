const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function executeInstruction(stacks, { count, from, to }) {
    for (let i = 1; i <= count; i++) {
        executeMovement(stacks, from, to);
    }
}

function executeMovement(stacks, from, to) {
    const fromStack = stacks.get(from);
    const toStack = stacks.get(to);
    const crate = fromStack.shift();
    toStack.unshift(crate);
}

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const [initialPositions, instructionsRaw] = rawInput.split("\n\n");
    const stacks = new Map();
    const lines = initialPositions.split("\n");

    const numbers = lines.pop();
    const stackIds = numbers.split(/\s+/).slice(1, -1);

    stackIds.forEach((stackId) => {
        const index = parseInt(stackId);
        const position = 4 * (index - 1) + 2 - 1;
        const stack = [];
        lines.forEach((line) => {
            if (line[position] !== " ") {
                stack.push(line[position]);
            }
        });
        stacks.set(stackId, stack);
    });

    const instructions = instructionsRaw.split("\n").map((line) => {
        [, rawCount, from, to] = line.match(/^move (\d+) from (\d+) to (\d+)$/);

        return { count: parseInt(rawCount), from, to };
    });

    instructions.forEach((instruction) => executeInstruction(stacks, instruction));

    const answer = [...stacks.values()].map((stack) => stack[0]).join("");

    resolving.succeed(`Jour ${chalk.red(5)} - the answer is ${answer}`);
    console.timeEnd("exec");
}

main();
