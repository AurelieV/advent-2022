const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const monkeys = new Map();

    rawInput.split("\n").forEach((line) => {
        const [, id, instruction] = line.match(/^(.+): (.+)$/);
        const value = parseInt(instruction);
        if (!isNaN(value)) {
            monkeys.set(id, { id, value });
        } else {
            const [id1, operator, id2] = instruction.split(" ");
            monkeys.set(id, { id, operator, id1, id2 });
        }
    });

    function getValue(id) {
        const monkey = monkeys.get(id);
        if (monkey.value !== undefined) {
            return monkey.value;
        }
        const value1 = getValue(monkey.id1);
        const value2 = getValue(monkey.id2);
        const value = eval(`${value1} ${monkey.operator} ${value2}`);
        monkey.value = value;

        return value;
    }

    const answer = getValue("root");

    resolving.succeed(`Jour ${chalk.red(21)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
