const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const instructions = rawInput.split("\n").map((line) => {
        if (line === "noop") return { type: "noop" };
        const [, rawValue] = line.match(/^addx (-{0,1}\d+)$/);

        return { type: "add", value: parseInt(rawValue) };
    });

    let answer = 0;
    let cycle = 0;
    let x = 1;
    let valueToChecks = [20, 60, 100, 140, 180, 220];

    instructions.forEach((instruction) => {
        if (instruction.type === "noop") {
            cycle++;
        } else if (instruction.type === "add") {
            cycle += 2;
        }
        if (valueToChecks[0] && cycle >= valueToChecks[0]) {
            const cycleValue = valueToChecks.shift();
            console.log(`Cycle ${cycleValue}, register value ${x}`);
            answer += cycleValue * x;
        }
        if (instruction.type === "add") {
            x += instruction.value;
        }
    });

    resolving.succeed(`Jour ${chalk.red(10)} - the answer is ${answer}`);
    console.timeEnd("exec");
}

main();
